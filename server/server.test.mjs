// Run: node --test server/server.test.mjs   (Jiwe is faked; no network calls)
import test from 'node:test';
import assert from 'node:assert/strict';

process.env.JIWE_CLIENT_ID = 'client';
process.env.JIWE_CLIENT_SECRET = 'secret';
process.env.JIWE_API_USERNAME = 'user';
process.env.JIWE_API_KEY = 'key';
const { rankFromLeaderboard, resetState } = await import('./jiwe.mjs');
const { server } = await import('./server.mjs');

const realFetch = globalThis.fetch;
await new Promise(resolve => server.listen(0, resolve));
const base = `http://localhost:${server.address().port}`;
test.after(() => server.close());

const GAME = '/games/paws-for-inspection/';
const REDIRECT = 'https://quirklog.com/games/paws-for-inspection/';
const jwt = (claims) => `h.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.s`;
const soon = () => Math.floor(Date.now() / 1000) + 900;

// Fake Jiwe: only calls leaving for jiwe.io are intercepted; calls to our own server go through.
let calls = [];
const fakeJiwe = (responder) => {
  calls = [];
  resetState();
  globalThis.fetch = async (url, opts) => {
    if (String(url).startsWith(base)) return realFetch(url, opts);
    calls.push({ url: String(url), opts });
    const [status, body] = responder(String(url), opts);
    return { ok: status < 400, status, json: async () => body };
  };
};
const post = (route, body, origin = 'https://quirklog.com') => fetch(`${base}${GAME}api/${route}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: origin },
  body: JSON.stringify(body)
});

test('serves the game and health check; redirects to the game path', async () => {
  fakeJiwe(() => [500, {}]);
  const page = await fetch(`${base}${GAME}`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type'), /text\/html/);
  assert.equal((await fetch(`${base}${GAME}manifest.webmanifest`)).headers.get('content-type'), 'application/manifest+json');
  assert.equal((await fetch(`${base}/health`)).status, 200);
  const redirect = await fetch(`${base}/games/paws-for-inspection`, { redirect: 'manual' });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get('location'), GAME);
  assert.equal((await fetch(`${base}${GAME}..%2fserver%2fjiwe.mjs`)).status, 404);
  assert.equal((await fetch(`${base}${GAME}%E0%A4%A`)).status, 400);
});

test('config says whether Jiwe is switched on', async () => {
  const res = await fetch(`${base}${GAME}api/config`);
  assert.deepEqual(await res.json(), { enabled: true });
});

test('token exchange: Basic auth, form body, profile from id_token', async () => {
  const idToken = jwt({ sub: 'abc', nickname: 'snape254', exp: soon() });
  fakeJiwe(() => [200, { id_token: idToken, access_token: 'x' }]);
  const res = await post('auth/token', { code: 'c', codeVerifier: 'v', redirectUri: REDIRECT });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.profile.sub, 'abc');
  assert.equal(body.profile.nickname, 'snape254');
  assert.equal(calls[0].opts.headers.Authorization, `Basic ${Buffer.from('client:secret').toString('base64')}`);
  assert.equal(calls[0].opts.headers['Content-Type'], 'application/x-www-form-urlencoded');
  const form = new URLSearchParams(calls[0].opts.body.toString());
  assert.equal(form.get('code_verifier'), 'v');
  assert.equal(form.get('client_secret'), null); // never in the body as well
});

test('token exchange rejects unknown redirect URIs', async () => {
  fakeJiwe(() => [200, {}]);
  const res = await post('auth/token', { code: 'c', codeVerifier: 'v', redirectUri: 'https://evil.example/' });
  assert.equal(res.status, 400);
  assert.equal(calls.length, 0);
});

test('XP: amount comes from the grade table, id_token goes in X-API-TOKEN', async () => {
  const idToken = jwt({ sub: 'abc', exp: soon() });
  fakeJiwe(() => [200, { type: 'OK' }]);
  const res = await post('xp', { idToken, shift: 3, grade: 'S', xp: 999999 });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).xp, 50);
  const sent = JSON.parse(calls[0].opts.body);
  assert.equal(sent.xpEarned, 50);
  assert.equal(calls[0].opts.headers['X-API-TOKEN'], idToken);
  assert.equal(calls[0].opts.headers['X-API-KEY'], 'key');
});

test('XP: a replay only earns the difference to the best grade already paid', async () => {
  const idToken = jwt({ sub: 'abc', exp: soon() });
  fakeJiwe(() => [200, { type: 'OK' }]);
  assert.equal((await (await post('xp', { idToken, shift: 2, grade: 'A' })).json()).xp, 40);
  assert.deepEqual(await (await post('xp', { idToken, shift: 2, grade: 'B' })).json(), { xp: 0, already: true });
  assert.equal((await (await post('xp', { idToken, shift: 2, grade: 'S' })).json()).xp, 10);
  assert.equal(calls.length, 2);
});

test('XP rejects expired tokens and invalid results without calling Jiwe', async () => {
  fakeJiwe(() => [200, { type: 'OK' }]);
  const expired = jwt({ sub: 'abc', exp: Math.floor(Date.now() / 1000) - 10 });
  assert.equal((await post('xp', { idToken: expired, shift: 3, grade: 'S' })).status, 401);
  const fresh = jwt({ sub: 'abc', exp: soon() });
  assert.equal((await post('xp', { idToken: fresh, shift: 11, grade: 'S' })).status, 400);
  assert.equal((await post('xp', { idToken: fresh, shift: 2, grade: 'Z' })).status, 400);
  assert.equal(calls.length, 0);
});

test('leaderboard: ranks by XP ourselves; percentile only with 20+ players', () => {
  const few = [{ id: 'a', XP: 10 }, { id: 'me', currentXP: 50, username: 'snape' }, { id: 'b', xp: 30 }];
  const r1 = rankFromLeaderboard(few, 'me');
  assert.equal(r1.rank, 1);
  assert.equal(r1.total, 3);
  assert.equal(r1.topPercent, null);
  assert.deepEqual(r1.top[0], { rank: 1, name: 'snape', xp: 50, you: true });
  const many = Array.from({ length: 40 }, (_, i) => ({ id: `p${i}`, XP: 1000 - i * 10 }));
  many.push({ id: 'me', XP: 965 });
  const r2 = rankFromLeaderboard(many, 'me');
  assert.equal(r2.rank, 5);
  assert.equal(r2.topPercent, 13);
  assert.equal(r2.top.length, 10);
  assert.equal(rankFromLeaderboard(many, 'nobody').rank, null);
});

test('leaderboard is cached briefly so the menu does not hammer Jiwe', async () => {
  fakeJiwe(() => [200, { leaderboard: [{ id: 'a', XP: 10 }] }]);
  await fetch(`${base}${GAME}api/leaderboard`);
  const res = await fetch(`${base}${GAME}api/leaderboard?sub=a`);
  assert.equal((await res.json()).rank, 1);
  assert.equal(calls.length, 1);
});

test('requests from other sites are refused', async () => {
  fakeJiwe(() => [200, {}]);
  const res = await post('xp', { idToken: jwt({ sub: 'abc', exp: soon() }), shift: 1, grade: 'S' }, 'https://evil.example');
  assert.equal(res.status, 403);
  assert.equal(calls.length, 0);
});
