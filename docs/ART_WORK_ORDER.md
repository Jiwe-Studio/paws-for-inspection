# Paws for Inspection: Art Work Order for Claude Design

This is the brief and the prompt script for producing the art for Paws for Inspection in Claude Design.

> **Renamed from "Pet Detective".** If a batch was already made under the old name, paste the
> updated brief below into that project and ask Claude Design to swap the name and wordmark.
Work through the batches **in order**. Each batch is a separate Claude Design project (or a page
inside one project). Paste the **Project brief** first and keep it at the top of every project, then
paste that batch's prompt.

**Rule for the whole job:** approve Batch 0 (style guide + test scene) before starting anything else.
If the test scene doesn't feel hand-made and specific to Nairobi, fix the style guide first. Don't
push on through 80 assets.

---

## How the art gets into the game

- **Format:** SVG for everything (Claude Design works in HTML/SVG, and SVG stays sharp on every
  screen size). No embedded raster images, no external fonts inside the SVGs (convert text to paths,
  or leave text out and let the game render it).
- **Hand-off:** share the Claude Design link with Claude Code and say which batch it is. Claude Code
  reads it and saves each asset into the repo at the path given below. You can also export the SVGs
  and drop them into those folders yourself.
- **Naming:** use the exact ids in this document. The game looks assets up by id
  (e.g. `art/animals/border_collie.svg`). Until an asset exists, the game keeps showing the emoji,
  so batches can land one at a time.

```
art/
  ui/          icons, buttons, stamps, seal, logo
  scene/       desk, counter window, crate, permit paper, scale
  animals/     legal animals + disguises (declared look + revealed)
  passengers/  8 travellers x 4 expressions
  crew/        5 coworkers x 4 expressions
```

---

## Project brief (paste at the top of every batch)

> **Game:** *Paws for Inspection*, a comedy airport-customs game in the spirit of *Papers,
> Please*. You're a rookie **customs inspector in charge of searching, checking and clearing
> animals** (not a detective) at the fictional **Wanyama Customs Authority (W.C.A.)**
> animal-import desk at the fictional **Mzinga International Airport**, Nairobi. Passengers bring
> animals with a Wildlife Transit Permit. You check names, dates, weights and seals, scrub crate
> covers to catch disguised animals (donkeys painted as zebras, capybaras dyed as retrievers), then
> stamp APPROVE or DENY. The tone is warm and cheeky, like a Kenyan sitcom, never mean-spirited.
>
> **Audience:** young Kenyan players on mid-range Android phones first, then tablets and desktop.
> Played in short 90-second shifts.
>
> **Visual direction: "Nairobi signwriter".** Draw on hand-painted shop signs, matatu art
> lettering, kanga and kitenge patterns, rubber stamps, carbon-copy government forms and
> sun-faded airport paint. Flat vector shapes with a **consistent 3px dark outline**, slightly
> imperfect hand-drawn edges, limited shading (one shadow tone per colour), and subtle texture
> (paper grain, halftone dots, worn paint) rather than gradients.
>
> **Palette (use only these, plus tints and shades of them):**
> | Token | Hex | Use |
> |---|---|---|
> | ink | `#1E2240` | outlines, text |
> | charcoal | `#2A2623` | dark surfaces |
> | paper | `#F3E6C8` | permits, cards |
> | bone | `#FBF6EA` | highlights |
> | ochre | `#E0A23A` | primary accent, sun-faded yellow |
> | terracotta | `#C4552D` | warm accent, desk wood |
> | matatu-teal | `#1F8A8A` | cool accent, uniforms |
> | kanga-red | `#B8202E` | DENY, danger |
> | stamp-green | `#2E7D4F` | APPROVE, success |
> | uv-violet | `#6B2FD6` | blacklight mode |
> | uv-glow | `#7CFF3A` | genuine seal under UV |
>
> **Typography:** headings in a chunky hand-painted signwriter style. Permit fields in a typewriter
> monospace. Body in a friendly rounded sans. Suggest Google Fonts for each.
>
> **Avoid (these make it look AI-generated):** emoji anywhere; glossy gradients, glows and neon
> (except the UV seal); dark-slate "dashboard" cards; perfectly symmetrical faces; plastic 3D
> rendering; generic stock-illustration people; inconsistent line weights between assets;
> text baked into illustrations.
>
> **Characters:** Kenyan people with varied ages, body types, skin tones, hairstyles and clothing
> (office wear, shuka, kitenge, hijab, suits, streetwear). Caricatured for comedy but affectionate,
> never stereotyped.

---

## Batch 0: Style guide + test scene (approve before anything else)

