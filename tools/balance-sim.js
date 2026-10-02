// Balance model for story shifts. Run: node tools/balance-sim.js  (or pass a JSON table)
// Monte Carlo of a story shift: seconds of running clock per case, mistakes cost 10s + a strike.
const SKILLS = {
  novice:  { speed: 1.45, err: 0.11 },
  average: { speed: 1.15, err: 0.06 },
  sharp:   { speed: 0.85, err: 0.025 }
};

function caseTime(rules, skill) {
  let t = 2.0 + 1.2 + 0.8;                 // names, dates, decide + tap
  if (rules.includes('weight')) t += 1.0;  // read the scale against the permit
  if (rules.includes('disguise')) t += 3.8; // scrub the crate, compare species
  if (rules.includes('seal')) t += 1.5;    // switch to UV, look at the seal
  const jitter = Math.exp((Math.random() - 0.5) * 0.5); // ±25%
  return t * skill.speed * jitter;
}

function errorRate(rules, skill) {
  // More rules to hold in your head means more misses, especially for new players.
  return skill.err * (1 + 0.12 * (rules.length - 2));
}

function playShift(shift, skill, opts) {
  let time = shift.t + (opts.chai || 5);
  let correct = 0, strikes = 0, cases = 0;
  let firstFree = opts.introFree;
  while (correct < shift.q) {
    const dt = caseTime(shift.v, skill);
    if (firstFree) firstFree = false; else time -= dt;
    if (time <= 0) return { win: false, why: 'time' };
    cases++;
    if (Math.random() < errorRate(shift.v, skill)) {
      strikes++; time -= 10;
      if (strikes >= 3) return { win: false, why: 'strikes' };
    } else correct++;
  }
  return { win: true, left: time, cases };
}

function run(shifts, n = 20000) {
  const rows = [];
  for (const s of shifts) {
    const row = { shift: s.n, quota: s.q, time: s.t };
    for (const [name, skill] of Object.entries(SKILLS)) {
      let wins = 0, left = 0, timeouts = 0, struck = 0;
      for (let i = 0; i < n; i++) {
        const r = playShift(s, skill, { introFree: [2, 3, 4].includes(s.n), chai: s.n >= 9 ? 10 : 5 });
        if (r.win) { wins++; left += r.left; } else if (r.why === 'time') timeouts++; else struck++;
      }
      row[name] = `${Math.round(100 * wins / n)}%` + (wins ? ` (${(left / wins).toFixed(0)}s left)` : '');
      row[`${name}Fail`] = `t${Math.round(100 * timeouts / n)} s${Math.round(100 * struck / n)}`;
    }
    rows.push(row);
  }
  return rows;
}

const ALL = ['expired', 'name', 'weight', 'disguise', 'seal'];
// Current story shifts (keep in step with STORY_SHIFTS in game.js).
const CURRENT = [
  { n: 1, q: 4, t: 60, v: ['expired', 'name'] },
  { n: 2, q: 5, t: 70, v: ['expired', 'name', 'weight'] },
  { n: 3, q: 5, t: 85, v: ['expired', 'name', 'weight', 'disguise'] },
  { n: 4, q: 5, t: 95, v: ALL },
  { n: 5, q: 6, t: 110, v: ALL },
  { n: 6, q: 6, t: 100, v: ALL },
  { n: 7, q: 7, t: 110, v: ALL },
  { n: 8, q: 7, t: 105, v: ALL },
  { n: 9, q: 8, t: 115, v: ALL },
  { n: 10, q: 8, t: 108, v: ALL }
];
const which = process.argv[2] || 'current';
const table = which === 'current' ? CURRENT : JSON.parse(require('fs').readFileSync(which, 'utf8')).map(s => ({ ...s, v: s.v === 'ALL' ? ALL : s.v }));
console.table(run(table));
module.exports = { run };
