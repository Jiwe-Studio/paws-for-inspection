// Paws for Inspection: the Jiwe calls that need the app's secrets.
//
// Why a server: the token exchange needs the app's Client Secret, and every Wallet API call
// (XP rewards, leaderboard) needs the API username/key. None of those can live in the public
// game. They reach this process as environment variables from the Kubernetes Secret
// `paws-for-inspection-secrets` (see k8s/README.md). The browser does PKCE itself and sends
// the one-time code + verifier here to finish login.
//
// Jiwe behaviour this relies on was confirmed live on Swahili Word League and JiweChess:
// Basic-auth token exchange, form-urlencoded body, profile decoded from the id_token (never
// /me), X-API-TOKEN = id_token on reward calls, leaderboard XP read as XP ?? currentXP ?? xp
// and ranked ourselves. No `resource` parameter is needed.

const TOKEN_ENDPOINT = process.env.JIWE_TOKEN_URL || 'https://id.jiwe.io/token';
const API_BASE = process.env.JIWE_API_BASE || 'https://abacus.jiwe.io/rest/api/v1';
const ALLOWED_REDIRECTS = (process.env.ALLOWED_REDIRECTS || 'https://quirklog.com/games/paws-for-inspection/,http://localhost:8940/games/paws-for-inspection/')
  .split(',').map(s => s.trim()).filter(Boolean);

// XP for clearing a story shift, by grade. Set here, not in the game, so a modified client
// can't ask for arbitrary amounts.
export const XP_BY_GRADE = { S: 50, A: 40, B: 30, C: 20, D: 10 };
const SHIFTS = 10;
const MIN_PLAYERS_FOR_PERCENT = 20;
const LEADERBOARD_SIZE = 10;
const LEADERBOARD_CACHE_MS = 30 * 1000;

export const configured = () => Boolean(process.env.JIWE_CLIENT_ID && process.env.JIWE_CLIENT_SECRET
  && process.env.JIWE_API_USERNAME && process.env.JIWE_API_KEY);

export function decodeJwt(token) {
  try {
    const part = String(token).split('.')[1];
    return JSON.parse(Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  } catch (e) {
    return null;
  }
}

const walletHeaders = () => ({
  'X-API-USERNAME': process.env.JIWE_API_USERNAME,
  'X-API-KEY': process.env.JIWE_API_KEY,
  'Content-Type': 'application/json'
});

export async function exchangeCode({ code, codeVerifier, redirectUri }) {
  if (!code || !codeVerifier || !ALLOWED_REDIRECTS.includes(redirectUri)) {
    return [400, { error: 'invalid_request' }];
  }
  // Client authentication goes in the Basic header only; Jiwe rejects it in the body as well.
  const basic = Buffer.from(`${process.env.JIWE_CLIENT_ID}:${process.env.JIWE_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri, code_verifier: codeVerifier })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id_token) return [502, { error: data.error || 'token_exchange_failed' }];

  // Never call /me: decode the id_token. A login only counts if it carries a real `sub`.
  const claims = decodeJwt(data.id_token);
  if (!claims || !claims.sub) return [502, { error: 'no_subject' }];
  return [200, {
    idToken: data.id_token,
    profile: { sub: claims.sub, nickname: claims.nickname || claims.preferred_username || claims.name || 'Inspector' },
    expiresAt: claims.exp ? claims.exp * 1000 : Date.now() + 15 * 60 * 1000
  }];
}

// Best grade already paid per player and shift, so a replay only earns the difference
// (an S after an A earns 10, a second S earns nothing). Kept in memory: a pod restart forgets
// it, and the game's own record of what it reported is the second line of defence. XP has no
// cash value, so that is enough; anything that pays real money needs a durable store.
const paid = new Map();

export async function reportXp({ idToken, shift, grade }) {
  const claims = decodeJwt(idToken);
  if (!claims || !claims.sub) return [401, { error: 'not_logged_in' }];
  if (claims.exp && claims.exp * 1000 < Date.now()) return [401, { error: 'expired' }];
  const shiftNumber = Number(shift);
  const full = XP_BY_GRADE[grade];
  if (!Number.isInteger(shiftNumber) || shiftNumber < 1 || shiftNumber > SHIFTS || !full) {
    return [400, { error: 'invalid_result' }];
  }
  const key = `${claims.sub}:${shiftNumber}`;
  const already = paid.get(key) || 0;
  const xp = full - already;
  if (xp <= 0) return [200, { xp: 0, already: true }];

  // Jiwe checks the id_token itself, so a forged token fails here rather than earning XP.
  const res = await fetch(`${API_BASE}/rewards/xp`, {
    method: 'POST',
    headers: { ...walletHeaders(), 'X-API-TOKEN': idToken },
    body: JSON.stringify({
      xpEarned: xp,
      description: `Paws for Inspection · Shift ${shiftNumber} · ${grade}-rank`,
      gameSessionId: `paws-shift-${shiftNumber}-${grade}`,
      metadata: { shift: shiftNumber, grade }
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.type === 'ERROR') {
    return [res.status === 401 ? 401 : 502, { error: data.message || 'xp_failed' }];
  }
  paid.set(key, full);
  leaderboardCache = null;
  return [200, { xp }];
}

export function rankFromLeaderboard(entries, sub) {
  const pointsOf = (e) => e.XP ?? e.currentXP ?? e.xp ?? 0;
  const sorted = [...entries].sort((a, b) => pointsOf(b) - pointsOf(a));
  const index = sub ? sorted.findIndex(e => e.id === sub) : -1;
  const total = sorted.length;
  const rank = index >= 0 ? index + 1 : null;
  return {
    total,
    rank,
    xp: index >= 0 ? pointsOf(sorted[index]) : 0,
    // Only claim a percentile once enough players exist for it to mean something.
    topPercent: rank && total >= MIN_PLAYERS_FOR_PERCENT ? Math.max(1, Math.ceil((rank / total) * 100)) : null,
    top: sorted.slice(0, LEADERBOARD_SIZE).map((e, i) => ({
      rank: i + 1,
      name: e.username || 'Inspector',
      xp: pointsOf(e),
      you: Boolean(sub) && e.id === sub
    }))
  };
}

let leaderboardCache = null;

export async function leaderboard(sub) {
  if (!leaderboardCache || leaderboardCache.at + LEADERBOARD_CACHE_MS < Date.now()) {
    const res = await fetch(`${API_BASE}/leaderboard`, {
      method: 'POST',
      headers: walletHeaders(),
      body: JSON.stringify({ rewardType: 'xp', maxEntries: 1000, bestPointsRanking: 'highest' })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.type === 'ERROR') return [502, { error: data.message || 'leaderboard_failed' }];
    leaderboardCache = { at: Date.now(), entries: Array.isArray(data.leaderboard) ? data.leaderboard : [] };
  }
  return [200, rankFromLeaderboard(leaderboardCache.entries, sub)];
}

// For tests.
export function resetState() {
  paid.clear();
  leaderboardCache = null;
}
