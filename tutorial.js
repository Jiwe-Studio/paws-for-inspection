/* ==========================================================================
   PAWS FOR INSPECTION - DIALOGUE, SPOTLIGHT & ORIENTATION
   Loaded before game.js; everything here only touches game globals at runtime.
   ========================================================================== */

// --- CREW (emoji portraits until the Claude Design art lands in art/crew/) ---
// Portraits live in art/crew/<art>_<mood>.svg (Claude Design Batch 5).
const STAFF_MOODS = ["neutral", "happy", "worried", "talking"];
const CREW = {
  rehema: { name: "Mama Rehema", role: "Senior Inspector", emoji: "👵🏾", art: "mama_rehema", moods: STAFF_MOODS, defaultMood: "talking" },
  wiji: { name: "Wiji Njoroge", role: "Lab Tech", emoji: "👩🏾‍🔬", art: "wiji_njoroge", moods: STAFF_MOODS, defaultMood: "talking" },
  kiprop: { name: "Chief Kiprop", role: "Chief Inspector", emoji: "👮🏾‍♂️", art: "chief_kiprop", moods: STAFF_MOODS, defaultMood: "talking" },
  tony: { name: "Tony Wafula", role: "Rookie Inspector", emoji: "🧑🏾‍💼", art: "tony_wafula", moods: STAFF_MOODS, defaultMood: "talking" },
  baraka: { name: "Ranger Baraka", role: "Kenya Wildlife Service", emoji: "🧑🏾‍🌾", art: "ranger_baraka", moods: STAFF_MOODS, defaultMood: "talking" },
  rookie: { name: "You", role: "Inspector", emoji: "🧑🏾", art: "rookie", moods: ["neutral", "happy", "busted", "chief"], defaultMood: "neutral" },
  police: { name: "Airport Police", role: "Jambo Int'l", emoji: "👮🏾", art: "airport_police", moods: ["neutral"], defaultMood: "neutral" },
  biscuit: { name: "Biscuit", role: "Sniffer Dog", emoji: "🐕", art: "biscuit", moods: ["neutral", "happy", "sniffing", "alert"], defaultMood: "neutral" },
  kiboko: { name: "Big Man Kiboko", role: "Smuggling Boss", emoji: "🦛", art: "big_man_kiboko", moods: ["neutral", "smug", "angry", "busted"], defaultMood: "smug" }
};

