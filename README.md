# 🐾 Exotic Customs: Pet Detective

> An arcade border-control comedy inspection simulator inspired by *Papers, Please* and *Ace Ventura: Pet Detective*.

Playable MVP web game prototype built with pure Vanilla JavaScript, HTML5 Canvas, CSS3, and the Web Audio API. Zero external dependencies.

---

## 🎮 Game Concept & Core Loop

You're a rookie inspector at the **Wanyama Customs Authority (W.C.A.)** desk at Mzinga International Airport. Passengers arrive with their animals and a Wildlife Transit Permit. Your job is to catch the smugglers without turning away honest travellers.

Every case is generated fresh: a clean case is built first, then 0–2 rules are broken, drawn from what the current shift has taught you. About half of all cases are legal.

* **Check the permit:**
  * The owner's name must match the passenger **exactly**. Forgers use one-letter typos.
  * The "Valid Until" date must not be before today's customs date.
  * The scale must not read above the permit's max weight, even by a little.
* **Scrub the crate** (from Shift 3): every animal arrives under the same crate cover. Scrub it with the 🧽 Solvent Sponge and check the animal matches the declared species. *Provoke Sound* can give a disguise away too.
* **Check the seal** (from Shift 4): switch to the 🔦 Blacklight UV. A genuine seal glows green. A forgery stays dark.
* **Stamp it:** **APPROVE (A)** or **DENY (D)**. Correct calls score +100. A wrong call is a strike and costs 10 seconds, and the game shows you which field you missed. Three strikes and you're sent home.

---

## 🚀 How to Play

1. Clone this repository or download the repo.
2. Double-click `index.html` to open it in any web browser (Chrome, Edge, Firefox, Safari).
3. Click **START 90s SHIFT** (or press any key) to enable audio and begin inspecting!

### Controls

| Action | Control / Hotkey |
| :--- | :--- |
| **Approve Entry** | `A` or Click **APPROVE** |
| **Deny Entry** | `D` or Click **DENY** |
| **Switch Sponge / UV** | `Space` / `W` or click the tool buttons |
| **Scrub the crate** | Click & drag (or swipe) across the crate |
| **Toggle Retro SFX** | Sound Button in header |

---

## 🛠️ Built With

* **HTML5 Canvas 2D:** Interactive scratch-reveal surface using `globalCompositeOperation = 'destination-out'`.
* **Web Audio API:** 100% procedurally synthesized retro sound effects (stamps, buzzers, victory arpeggios, sponge squeaks).
* **Pure CSS3 & Emojis:** Zero external image assets required for immediate offline playability.