> Using the project brief, create a one-page **style guide** and a **test scene**.
>
> **Style guide:** palette swatches with token names; the three fonts at real sizes; outline and
> shadow rules shown on a sample shape; a texture sample (paper grain, halftone); a button in
> normal, pressed and disabled states; and a do/don't strip showing what to avoid.
>
> **Test scene (the core game screen at 1280×720):** the inspection desk seen from the officer's
> side. A counter window at the top-left with **one passenger** (Njeri Wambui, a middle-aged market
> trader in a kitenge headwrap, looking impatient). Below her, a **wooden crate** half-scrubbed so
> a **Border Collie** peeks through. On the right, a **Wildlife Transit Permit** on cream paper
> with typewriter fields (Owner, Valid Until, Declared Species, Max Weight, Microchip ID) and a
> holographic **W.C.A. seal**. At the bottom, a big green **APPROVE** stamp button and a red
> **DENY** stamp button. At the top, a slim HUD with the shift timer, score and three strike
> marks.
>
> Then show the **same scene at phone portrait size (390×844)**: compact HUD, passenger strip,
> crate, compact permit, and APPROVE/DENY at thumb reach at the bottom, with no scrolling.

**Check before approving:** Does it feel specific to Nairobi rather than generic? Is the line
weight the same everywhere? Could the phone version be played one-handed?

---

## Batch 1: UI kit → `art/ui/`

> Using the approved style guide, create the UI kit as separate SVGs on a transparent background.
>
> **Icons** (24×24 grid, 2px stroke in `ink`, drawn to work at 20–32px): `icon-menu`, `icon-home`,
> `icon-petdex` (a scrapbook), `icon-suspects` (a mugshot board), `icon-sound-on`, `icon-sound-off`,
> `icon-help`, `icon-sponge`, `icon-uv` (a blacklight torch), `icon-coffee` (a chai cup),
> `icon-provoke` (a whistle), `icon-timer`, `icon-strike`, `icon-star`, `icon-lock`, `icon-close`.
>
> **Stamps:** `stamp-approved` and `stamp-denied`, as rubber-stamp imprints with ink texture and
> slightly uneven edges, 360×140. Also `stamp-button-approve` and `stamp-button-deny`, the physical
> rubber stamps seen from above, 200×200.
>
> **Seal:** `seal-genuine` (holographic W.C.A. crest, 140×88), `seal-uv-genuine` (the same crest
> glowing `uv-glow` on dark violet), `seal-uv-fake` (dark, no glow, a faint smudge).
>
> **Logo:** `logo-wca`, a W.C.A. crest badge (a customs shield with an animal silhouette, 256×256),
> and `logo-game`, the "Paws for Inspection" wordmark in the signwriter style (a paw print
> can stand in for a letter or sit inside a rubber-stamp frame), with the tagline "Animal
> clearance at Mzinga International" as a smaller line, 800×300.
>
> **Frames:** `panel-paper` (a 9-slice-friendly cream paper panel with a torn or perforated edge)
> and `panel-board` (a 9-slice wooden or cork notice board for menus and the Pet-Dex).

---

## Batch 2: Scene props → `art/scene/`

> Using the style guide, create the scene props as separate transparent SVGs:
>
> - `desk-bg`: the officer's desk surface, a worn wooden top with a desk mat, a chai ring stain
>   and a sticker or two. Tileable horizontally, 1920×1080.
> - `counter-window`: the passenger's window frame (a glass partition with a speaking grille and a
>   W.C.A. sign above), 800×360, with the centre left clear so the passenger shows through.
> - `airport-bg`: a blurred background behind the passenger (queue barriers, departure board,
>   an "Mzinga International" sign), 800×360.
> - `crate-cover`: the tarp or crate front the player scrubs off, 560×280, with stencilled
>   "MZINGA AIR CARGO · LIVE ANIMAL". It must be **identical for every animal**.
> - `crate-inside`: the inside of the empty crate (straw, a water bowl) shown behind the animal,
>   560×280.
> - `permit-paper`: a blank Wildlife Transit Permit form with ruled field boxes and labels but
>   **no values** (the game fills them in), 480×620. A carbon-copy form style.
> - `scale`: a digital bio-mass scale with a green LED window, left blank for the game's number,
>   420×90.
> - `bulletin-paper`: an official memo sheet with a W.C.A. letterhead and a "RESTRICTED" stamp,
>   blank body, 620×800.

---

## Batch 3: Animals → `art/animals/`

All animals are 512×512 on a transparent background, three-quarter view, standing on an
invisible floor line at y=460, facing left, with room for a wobble animation. Expressive and
funny, not realistic.

