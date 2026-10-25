// Paws for Inspection: one Node process (no dependencies) that serves the static game and
// its small Jiwe API from the same origin, so the browser needs no CORS and never sees a key.
//
//   GET  /health                                     pod probes
//   GET  /games/paws-for-inspection/...              the game files
//   POST /games/paws-for-inspection/api/auth/token   { code, codeVerifier, redirectUri }
//   POST /games/paws-for-inspection/api/xp           { idToken, shift, grade }
//   GET  /games/paws-for-inspection/api/leaderboard?sub=...
//   GET  /games/paws-for-inspection/api/config       { enabled } - is Jiwe switched on?
//
// Run locally: node server/server.mjs   (serves the repo on http://localhost:8940)

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { configured, exchangeCode, reportXp, leaderboard } from './jiwe.mjs';

const PORT = Number(process.env.PORT || 8940);
const PREFIX = '/games/paws-for-inspection/';
const STATIC_DIR = path.resolve(process.env.STATIC_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://quirklog.com,http://localhost:8940')
  .split(',').map(s => s.trim()).filter(Boolean);
const MAX_BODY = 8 * 1024;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav'
};
// Scripts and styles are cache-busted with ?v=N; art and audio aren't, so a short cache.
const SHORT_CACHE = new Set(['.svg', '.png', '.jpg', '.webp', '.mp3', '.ogg', '.wav']);

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

const sendJson = (res, status, body) => send(res, status, JSON.stringify(body), {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
});

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY) { reject(new Error('too_large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function api(req, res, route, url) {
  // Only the game's own pages may call the API. Browsers always send Origin on POST.
  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return sendJson(res, 403, { error: 'origin_not_allowed' });
  if (route === 'config' && req.method === 'GET') return sendJson(res, 200, { enabled: configured() });
  if (!configured()) return sendJson(res, 503, { error: 'jiwe_not_configured' });

  let body = {};
  if (req.method === 'POST') {
    try {
      const raw = await readBody(req);
      body = raw ? JSON.parse(raw) : {};
    } catch (e) {
      return sendJson(res, 400, { error: 'bad_request' });
    }
  }
  try {
    let result;
    if (req.method === 'POST' && route === 'auth/token') result = await exchangeCode(body);
    else if (req.method === 'POST' && route === 'xp') result = await reportXp(body);
    else if (req.method === 'GET' && route === 'leaderboard') result = await leaderboard(url.searchParams.get('sub'));
    else result = [404, { error: 'not_found' }];
    return sendJson(res, result[0], result[1]);
  } catch (e) {
    return sendJson(res, 502, { error: 'upstream_error' });
  }
}

async function serveFile(req, res, relative) {
  if (relative === '' || relative.endsWith('/')) relative += 'index.html';
  const file = path.resolve(STATIC_DIR, relative);
  // No escaping the game folder, and no dotfiles.
  if (!file.startsWith(STATIC_DIR + path.sep) || relative.split('/').some(p => p.startsWith('.'))) {
    return send(res, 404, 'Not found');
  }
  try {
    const data = await fs.readFile(file);
    const ext = path.extname(file).toLowerCase();
    const headers = { 'Content-Type': TYPES[ext] || 'application/octet-stream' };
    if (SHORT_CACHE.has(ext)) headers['Cache-Control'] = 'public, max-age=3600';
    return send(res, 200, req.method === 'HEAD' ? undefined : data, headers);
  } catch (e) {
    return send(res, 404, 'Not found');
  }
}

export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch (e) {
    return send(res, 400, 'Bad request');
  }

  if (pathname === '/health') return sendJson(res, 200, { ok: true });
  if (pathname === '/' || pathname === PREFIX.slice(0, -1)) {
    // Relative, so the redirect stays on https behind the load balancer.
    return send(res, 301, '', { Location: PREFIX });
  }
  if (!pathname.startsWith(PREFIX)) return send(res, 404, 'Not found');

  const relative = pathname.slice(PREFIX.length);
  if (relative.startsWith('api/')) return api(req, res, relative.slice(4), url);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  return serveFile(req, res, relative);
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => {
    console.log(`Paws for Inspection on http://localhost:${PORT}${PREFIX} (Jiwe ${configured() ? 'on' : 'off'})`);
  });
}
