# Balance

Story shifts are tuned with a simple model (`tools/balance-sim.js`): each case costs seconds of
running clock for every active check, players make occasional mistakes (each costs a strike and
10 seconds), and one chai break is used per shift. Run `node tools/balance-sim.js` after changing
quotas or timers in `STORY_SHIFTS`.

## Per-case time (seconds, before player speed)

| Check | Seconds |
|---|---|
| Names, dates, decide and tap | 4.0 |
| Scale against the permit | +1.0 |
| Scrub the crate and compare species | +3.8 |
| UV check of the seal | +1.5 |

Player profiles: **novice** 1.45× slower with 11% mistakes, **average** 1.15× with 6%, **sharp**
0.85× with 2.5%. Mistakes rise with the number of rules in play.

The same figures set the S-grade speed target (`parSecondsPerCase` in `game.js`): S needs 95%+
accuracy and a speed at least 10% faster than par for that shift's checks.

## Current table (simulated win rate per shift attempt)

| Shift | Quota | Time | Novice | Average | Sharp |
|---|---|---|---|---|---|
| 1 | 4 | 60s | 98% | 100% | 100% |
| 2 | 5 | 70s | 95% | 99% | 100% |
| 3 | 5 | 85s | 81% | 99% | 100% |
| 4 | 5 | 95s | 78% | 98% | 100% |
| 5 | 6 | 110s | 54% | 93% | 100% |
| 6 | 6 | 100s | 39% | 89% | 100% |
| 7 | 7 | 110s | 30% | 85% | 100% |
| 8 | 7 | 105s | 25% | 81% | 100% |
| 9 | 8 | 115s | 20% | 81% | 100% |
| 10 | 8 | 108s | 10% | 68% | 100% |

Novices are expected to improve as they play, so later-shift novice rates are a floor, not a target.

## History

- **Before this pass** quotas rose to 9 while timers fell to 80 seconds. Once all five checks were
  active an average player needed about 12 seconds per case, so Shifts 8–10 were won 0–6% of the
  time (nearly always by running out of time), while Shifts 1–2 left 60+ seconds unused. The old
  S grade (7 seconds per case) was out of reach after Shift 3.

## Checked by bot

A browser bot played a fresh campaign end to end (all ten shifts, the three team activities,
nine bribe offers refused, Kiboko caught in Shift 10, Chief Inspector ending) with no errors.