// --- DIALOGUE ---
// Dialogue.run(steps) plays a list of steps and resolves true when finished, or false if
// it was closed early (e.g. the player went back to the menu).
// A step is { who, text, spot, until, position }:
//   spot     () => [elements] to highlight; everything else is dimmed
//   until    () => Promise; the step waits for it instead of a tap, and the desk stays usable
//   position 'top' | 'bottom' | 'crate'; defaults to whichever side the spotlight isn't on
const Dialogue = (() => {
  const layer = document.getElementById('dialogueLayer');
  const backdrop = document.getElementById('dialogueBackdrop');
  const svg = document.getElementById('spotlightSvg');
  const box = document.getElementById('dialogueBox');
  const portrait = document.getElementById('dialoguePortrait');
  const nameEl = document.getElementById('dialogueName');
  const textEl = document.getElementById('dialogueText');
  const nextEl = document.getElementById('dialogueNext');

  let generation = 0;
  let waitingTap = null;
  let typing = null;
  let spotGetter = null;
  let spotTimer = null;

  const SVG_NS = "http://www.w3.org/2000/svg";

  function getSpotRects() {
    if (!spotGetter) return [];
    return spotGetter()
      .filter(el => el && el.offsetParent !== null)
      .map(el => el.getBoundingClientRect());
  }

  function drawSpotlight() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const rects = getSpotRects();
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = "";
    if (!spotGetter) return;

    const pad = 6;
    const mask = document.createElementNS(SVG_NS, 'mask');
    mask.setAttribute('id', 'spotMask');
    const full = document.createElementNS(SVG_NS, 'rect');
    Object.entries({ x: 0, y: 0, width: w, height: h, fill: 'white' }).forEach(([k, v]) => full.setAttribute(k, v));
    mask.appendChild(full);

    const outlines = [];
    rects.forEach(r => {
      const attrs = { x: r.left - pad, y: r.top - pad, width: r.width + pad * 2, height: r.height + pad * 2, rx: 10 };
      const hole = document.createElementNS(SVG_NS, 'rect');
      Object.entries({ ...attrs, fill: 'black' }).forEach(([k, v]) => hole.setAttribute(k, v));
      mask.appendChild(hole);
      const outline = document.createElementNS(SVG_NS, 'rect');
      Object.entries({ ...attrs, class: 'spotlight-outline' }).forEach(([k, v]) => outline.setAttribute(k, v));
      outlines.push(outline);
    });

    const defs = document.createElementNS(SVG_NS, 'defs');
    defs.appendChild(mask);
    svg.appendChild(defs);
    const dim = document.createElementNS(SVG_NS, 'rect');
    Object.entries({ x: 0, y: 0, width: w, height: h, mask: 'url(#spotMask)', class: 'spotlight-dim' }).forEach(([k, v]) => dim.setAttribute(k, v));
    svg.appendChild(dim);
    outlines.forEach(o => svg.appendChild(o));
  }

  function placeBox(position) {
    box.classList.remove('pos-top', 'pos-bottom', 'pos-crate');
    box.style.top = "";
    let pos = position;
    if (!pos) {
      const rects = getSpotRects();
      if (rects.length === 0) {
        pos = 'bottom';
      } else {
        const centre = rects.reduce((sum, r) => sum + r.top + r.height / 2, 0) / rects.length;
        pos = centre > window.innerHeight * 0.5 ? 'top' : 'bottom';
      }
    }
    if (pos === 'crate') {
      const r = elViewportBox.getBoundingClientRect();
      box.style.top = `${Math.max(8, r.top + r.height / 2 - box.offsetHeight / 2)}px`;
    }
    box.classList.add(`pos-${pos}`);
  }

  function typeText(text) {
    clearInterval(typing);
    textEl.textContent = "";
    let i = 0;
    return new Promise(resolve => {
      typing = setInterval(() => {
        i += 2;
        textEl.textContent = text.slice(0, i);
        if (i >= text.length) {
          clearInterval(typing);
          typing = null;
          resolve();
        }
      }, 24);
      finishTyping = () => {
        clearInterval(typing);
        typing = null;
        textEl.textContent = text;
        resolve();
      };
    });
  }
  let finishTyping = () => {};

  function advance() {
    if (typing) {
      finishTyping();
      return;
    }
    if (waitingTap) {
      const done = waitingTap;
      waitingTap = null;
      done(true);
    }
  }

  // After an action step (scrub, stamp, tool), the finger lifting off the screen would land on the
  // next line as a tap and skip it. Ignore taps briefly after the step changes.
  let ignoreTapsUntil = 0;

  layer.addEventListener('click', () => {
    if (layer.classList.contains('passthrough') || Date.now() < ignoreTapsUntil) return;
    advance();
  });

  async function show(step, gen) {
    const who = CREW[step.who] || CREW.rehema;
    setArt(portrait, `crew/${who.art}_${step.mood || who.defaultMood}`, who.emoji);
    // A line can move the scene somewhere else (e.g. from the rescue handover to the CCTV room).
    if (step.bg && layer.classList.contains('scene-mode')) {
      setBackdrop(sceneBackdrop(step.bg));
    }
    nameEl.textContent = who.name;
    spotGetter = step.spot || null;
    layer.classList.remove('hidden');

    const waitsForAction = typeof step.until === 'function';
    layer.classList.toggle('passthrough', waitsForAction);
    nextEl.classList.toggle('hidden', waitsForAction);

    textEl.textContent = step.text;
    placeBox(step.position || (waitsForAction && !step.spot ? 'crate' : null));
    drawSpotlight();
    clearInterval(spotTimer);
    spotTimer = setInterval(drawSpotlight, 250);

    const typed = typeText(step.text);
    if (waitsForAction) {
      const result = await Promise.race([step.until(), aborted(gen)]);
      finishTyping();
      ignoreTapsUntil = Date.now() + 500;
      return result;
    }
    await typed;
    return new Promise(resolve => {
      waitingTap = resolve;
    });
  }

  let abortResolvers = [];
  function aborted(gen) {
    return new Promise(resolve => {
      if (gen !== generation) resolve(null);
      else abortResolvers.push(resolve);
    });
  }

  // Story illustrations are complete scenes and show in full; plain backgrounds get the desk band.
  function setBackdrop(path) {
    backdrop.style.backgroundImage = path ? `url(${path})` : '';
    backdrop.classList.toggle('full-scene', Boolean(path && path.includes('/story/')));
  }

  // opts.backdrop: an image path shown full-screen behind the speakers (story scenes away from the desk).
  async function run(steps, opts = {}) {
    const gen = ++generation;
    layer.classList.toggle('scene-mode', Boolean(opts.backdrop));
    setBackdrop(opts.backdrop);
    for (const step of steps) {
      const result = await show(step, gen);
      if (gen !== generation || result === null) return false;
    }
    if (gen === generation) hide();
    return true;
  }

  // Show one step and resolve with its result (the tutorial's verdict prompts use this).
  async function ask(step) {
    const gen = ++generation;
    const result = await show(step, gen);
    return gen === generation ? result : null;
  }

  function hide() {
    layer.classList.remove('scene-mode');
    clearInterval(spotTimer);
    clearInterval(typing);
    typing = null;
    spotGetter = null;
    svg.innerHTML = "";
    layer.classList.add('hidden');
  }

  function close() {
    generation++;
    if (waitingTap) {
      const done = waitingTap;
      waitingTap = null;
      done(null);
    }
    abortResolvers.forEach(r => r(null));
    abortResolvers = [];
    hide();
  }

  window.addEventListener('resize', () => {
    if (!layer.classList.contains('hidden')) drawSpotlight();
  });

  return {
    run,
    ask,
    close,
    hide,
    isOpen: () => !layer.classList.contains('hidden'),
    isBlocking: () => !layer.classList.contains('hidden') && !layer.classList.contains('passthrough'),
    handleKey(e) {
      if (!this.isBlocking()) return false;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        advance();
      }
      return true;
    }
  };
})();