> **Legal animals** (one pose each):
> `border_collie`, `persian_cat`, `bengal_cat`, `scarlet_macaw`, `pygmy_hedgehog`,
> `huacaya_alpaca`, `holland_lop_rabbit`, `kienyeji_rooster` (a proud village rooster, chest out),
> `galla_goat` (a white Kenyan goat with a slightly judgemental face).
>
> **Disguised animals.** The player only sees these after scrubbing the crate, so each one is
> the **real animal with its botched disguise half coming off**:
> - `donkey_zebra`: a grey donkey with dripping painted stripes and taped-up ears
> - `capybara_dog`: a capybara with patchy blonde dye and a dog collar
> - `cheetah_cat`: a cheetah cub smeared with brown shoe polish, wearing a cat bell
> - `macaw_vest`: three macaws poking out of a zipped poodle costume
> - `warthog_pig`: a warthog piglet in pink blush, tusks showing
> - `croc_wiener`: a baby Nile crocodile in a knit dachshund sweater with felt ears
> - `penguin_butler`: a penguin chick in a duck costume with a bow tie
>
> **Pet-Dex portraits:** for each of the 16 above, a 256×256 circular badge crop (`*_dex.svg`),
> plus one `dex_locked.svg` silhouette with a question mark.

---

## Batch 4: Passengers → `art/passengers/`

Bust portraits, 400×400, transparent, head and shoulders framed for the counter window. **Four
expressions each**, with identical framing so they can be swapped:
`_neutral`, `_nervous` (sweating, shifty eyes), `_relieved` (approved), `_busted` (caught).

> - `njeri_wambui`: a market trader in her 50s, kitenge headwrap, big earrings, impatient
> - `otieno_ochieng`: a dignified mzee in his 70s, flat cap and tweed jacket, walking stick
> - `brian_kamau`: a young man in a bucket hat and a designer tracksuit, overconfident
> - `akinyi_adhiambo`: a glamorous auntie in a wide sun hat and sunglasses
> - `mwangi_karanja`: a doctor in his 40s, glasses, stethoscope over a suit
> - `chebet_kiprono`: an Honourable (politician), sharp suit, lapel pin, "do you know who I am"
> - `kevin_mutua`: a cowboy-hat-wearing tout, gold chain, big grin
> - `halima_hassan`: a young woman in a hijab, gentle and a little anxious
>
> Plus `custom_suspect_1` to `custom_suspect_4`: four neutral, adaptable silhouette-style
> travellers used when players add their friends to the roster.

---

## Batch 5: Your coworkers → `art/crew/`

Same format as the passengers (400×400, four expressions: `_neutral`, `_happy`, `_worried`,
`_talking`). These characters carry the story and the onboarding, so they need the most
personality.

> - `mama_rehema`: **your mentor.** A veteran inspector in her late 50s, weeks from retirement.
>   Reading glasses on a chain, faded W.C.A. uniform with lots of badges, a flask of chai, and a
>   warm "I've seen everything" face.
> - `chief_kiprop`: **the boss.** A stern Chief Inspector with a moustache, a clipboard and a
>   crisp uniform. Secretly soft.
> - `tony_wafula`: **your rival.** A fellow rookie who started the same week. A too-neat uniform,
>   hair gel, competitive grin.
> - `wiji_njoroge`: **the lab tech.** Safety goggles pushed up on her braids, lab coat over a
>   hoodie, holding the UV torch. An excitable gadget nerd.
> - `biscuit`: **the sniffer dog.** A scruffy brown Kenyan mutt in a tiny W.C.A. vest. For Biscuit
>   the expressions are `_neutral`, `_happy`, `_sniffing` and `_alert`.
>
> Also: `big_man_kiboko`, **the smuggling boss** (in the style of a hippo-like crime lord in a
> leopard-print shirt, gold rings, sunglasses indoors), with `_neutral`, `_smug`, `_angry` and
> `_busted`.

---

## Batch 6: Screens → `art/ui/`

> Using everything above, design full-screen mockups at desktop (1280×720), tablet (1024×768)
> and phone portrait (390×844) for:
> 1. **Main menu:** the logo, Story and Arcade buttons, and the high score.
> 2. **Daily bulletin:** a memo with the shift title, story text and today's rules.
> 3. **Dialogue scene:** a coworker portrait with a speech box and a "tap to continue" hint.
> 4. **Shift report:** the rank stamp, accuracy, cases, smugglers busted and strikes.
> 5. **Pet-Dex:** a scrapbook grid of discovered and locked animals.
>
> Also export `app-icon` at 512×512 and 192×192 (the W.C.A. crest on ochre) for the phone home
> screen.

---

## Status

| Batch | Contents | Status |
|---|---|---|
| 0 | Style guide + test scene | not started |
| 1 | UI kit | not started |
| 2 | Scene props | not started |
| 3 | Animals (16 + dex badges) | not started |
| 4 | Passengers (8 × 4 + 4 custom) | not started |
| 5 | Crew + Kiboko (6 × 4) | not started |
| 6 | Screens + app icon | not started |
