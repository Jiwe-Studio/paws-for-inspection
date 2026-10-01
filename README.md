# Paws for Inspection

> Animal clearance at Jambo International Airport. A comedy airport-customs game in the spirit of *Papers, Please*: you're the rookie inspector in charge of searching, checking and clearing every animal that lands.

**Play:** https://jiwe-studio.github.io/paws-for-inspection/

Playable MVP web game prototype built with pure Vanilla JavaScript, HTML5 Canvas, CSS3, and the Web Audio API. Zero external dependencies.

---

## 🎮 Game Concept & Core Loop

You're a rookie inspector at the **Wanyama Customs Authority (W.C.A.)** desk at Jambo International Airport. Passengers arrive with their animals and a Wildlife Transit Permit. Your job is to catch the smugglers without turning away honest travellers.

Every case is generated fresh: a clean case is built first, then 0–2 rules are broken, drawn from what the current shift has taught you. About half of all cases are legal.

* **Check the permit:**
  * The owner's name must match the passenger **exactly**. Forgers use one-letter typos.
  * The "Valid Until" date must not be before today's customs date.
  * The scale must not read above the permit's max weight, even by a little.
* **Scrub the crate** (from Shift 3): every animal arrives under the same crate cover. Scrub it with the 🧽 Solvent Sponge and check the animal matches the declared species. *Provoke Sound* can give a disguise away too.
* **Check the seal** (from Shift 4): switch to the 🔦 Blacklight UV. A genuine seal glows green. A forgery stays dark.
* **Stamp it:** **APPROVE (A)** or **DENY (D)**. Correct calls score +100. A wrong call is a strike and costs 10 seconds, and the game shows you which field you missed. Three strikes and you're sent home.

---

New players start with **Orientation**: Mama Rehema, a veteran inspector, walks you through three practice cases with no timer. Shifts 2, 3 and 4 open with a short briefing when a new rule arrives, and the clock waits for your first stamp.

**Story:** ten shifts at Jambo International Airport with Chief Kiprop, rival rookie Tony, Wiji from the lab and Biscuit the sniffer dog, chasing Big Man Kiboko's wildlife-trafficking ring. Team activities after Shifts 2, 5 and 8 (K9 training, a warehouse raid, quiz night) unlock perks, and in Shift 10 Kiboko comes to your counter himself. Your accuracy across the campaign, and whether you take the bribes passengers slide under the window, bend the story at Shifts 3, 6 and 9 and decide which of three endings you get. Each shift report grades you on accuracy and speed, tracks your personal best and can be shared.

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