// Resolve when the game emits a matching event.
function waitForGameEvent(name, match = () => true) {
  return new Promise(resolve => {
    const off = onGameEvent((evt, data) => {
      if (evt === name && match(data)) {
        off();
        resolve(true);
      }
    });
  });
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- SPOTLIGHT TARGETS ---
const SPOT = {
  permit: () => [elPermitCard],
  names: () => [elPassName, elDocOwner.parentElement],
  dates: () => [elDocExpiry.parentElement, elDocCurrentDate.parentElement],
  stamps: () => [elBtnApprove, elBtnDeny],
  approve: () => [elBtnApprove],
  deny: () => [elBtnDeny],
  weights: () => [elScale.parentElement, elDocWeight.parentElement],
  crate: () => [elViewportBox, elBtnToolSponge],
  species: () => [elViewportBox, elDocSpecies.parentElement],
  provoke: () => [elBtnVocalize],
  uvButton: () => [elBtnToolUV],
  seal: () => [elDocSeal]
};

// --- SHIFT BRIEFINGS (run once, the first time a shift adds a new rule) ---
const CLOCK_WAITS = { who: "rehema", text: "The clock waits until your first stamp. Nenda!" };

const SHIFT_INTROS = {
  weight: {
    firstCase: { violations: ["weight"] },
    steps: [
      { who: "rehema", text: "Habari ya asubuhi! New problem today: people are hiding contraband inside the carriers." },
      { who: "rehema", text: "Read the scale, then compare it with the permit's max weight. Even a little over is a DENY.", spot: SPOT.weights },
      CLOCK_WAITS
    ]
  },
  crate: {
    firstCase: { violations: ["disguise"], disguiseId: "donkey_zebra" },
    steps: [
      { who: "rehema", text: "From today every animal arrives in a covered crate. There's a dye cartel painting farm animals to look like fancy breeds." },
      { who: "rehema", text: "Grab the sponge and scrub the cover off.", spot: SPOT.crate, until: () => waitForGameEvent('reveal') },
      { who: "rehema", text: "Now compare the animal with the declared species. If they don't match, it's a DENY.", spot: SPOT.species },
      { who: "rehema", text: "Stuck? Provoke Sound makes the animal call out. A zebra doesn't bray.", spot: SPOT.provoke },
      CLOCK_WAITS
    ]
  },
  uv: {
    firstCase: { violations: ["seal"] },
    steps: [
      { mood: "happy", who: "wiji", text: "Hi, hi! I'm Wiji from the lab. Forgers are printing almost perfect seals, so I built you a toy." },
      { who: "wiji", text: "Tap the UV Light.", spot: SPOT.uvButton, until: () => waitForGameEvent('tool', t => t === 'uv') },
      { who: "wiji", text: "A genuine W.C.A. seal glows green under UV. This one stays dark, so it's a fake!", spot: SPOT.seal },
      { mood: "happy", who: "rehema", text: "Karibu to the team, Wiji. Rookie, check the seal on every permit from now on." },
      CLOCK_WAITS
    ]
  }
};

// --- ORIENTATION (Shift 0) ---
const Tutorial = {
  expecting: null,

  onVerdict(approved) {
    if (!this.expecting) return;
    const resolve = this.expecting;
    this.expecting = null;
    resolve(approved);
  },

  nextVerdict() {
    return new Promise(resolve => {
      this.expecting = resolve;
    });
  },

  stamp(approved, correct) {
    const c = gameState.currentCase;
    sound.init();
    sound.playStamp(approved);
    showStampImprint(approved);
    setPassengerMood(c, approved ? 'relieved' : (c.shouldApprove ? 'nervous' : 'busted'));
    if (correct) {
      sound.playSuccess();
      c.violations.forEach(v => describeViolation(c, v).els.forEach(el => el.classList.add('flagged')));
    } else {
      sound.playStrike();
      triggerScreenShake();
      setTimeout(() => { elStampOverlay.className = "rubber-stamp-overlay"; }, 700);
    }
  },

  // Keep asking until the player stamps correctly; explain after each miss. Returns false if aborted.
  async stampStep(prompt, expectApprove, hintSteps) {
    let text = prompt;
    hintSteps = hintSteps.map(s => ({ mood: "worried", ...s }));
    for (;;) {
      const approved = await Dialogue.ask({ who: "rehema", text, until: () => this.nextVerdict() });
      if (approved === null) return false;
      const correct = approved === expectApprove;
      this.stamp(approved, correct);
      if (correct) {
        Dialogue.hide();
        return true;
      }
      if (!(await Dialogue.run(hintSteps))) return false;
      text = expectApprove ? "Try again: APPROVE this one." : "Try again: DENY this one.";
    }
  },

  async start() {
    const isReplay = StorageManager.isTutorialDone();
    [elMainMenuModal, elBulletinModal, elGameOverModal].forEach(m => m.classList.add('hidden'));
    clearInterval(gameState.shiftInterval);
    Object.assign(gameState, {
      mode: 'tutorial', active: true, resolving: false, introPause: false,
      score: 0, strikes: 0, quotaMetCount: 0, isTimeFrozen: false
    });
    this.expecting = null;
    updateHUD();

    const ok = await this.script();
    if (!ok) return;

    StorageManager.setTutorialDone();
    gameState.active = false;
    Dialogue.hide();
    if (isReplay) {
      showMainMenu();
    } else {
      prepareStoryShift(0);
    }
  },

  async script() {
    // Case A: everything is fine.
    generateNewCase({
      violations: [], passengerName: "Njeri Wambui", animalSpecies: "Border Collie", expiryDays: 214,
      speech: "Habari officer! Is it your first day? You look nervous."
    });
    if (!(await Dialogue.run([
      { mood: "happy", who: "rehema", text: "Karibu, rookie! I'm Mama Rehema. Thirty years on this desk, and I retire next month. Chief Kiprop says I have to train you first, so sikiza vizuri." },
      { who: "rehema", text: "Every passenger brings an animal and a Wildlife Transit Permit. You check the permit, then stamp it APPROVE or DENY.", spot: SPOT.permit },
      { who: "rehema", text: "First, the name. The owner on the permit must match the passenger exactly. Njeri Wambui and Njeri Wambui. Good.", spot: SPOT.names },
      { who: "rehema", text: "Next, the date. 'Valid until' must not be before today's date, down here in the corner. This one is fine.", spot: SPOT.dates }
    ]))) return false;
    if (!(await this.stampStep("Everything checks out. Stamp it APPROVE!", true, [
      { who: "rehema", text: "Eh! Nothing is wrong with this one. Turn away honest people and they complain to the Chief.", spot: SPOT.approve }
    ]))) return false;
    if (!(await Dialogue.run([{ mood: "happy", who: "rehema", text: "Safi! That's the job. Now you try one on your own." }]))) return false;

    // Case B: expired permit.
    generateNewCase({
      violations: ["expired"], passengerName: "Otieno Ochieng", animalSpecies: "Kienyeji Rooster", expiryDays: -12,
      speech: "Good morning, young one. My rooster and I are in a hurry."
    });
    if (!(await this.stampStep("Check the name and the date, then stamp it.", false, [
      { who: "rehema", text: `Look at the date again. It expired ${formatDate(gameState.currentCase.expiry)}, and today is ${TODAY_STR}. Expired means DENY.`, spot: SPOT.dates }
    ]))) return false;
    if (!(await Dialogue.run([{ mood: "happy", who: "rehema", text: "Sharp eyes! An expired permit is always a DENY, however polite the mzee is." }]))) return false;

    // Case C: one-letter name typo.
    generateNewCase({
      violations: ["name"], passengerName: "Brian Kamau", permitOwner: "Brian Kamua", animalSpecies: "Persian Cat", expiryDays: 90,
      speech: "Niaje officer! We keep it quick, sawa?"
    });
    if (!(await this.stampStep("One more. Take your time.", false, [
      { who: "rehema", text: "Read the names slowly. The passenger is Kamau, but the permit says Kamua. One letter is enough for a DENY.", spot: SPOT.names }
    ]))) return false;

    return Dialogue.run([
      { mood: "happy", who: "rehema", text: "Wueh! You caught the typo. Forgers love one-letter mistakes." },
      { who: "rehema", text: "The scale, the crates and the seals come later. I'll show you each one when it's time." },
      { who: "rehema", text: "Your first real shift has a timer and a quota. Three wrong stamps and the Chief sends you home. Usijali, you're ready!" }
    ]);
  }
};
