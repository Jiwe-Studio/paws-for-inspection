# Paws for Inspection: Audio Work Order

The game already plays sound: everything below has a stand-in synthesised in code. Each
recorded file you add **replaces** its stand-in automatically, one at a time, so there is no need
to deliver everything at once.

## How to add a file

1. Save it under `audio/` in the folder shown below (`audio/sfx/`, `audio/music/`, `audio/ambience/`).
2. List it in `audio/manifest.json` under the name the game uses. Several files can share a name;
   the game picks one at random each time, which keeps repeated sounds from feeling robotic:

```json
{
  "music": { "menu": "music/menu.mp3" },
  "sfx": { "stamp-approve": ["sfx/stamp-approve-1.mp3", "sfx/stamp-approve-2.mp3"] },
  "ambience": { "airport-loop": "ambience/airport-loop.mp3" }
}
```

Or just drop the files in the folders and tell Claude Code; it will fill in the manifest.

## File format

- **MP3, 44.1 kHz, stereo** (plays everywhere, including iPhone Safari). 128–192 kbps is plenty.
- **Sound effects:** mono is fine, trimmed tight (no silence at the start), peaks around −3 dB.
- **Music loops:** must loop seamlessly (the end flows into the start with no gap or click).
- **Size budget:** aim for under 3 MB of audio in total so the game still loads fast on mobile data.

## Where to get it

- **Record on a phone:** paper, stamps, envelopes, chai, the crate sounds. A quiet room and a
  real rubber stamp go a long way.
- **Free libraries:** freesound.org (filter to the **CC0** licence so no credit is required),
  Pixabay sound effects. Keep a note of each file's source and licence in `audio/CREDITS.md`.
- **Commission:** the music, ideally from a Kenyan producer (benga / genge guitar over a
  light Afro-house groove). This gives the game its identity and a story to tell.
- **Avoid:** AI-generated music, and anything with an unclear licence.

---

## Music → `audio/music/`

Tempo **108 BPM**, key of **D major**. The three desk stems must be the **same length and tempo**
so they play in sync; the game fades the extra layers in and out.

| Name in manifest | File | Length | Description |
|---|---|---|---|
| `menu` | `menu.mp3` | 60–90 s loop | Relaxed, warm. Benga-style guitar, light percussion. Plays on the menu, map and reports. |
| `desk-base` | `desk-base.mp3` | 30–60 s loop | The working groove at the desk: guitar and bass, unhurried but alert. |
| `desk-percussion` | `desk-percussion.mp3` | same as base | Shakers and kick only. Fades in when the shift clock drops under 20 seconds. |
| `desk-tension` | `desk-tension.mp3` | same as base | A low drone or held strings. Fades in on the second strike. |

Later, when there are more scenes: `story-sting` (3–5 s, plays when a story scene opens),
`shift-won` (3–4 s jingle), `fired` (3 s comic sad trombone or guitar), `activity` (a team-activity
loop), `finale` (Big Man Kiboko's theme: brassy, villainous, comic).

## Sound effects → `audio/sfx/`

| Name in manifest | When it plays | Description | Variants |
|---|---|---|---|
| `stamp-approve` | APPROVE stamp | A firm rubber stamp on paper, slightly bright | 2–3 |
| `stamp-deny` | DENY stamp | The same stamp, harder and lower | 2–3 |
| `paper-slide` | A new permit arrives | A sheet of paper sliding across a desk | 2–3 |
| `scrub` | Scrubbing a crate | A short brush-on-wood scrub (plays in quick repeats) | 3–4 |
| `crate-pop` | The crate cover comes off | A cardboard or tarp flap popping open | 1–2 |
| `uv-click` | Switching on the UV light | A torch button click with a faint electric hum | 1 |
| `correct` | A correct call | A short, bright two-note chime | 1 |
| `strike` | A wrong call | A dull buzzer, comic rather than harsh | 1 |
| `tick` | The last 10 seconds | A clock tick | 1 |
| `chai` | Chai break | A slurp of tea, a cup on a saucer | 1–2 |
| `counter-bell` | A passenger arrives (optional) | A small counter bell | 1 |

### Animal calls (Provoke Sound, K9 training)

| Name in manifest | Animal |
|---|---|
| `animal-donkey` | Donkey bray (the "zebra" gives itself away) |
| `animal-capybara` | Capybara chirp / whistle |
| `animal-cheetah` | Cheetah chirp or a low growl (also used for the warthog and crocodile) |
| `animal-bark` | Dog bark (also the goat's stand-in) |
| `animal-meow` | Cat meow |
| `animal-squeak` | A small squeak / chirp (hedgehogs, rabbits, birds) |

Optional extras for later, if each animal gets its own voice: `animal-rooster`, `animal-goat`,
`animal-parrot`, `animal-penguin`, `animal-croc`, `animal-warthog`.

## Ambience → `audio/ambience/`

| Name in manifest | Description |
|---|---|
| `airport-loop` | 30–60 s seamless loop of a busy terminal: distant chatter, trolleys, footsteps. Quiet and even. |
| `pa` | Short PA announcements (5–10 s each) with the two-tone chime, list several. Ideas: *"Abiria wote wanaosafiri kwenda Mombasa…"* / *"Final call for flight JA 210 to Kisumu"* / *"Would the owner of a large painted donkey please report to the W.C.A. desk."* Record in Swahili and English with a friend; light radio-style EQ. |

## Status

| Group | Status |
|---|---|
| Sound system (volumes, settings panel, layering, sample loading) | ✅ in game |
| Music | synthesised stand-in |
| Sound effects | synthesised stand-ins |
| Ambience | synthesised stand-in (hum + chime) |
