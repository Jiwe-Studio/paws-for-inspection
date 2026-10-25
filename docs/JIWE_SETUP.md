# Jiwe login, XP and leaderboard: setup

Players can log in with Jiwe, earn XP for every story shift they clear (more for better
grades), and see the Jiwe XP leaderboard from the main menu. Until the server has its keys the
feature stays switched off and the game works exactly as before.

## How it fits together

```
Browser (quirklog.com/games/paws-for-inspection/)
   │  same origin, no CORS, no keys
   ▼
server/server.mjs  ── one Node process in the paws-for-inspection-prod pod
   │  serves the game files + /api/*; keys from the paws-for-inspection-secrets Secret
   ▼
id.jiwe.io (token exchange)   abacus.jiwe.io (XP rewards, leaderboard)
```

- The **game** (`jiwe.js`) only knows public values: the Client ID and the login page URL.
  It does PKCE itself and asks `api/config` whether Jiwe is switched on.
- The **server** (`server/jiwe.mjs`) holds the Client Secret and the API username/key. It
  finishes the login, sends XP and reads the leaderboard. It never trusts amounts from the
  game: XP comes from a grade table on the server.

| Route | Does |
|---|---|
| `GET api/config` | `{ enabled }`: true once all four keys are present |
| `POST api/auth/token` | `{ code, codeVerifier, redirectUri }` → `{ idToken, profile, expiresAt }` |
| `POST api/xp` | `{ idToken, shift, grade }` → `{ xp }` (only the difference to the best grade already paid) |
| `GET api/leaderboard?sub=` | `{ total, rank, xp, topPercent, top[10] }` (cached 30 s) |

## XP

| Grade | XP per shift |
|---|---|
| S | 50 |
| A | 40 |
| B | 30 |
| C | 20 |
| D | 10 |

A full S-rank campaign is worth 500 XP. Replaying a shift only earns the difference to the
best grade already paid (an A then an S earns 40 + 10). The server remembers this in memory
and the game remembers it in `paws_jiwe_reported`, which is enough for XP because XP has no
cash value. Anything that pays real money (airtime, cowrie) would need a durable store.

The percentile ("Top 13%") only appears once 20 or more players are on the board; below
that the game shows "#3 of 12 inspectors". It is never estimated.

## 1. Jiwe app (Jiwe dashboard)

Redirect URIs, exactly, with the trailing slash:
- `https://quirklog.com/games/paws-for-inspection/`
- `http://localhost:8940/games/paws-for-inspection/` (local testing)

## 2. The Kubernetes Secret (once, from the jiwe-mgmt-bastion)

Run this yourself; never commit the values or paste them in chat:

```bash
kubectl -n jiweio create secret generic paws-for-inspection-secrets \
  --from-literal=JIWE_CLIENT_ID='...' \
  --from-literal=JIWE_CLIENT_SECRET='...' \
  --from-literal=JIWE_API_USERNAME='...' \
  --from-literal=JIWE_API_KEY='...'
kubectl -n jiweio rollout restart deployment/paws-for-inspection-prod
```

To rotate keys later, run the same command with `--dry-run=client -o yaml | kubectl apply -f -`
and restart the deployment.

Optional variables: `JIWE_API_BASE` (default `https://abacus.jiwe.io/rest/api/v1`),
`JIWE_TOKEN_URL`, `ALLOWED_ORIGINS`, `ALLOWED_REDIRECTS`.

## 3. Local testing

```bash
node server/server.mjs
```

Serves the repo on `http://localhost:8940/games/paws-for-inspection/` with Jiwe off. Export
the four `JIWE_*` variables in your shell first to switch it on. Tests (Jiwe faked):

```bash
node --test server/server.test.mjs
```
