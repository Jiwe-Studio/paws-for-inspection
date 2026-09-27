# 🐾 Exotic Customs: Pet Detective

> An arcade border-control comedy inspection simulator inspired by *Papers, Please* and *Ace Ventura: Pet Detective*.

Playable MVP web game prototype built with pure Vanilla JavaScript, HTML5 Canvas, CSS3, and the Web Audio API. Zero external dependencies.

---

## 🎮 Game Concept & Core Loop

You are a customs inspector stationed at the **Border Customs & Exotic Species Regulatory Agency (B.C.E.S.R.A.)**. Your duty is to inspect incoming passengers and their declared animal imports under high-stakes, 90-second shift timers.

* **Inspect the Animal & Carrier:**
  * Use the **Solvent Sponge** or **Blacklight UV** tool to scrub away suspicious paint, dyes, or bulky transit vests in real-time.
  * Check the **digital bio-mass scale** against the permitted weight limit.
* **Examine Official CITES Permits:**
  * Verify owner name against passenger credentials.
  * Check permit expiration date against today's customs date.
  * Match declared species with the actual creature revealed in the carrier.
  * Ensure the authentic holographic security seal is present.
* **Deliver the Stamp:**
  * **APPROVE (A)** or **DENY (D)**.
  * Correct calls grant +100 points.
  * Violations cost time and award Strikes (3 strikes and your shift is terminated!).

---

## 🚀 How to Play

1. Clone this repository or download [`game.html`](./game.html).
2. Double-click `game.html` to open it in any web browser (Chrome, Edge, Firefox, Safari).
3. Click **START 90s SHIFT** (or press any key) to enable audio and begin inspecting!

### Controls

| Action | Control / Hotkey |
| :--- | :--- |
| **Approve Entry** | `A` or Click **APPROVE** |
| **Deny Entry** | `D` or Click **DENY** |
| **Toggle Inspection Tool** | `Space` / `W` or Click Tool Buttons |
| **Scrub Disguise / UV Inspect** | Click & Drag across the animal viewport |
| **Toggle Retro SFX** | Sound Button in header |

---

## 🛠️ Built With

* **HTML5 Canvas 2D:** Interactive scratch-reveal surface using `globalCompositeOperation = 'destination-out'`.
* **Web Audio API:** 100% procedurally synthesized retro sound effects (stamps, buzzers, victory arpeggios, sponge squeaks).
* **Pure CSS3 & Emojis:** Zero external image assets required for immediate offline playability.
