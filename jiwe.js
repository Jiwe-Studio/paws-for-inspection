/* ==========================================================================
   PAWS FOR INSPECTION - JIWE: login, XP for story shifts, the XP leaderboard
   Talks only to our own server at ./api/ (server/server.mjs, same origin), which holds the
   Client Secret and Wallet API key. Stays switched off until that server reports it has its
   keys (GET api/config), so the game works exactly as before without them.
   ========================================================================== */

// Public values only. Everything secret lives in the server's Kubernetes Secret.
const JIWE_CLIENT_ID = '89df6890-d098-11f1-a0b1-02fff7a9a7e5';
const JIWE_AUTH_URL = 'https://id.jiwe.io/auth';

const Jiwe = (() => {
  const SESSION_KEY = 'paws_jiwe_session';
  const PENDING_KEY = 'paws_jiwe_pending';
  const REPORTED_KEY = 'paws_jiwe_reported';
  const GRADE_ORDER = ['D', 'C', 'B', 'A', 'S'];
  const XP_BY_GRADE = { S: 50, A: 40, B: 30, C: 20, D: 10 }; // display only; the server decides
  let isEnabled = false;

  // The game's own folder, e.g. https://quirklog.com/games/paws-for-inspection/
  const gameUrl = () => `${location.origin}${location.pathname.replace(/[^/]*$/, '')}`;
  const api = (route) => `${gameUrl()}api/${route}`;
  const enabled = () => isEnabled;

  function base64Url(bytes) {
    return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function readJson(storage, key, fallback) {
    try {
      return JSON.parse(storage.getItem(key) || 'null') || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function session() {
    const s = readJson(localStorage, SESSION_KEY, null);
    return s && s.idToken && s.profile && s.profile.sub && s.expiresAt > Date.now() + 30000 ? s : null;
  }

  // Is the server holding Jiwe keys? Checked once at startup.
  async function init() {
    try {
      const res = await fetch(api('config'));
      isEnabled = res.ok && (await res.json()).enabled === true;
    } catch (e) {
      isEnabled = false;
    }
    return isEnabled;
  }

  // Standard PKCE, done in the browser: the verifier never leaves this device until the
  // one-time code is exchanged by our server.
  async function login() {
    if (!enabled()) return;
    const verifier = base64Url(crypto.getRandomValues(new Uint8Array(32)));
    const challenge = base64Url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
    const state = base64Url(crypto.getRandomValues(new Uint8Array(16)));
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ verifier, state }));
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: JIWE_CLIENT_ID,
      redirect_uri: gameUrl(),
      scope: 'openid profile in-app-purchases rewards',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256'
    });
    location.href = `${JIWE_AUTH_URL}?${params.toString()}`;
  }

  // Back from Jiwe: exchange the code, then clean the URL.
  async function finishLogin() {
    const query = new URLSearchParams(location.search);
    if (!query.has('code') && !query.has('error')) return null;
    history.replaceState(null, '', gameUrl());
    if (query.get('error')) return { error: 'Jiwe login was cancelled or refused.' };

    const pending = readJson(sessionStorage, PENDING_KEY, null);
    sessionStorage.removeItem(PENDING_KEY);
    if (!pending || pending.state !== query.get('state')) return { error: 'Login expired. Please try again.' };

    try {
      const res = await fetch(api('auth/token'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: query.get('code'), codeVerifier: pending.verifier, redirectUri: gameUrl() })
      });
      const data = await res.json();
      if (!res.ok || !data.profile || !data.profile.sub) return { error: 'Jiwe login failed. Please try again.' };
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));
      return { profile: data.profile };
    } catch (e) {
      return { error: 'Could not reach the Jiwe service.' };
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  // Best grade reported to Jiwe per story shift, on this device.
  const reported = () => readJson(localStorage, REPORTED_KEY, {});

  // XP for a cleared story shift. Only a better grade than the one already reported sends
  // again, and the server pays only the difference, so replays can't farm XP.
  async function reportShift(shift, grade) {
    const s = session();
    if (!s) return { status: 'logged-out' };
    const done = reported();
    const previous = done[shift];
    if (previous && GRADE_ORDER.indexOf(previous) >= GRADE_ORDER.indexOf(grade)) return { status: 'already' };
    try {
      const res = await fetch(api('xp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: s.idToken, shift, grade })
      });
      const data = await res.json();
      if (res.status === 401) { logout(); return { status: 'logged-out' }; }
      if (!res.ok) return { status: 'error' };
      done[shift] = grade;
      localStorage.setItem(REPORTED_KEY, JSON.stringify(done));
      return data.already ? { status: 'already' } : { status: 'sent', xp: data.xp };
    } catch (e) {
      return { status: 'error' };
    }
  }

  // The XP leaderboard. Works logged out too; with a session it also finds the player's rank.
  async function standing() {
    const s = session();
    try {
      const res = await fetch(api(`leaderboard${s ? `?sub=${encodeURIComponent(s.profile.sub)}` : ''}`));
      return res.ok ? await res.json() : null;
    } catch (e) {
      return null;
    }
  }

  return { init, enabled, session, login, finishLogin, logout, reportShift, standing, reported, XP_BY_GRADE };
})();
