/* ==========================================================================
   PAWS FOR INSPECTION - GAME CONTROLLER
   Architecture: Modular JS Engine with Story Campaign, Daily Bulletin,
   Arcade Score Attack, and LocalStorage Persistence.
   ========================================================================== */

// --- 1. AUDIO SYNTHESIZER ENGINE (Pure Web Audio API - Zero External Assets) ---
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playStamp(approved) {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = approved ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(approved ? 130 : 90, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.18);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);

    // Clack impact noise
    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);
  }

  playSponge() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  playSuccess() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.18, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.26);
    });
  }

  playStrike() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(130, now);
    osc2.frequency.setValueAtTime(142, now);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.36);
    osc2.stop(now + 0.36);
  }

  playCoffee() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.3);
    osc.frequency.linearRampToValueAtTime(400, now + 0.5);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);
  }

  playVocal(soundType) {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (soundType === 'donkey') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.linearRampToValueAtTime(250, now + 0.2);
      osc.frequency.linearRampToValueAtTime(550, now + 0.4);
      osc.frequency.linearRampToValueAtTime(220, now + 0.6);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.68);
    } else if (soundType === 'capybara') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (soundType === 'cheetah') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.4);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    } else if (soundType === 'bark') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (soundType === 'meow') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.15);
      osc.frequency.linearRampToValueAtTime(500, now + 0.45);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.52);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(660, now + 0.18);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  }

  playWarning() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }
}

const sound = new SoundEngine();

// --- 2. 10-SHIFT STORY CAMPAIGN CONFIGURATION ---
// Each shift unlocks the violation types it lists. 'disguise' puts every animal
// under a crate cover (sponge needed); 'seal' introduces forged seals (UV needed).
const ALL_VIOLATIONS = ["expired", "name", "weight", "disguise", "seal"];

const STORY_SHIFTS = [
  {
    shiftNumber: 1,
    title: "Shift 1: First Day at Mzinga",
    story: "Karibu to the Wanyama Customs desk at Mzinga International Airport, Officer! Today is paperwork only. Read every permit carefully: the date and the owner's name must both check out.",
    rules: [
      "Target Quota: Process 4 cases correctly.",
      "DENY if the permit expired before today's date.",
      "DENY if the permit owner's name doesn't exactly match the passenger."
    ],
    quota: 4,
    timeLimit: 90,
    violations: ["expired", "name"]
  },
  {
    shiftNumber: 2,
    intro: "weight",
    title: "Shift 2: Heavy Luggage",
    story: "Someone has been stuffing carriers with contraband. The bio-mass scale has just been calibrated. If an animal weighs more than its permit allows, something else is in that crate.",
    rules: [
      "Target Quota: Process 5 cases correctly.",
      "NEW: DENY if the scale reads above the permit's max weight."
    ],
    quota: 5,
    timeLimit: 90,
    violations: ["expired", "name", "weight"]
  },
  {
    shiftNumber: 3,
    intro: "crate",
    title: "Shift 3: The Paint Job",
    story: "A dye cartel is painting farm animals to pass as fancy breeds. From today every animal arrives in a covered crate. Scrub the cover with the Solvent Sponge and check what's really inside.",
    rules: [
      "Target Quota: Process 5 cases correctly.",
      "NEW: Scrub every crate. DENY if the animal doesn't match the declared species.",
      "Tip: Provoke Sound makes the animal call out. A 'zebra' shouldn't bray."
    ],
    quota: 5,
    timeLimit: 90,
    violations: ["expired", "name", "weight", "disguise"]
  },
  {
    shiftNumber: 4,
    intro: "uv",
    title: "Shift 4: The Cyber Café Forgers",
    story: "Forged permits are circulating, printed with near-perfect seals. The lab has sent you a Blacklight UV torch. A genuine W.C.A. seal glows green under UV. A fake one stays dark.",
    rules: [
      "Target Quota: Process 6 cases correctly.",
      "NEW: Switch to Blacklight UV [W/Space] and check the seal. DENY if it doesn't glow."
    ],
    quota: 6,
    timeLimit: 90,
    violations: ALL_VIOLATIONS
  },
  {
    shiftNumber: 5,
    title: "Shift 5: VIP Arrivals",
    story: "Honourables, CEOs and socialites are flying in with prize animals. They will drop names. Ignore them: the law is the law.",
    rules: [
      "Target Quota: Process 6 cases correctly.",
      "Full inspection: names, dates, weights, crates and seals."
    ],
    quota: 6,
    timeLimit: 90,
    violations: ALL_VIOLATIONS
  },
  {
    shiftNumber: 6,
    title: "Shift 6: Rush Hour",
    story: "Three flights landed at once and the queue reaches the car park. Keep the line moving, but don't get sloppy.",
    rules: [
      "Target Quota: Process 7 cases correctly.",
      "Some smugglers now break more than one rule at once."
    ],
    quota: 7,
    timeLimit: 85,
    violations: ALL_VIOLATIONS,
    doubleChance: 0.2
  },
  {
    shiftNumber: 7,
    title: "Shift 7: Better Paint",
    story: "The dye cartel has upgraded. The weights match, the paperwork is clean, and only the crate will tell you the truth.",
    rules: [
      "Target Quota: Process 7 cases correctly.",
      "Scrub thoroughly. The reveal tag appears once enough of the crate is clear."
    ],
    quota: 7,
    timeLimit: 85,
    violations: ALL_VIOLATIONS,
    doubleChance: 0.25
  },
  {
    shiftNumber: 8,
    title: "Shift 8: Heavy Cargo Week",
    story: "The marshals raided a warehouse of lead-lined crates. Expect small weight differences, a kilo here and a kilo there.",
    rules: [
      "Target Quota: Process 8 cases correctly.",
      "Read the scale to the decimal."
    ],
    quota: 8,
    timeLimit: 85,
    violations: ALL_VIOLATIONS,
    doubleChance: 0.25
  },
  {
    shiftNumber: 9,
    title: "Shift 9: Big Man Kiboko's Decoys",
    story: "Word is that the smuggling boss Big Man Kiboko is flooding the queue with decoys to wear you down. Stay methodical.",
    rules: [
      "Target Quota: Process 8 cases correctly.",
      "Stay calm and check every field."
    ],
    quota: 8,
    timeLimit: 80,
    violations: ALL_VIOLATIONS,
    doubleChance: 0.35
  },
  {
    shiftNumber: 10,
    title: "Shift 10: The Final Inspection",
    story: "This is your assessment for Chief Inspector. Every trick in the book will cross your desk today. Make Mzinga proud!",
    rules: [
      "Target Quota: Process 9 cases correctly.",
      "3 Strikes = Immediate Termination."
    ],
    quota: 9,
    timeLimit: 80,
    violations: ALL_VIOLATIONS,
    doubleChance: 0.4
  }
];

const ARCADE_RULES = { violations: ALL_VIOLATIONS, doubleChance: 0.25 };

// --- 3. PET-DEX DATABASE ---
const PET_DEX_MASTER = [
  { id: "donkey_zebra", name: "The Donkeyxote", emoji: "🐴", species: "Grey Donkey", disguise: "Painted Zebra", lore: "An ordinary shamba donkey sprayed with cheap acrylic stripes. Brays when nervous." },
  { id: "capybara_dog", name: "Sir Fluffsbark", emoji: "🦫", species: "Giant Capybara", disguise: "Golden Retriever", lore: "Dyed with supermarket bleach. Chirps instead of barking." },
  { id: "cheetah_cat", name: "Barnaby the Tabby", emoji: "🐆", species: "Cheetah Cub", disguise: "House Cat", lore: "Smuggled under brown shoe polish. Purrs like a matatu engine." },
  { id: "macaw_vest", name: "Trenchcoat Polly", emoji: "🦜", species: "Smuggled Macaws", disguise: "Poodle Vest", lore: "Three macaws zipped into a padded poodle costume." },
  { id: "warthog_pig", name: "Princess Piglet", emoji: "🐗", species: "Warthog Piglet", disguise: "Teacup Pig", lore: "Tusks hidden under thick layers of pink blush. Pumbaa's cousin." },
  { id: "croc_wiener", name: "The Wiener Croc", emoji: "🐊", species: "Baby Nile Crocodile", disguise: "Dachshund", lore: "Stuffed into a knit sweater with felt puppy ears glued on." },
  { id: "penguin_butler", name: "Sir Tuxedo", emoji: "🐧", species: "Penguin Chick", disguise: "Pekin Duck", lore: "The owner said it was an emotional-support duck that likes cold showers." },
  { id: "legal_bengal", name: "Her Royal Paws", emoji: "🐈", species: "Bengal Cat", disguise: "None", lore: "A fully legal champion cat with her papers in order." },
  { id: "legal_alpaca", name: "Llama Del Rey", emoji: "🦙", species: "Huacaya Alpaca", disguise: "None", lore: "A prize wool alpaca travelling with valid papers." },
  { id: "legal_hedgehog", name: "Spike McFluff", emoji: "🦔", species: "Pygmy Hedgehog", disguise: "None", lore: "A verified captive-bred hedgehog in peak health." },
  { id: "legal_macaw", name: "Captain Feathers", emoji: "🦜", species: "Scarlet Macaw", disguise: "None", lore: "A registered zoo specimen with a pristine seal." },
  { id: "legal_rooster", name: "Jogoo wa Mtaa", emoji: "🐓", species: "Kienyeji Rooster", disguise: "None", lore: "Crows at 4am sharp. Fully legal, extremely loud." }
];

// --- 4. ANIMALS & DISGUISES ---
// Weights are kg. A legal permit's max weight is the animal's `max`.
const LEGAL_ANIMALS = [
  { species: "Border Collie (Canis familiaris)", emoji: "🐕", art: "animals/border_collie", min: 14, max: 20, sound: "bark" },
  { species: "Persian Cat (Felis catus)", emoji: "🐱", art: "animals/persian_cat", min: 3, max: 5.5, sound: "meow" },
  { species: "Bengal Cat (Felis catus)", emoji: "🐈", art: "animals/bengal_cat", min: 4, max: 7, sound: "meow", dexId: "legal_bengal" },
  { species: "Scarlet Macaw (Ara macao)", emoji: "🦜", art: "animals/scarlet_macaw", min: 0.9, max: 1.4, sound: "squeak", dexId: "legal_macaw" },
  { species: "African Pygmy Hedgehog (Atelerix albiventris)", emoji: "🦔", art: "animals/pygmy_hedgehog", min: 0.3, max: 0.6, sound: "squeak", dexId: "legal_hedgehog" },
  { species: "Huacaya Alpaca (Vicugna pacos)", emoji: "🦙", art: "animals/huacaya_alpaca", min: 50, max: 80, sound: "squeak", dexId: "legal_alpaca" },
  { species: "Holland Lop Rabbit (Oryctolagus cuniculus)", emoji: "🐰", art: "animals/holland_lop_rabbit", min: 1.3, max: 2.2, sound: "squeak" },
  { species: "Kienyeji Rooster (Gallus gallus)", emoji: "🐓", art: "animals/kienyeji_rooster", min: 1.8, max: 3, sound: "squeak", dexId: "legal_rooster" },
  { species: "Galla Goat (Capra hircus)", emoji: "🐐", art: "animals/galla_goat", min: 30, max: 50, sound: "bark" }
];

// Smugglers pick look-alike weights, so the scale won't catch a disguise.
// Only scrubbing the crate (or provoking a sound) gives it away.
const DISGUISES = [
  {
    dexId: "donkey_zebra",
    declared: { species: "Plains Zebra (Equus quagga)", min: 220, max: 350 },
    emoji: "🐴", sound: "donkey",
    revealTag: "Grey donkey with painted stripes!",
    reason: "That 'zebra' was a painted donkey!",
    speech: ["Authentic zebra from the Mara! Just don't wash him, he's allergic to water."]
  },
  {
    dexId: "capybara_dog",
    declared: { species: "Golden Retriever (Canis familiaris)", min: 25, max: 34 },
    emoji: "🦫", sound: "capybara",
    revealTag: "Capybara dyed blonde!",
    reason: "That 'retriever' was a dyed capybara!",
    speech: ["Golden Retriever puppy, sasa! He just barks with a squeak."]
  },
  {
    dexId: "cheetah_cat",
    declared: { species: "Domestic Tabby (Felis catus)", min: 3.5, max: 6 },
    emoji: "🐆", sound: "cheetah",
    revealTag: "Cheetah cub under shoe polish!",
    reason: "That 'tabby' was a cheetah cub!",
    speech: ["Paka wa nyumbani tu. He purrs like a matatu engine."]
  },
  {
    dexId: "macaw_vest",
    declared: { species: "Standard Poodle (Canis familiaris)", min: 20, max: 30 },
    emoji: "🦜", sound: "squeak",
    revealTag: "Three macaws zipped into a poodle vest!",
    reason: "That 'poodle' was a vest full of macaws!",
    speech: ["My poodle's coat is naturally bulky. Usiguse, she is sensitive!"]
  },
  {
    dexId: "warthog_pig",
    declared: { species: "Teacup Pig (Sus domesticus)", min: 8, max: 15 },
    emoji: "🐗", sound: "cheetah",
    revealTag: "Warthog piglet in pink blush!",
    reason: "That 'teacup pig' was a warthog!",
    speech: ["Teacup piglet! Those aren't tusks, ni meno ya mtoto."]
  },
  {
    dexId: "croc_wiener",
    declared: { species: "Dachshund (Canis familiaris)", min: 7, max: 11 },
    emoji: "🐊", sound: "cheetah",
    revealTag: "Baby crocodile in a knit sweater!",
    reason: "That 'dachshund' was a baby crocodile!",
    speech: ["My dachshund has scaly skin from allergies. Lap dog kabisa."]
  },
  {
    dexId: "penguin_butler",
    declared: { species: "Pekin Duck (Anas platyrhynchos)", min: 3, max: 4.5 },
    emoji: "🐧", sound: "squeak",
    revealTag: "Penguin chick in a duck costume!",
    reason: "That 'duck' was a penguin chick!",
    speech: ["He's my emotional-support bata. He likes cold showers."]
  }
];

// Lines any passenger might say, legal or not.
const GENERIC_LINES = [
  "Habari officer! Long flight, let's make this quick.",
  "Everything is in order, I promise.",
  "My cousin works at this airport, you know.",
  "Sawa sawa, stamp stamp and I'm gone!",
  "She hasn't eaten since Dubai, please hurry.",
  "I have a matatu waiting outside.",
  "Pole for the smell, he got nervous on the plane.",
  "Is this the line for Nanyuki? No? Okay, I'll wait."
];

// Suspicious lines. Mostly said by rule-breakers, sometimes by honest people as red herrings.
const HINT_LINES = {
  expired: ["I renewed it... sometime. Recently-ish.", "Dates are just numbers, officer."],
  name: ["Yes, that's me on the permit. More or less.", "My brother's permit, my animal. Same family!"],
  weight: ["He's just big-boned. Very big-boned.", "Don't mind the scale, he ate well in transit."],
  seal: ["I printed it fresh at a cyber café this morning!", "The embassy stamp was... on its way."]
};

const DEFAULT_PASSENGERS = [
  { name: "Njeri Wambui", art: "passengers/njeri_wambui_neutral", avatar: "👩🏾‍🌾", quote: "Officer, I have a matatu waiting outside!" },
  { name: "Otieno Ochieng", art: "passengers/otieno_ochieng_neutral", avatar: "👴🏾", quote: "Mimi ni mzee wa heshima. I don't lie." },
  { name: "Brian Kamau", art: "passengers/brian_kamau_neutral", avatar: "😎", quote: "Niaje officer! We keep it quick, sawa?" },
  { name: "Akinyi Adhiambo", art: "passengers/akinyi_adhiambo_neutral", avatar: "👒", quote: "He is very well behaved, unlike my husband." },
  { name: "Dr. Mwangi Karanja", art: "passengers/mwangi_karanja_neutral", avatar: "🧐", quote: "I am a doctor. Trust me, the animal is fine." },
  { name: "Hon. Chebet Kiprono", art: "passengers/chebet_kiprono_neutral", avatar: "🎩", quote: "Do you know who I am? Stamp it, please." },
  { name: "Kevin Mutua", art: "passengers/kevin_mutua_neutral", avatar: "🤠", quote: "Fresh from Dubai, officer. Everything is legit." },
  { name: "Halima Hassan", art: "passengers/halima_hassan_neutral", avatar: "🧕🏾", quote: "Please be gentle with her, she's shy." }
];

// --- 4b. ART (Claude Design batches, see docs/ART_WORK_ORDER.md) ---
// Only ids listed here are loaded; everything else keeps its emoji until its batch lands,
// so a missing file never shows as a broken image.
const ART_FILES = new Set([
  "animals/border_collie",
  "passengers/njeri_wambui_neutral"
]);

function artPath(id) {
  return id && ART_FILES.has(id) ? `art/${id}.svg` : null;
}

// Fill `el` with the artwork for `id`, or the emoji if that art hasn't landed yet.
function setArt(el, id, emoji) {
  const path = artPath(id);
  el.classList.toggle('has-art', Boolean(path));
  if (!path) {
    el.textContent = emoji;
    return;
  }
  const img = document.createElement('img');
  img.src = path;
  img.alt = "";
  el.replaceChildren(img);
}

const ICON = (name) => `<img class="icon" src="art/ui/icon-${name}.svg" alt="">`;

// --- 5. LOCALSTORAGE PROGRESSION MANAGER ---
// Keys keep the original 'petdetect_' prefix so players keep their progress after the rename.
class StorageManager {
  static getArcadeHighScore() {
    return parseInt(localStorage.getItem('petdetect_arcade_high_score') || "0", 10);
  }

  static saveArcadeHighScore(score) {
    const current = this.getArcadeHighScore();
    if (score > current) {
      localStorage.setItem('petdetect_arcade_high_score', score.toString());
      return true;
    }
    return false;
  }

  static getStoryShift() {
    return parseInt(localStorage.getItem('petdetect_story_shift') || "1", 10);
  }

  static setStoryShift(shiftNum) {
    localStorage.setItem('petdetect_story_shift', shiftNum.toString());
  }

  static resetStory() {
    localStorage.setItem('petdetect_story_shift', "1");
    localStorage.removeItem('petdetect_intros_seen');
  }

  static getUserDex() {
    return JSON.parse(localStorage.getItem('petdetect_dex_v2') || "[]");
  }

  static saveDexItem(id) {
    const dex = this.getUserDex();
    if (!dex.includes(id)) {
      dex.push(id);
      localStorage.setItem('petdetect_dex_v2', JSON.stringify(dex));
      return true;
    }
    return false;
  }

  static isTutorialDone() {
    return localStorage.getItem('petdetect_tutorial_done') === '1';
  }

  static setTutorialDone() {
    localStorage.setItem('petdetect_tutorial_done', '1');
  }

  static hasSeenIntro(shiftNumber) {
    return JSON.parse(localStorage.getItem('petdetect_intros_seen') || "[]").includes(shiftNumber);
  }

  static markIntroSeen(shiftNumber) {
    const seen = JSON.parse(localStorage.getItem('petdetect_intros_seen') || "[]");
    if (!seen.includes(shiftNumber)) {
      seen.push(shiftNumber);
      localStorage.setItem('petdetect_intros_seen', JSON.stringify(seen));
    }
  }

  static getCustomSuspects() {
    return JSON.parse(localStorage.getItem('petdetect_custom_suspects_v2') || "[]");
  }

  static saveCustomSuspects(list) {
    localStorage.setItem('petdetect_custom_suspects_v2', JSON.stringify(list));
  }
}

// --- 6. GAME CONTROLLER STATE ---
const TODAY = new Date(2026, 9, 14);
const TODAY_STR = "OCT 14, 2026";

let gameState = {
  mode: 'story', // 'story' or 'arcade'
  storyShiftIndex: 0, // 0-based index into STORY_SHIFTS
  active: false,
  timeLeft: 90,
  score: 0,
  quotaMetCount: 0,
  targetQuota: 4,
  strikes: 0,
  maxStrikes: 3,
  casesProcessed: 0,
  smugglersCaught: 0,
  correctCalls: 0,
  wrongCalls: 0,
  currentCase: null,
  activeTool: 'sponge',
  shiftInterval: null,
  isWiping: false,
  coffeeAvailable: true,
  isTimeFrozen: false,
  resolving: false,
  introPause: false,
  coffeeTimeout: null,
  revealed: false,
  lastScratchPoint: null,
  lastWipeSample: 0,
  lastSpongeSoundTime: 0
};

// --- 7. DOM ELEMENTS ---
const elDesk = document.getElementById('deskMain');
const elHudModeBadge = document.getElementById('hudModeBadge');
const elHudTimer = document.getElementById('hudTimer');
const elTimerBox = document.getElementById('timerBox');
const elHudScore = document.getElementById('hudScore');
const elHudQuotaCard = document.getElementById('hudQuotaCard');
const elHudQuota = document.getElementById('hudQuota');
const elStrike1 = document.getElementById('strike1');
const elStrike2 = document.getElementById('strike2');
const elStrike3 = document.getElementById('strike3');

const elBtnMainMenu = document.getElementById('btnMainMenu');
const elBtnOpenDex = document.getElementById('btnOpenDex');
const elBtnCustomSuspects = document.getElementById('btnCustomSuspects');
const elBtnSound = document.getElementById('btnSoundToggle');
const elBtnHelp = document.getElementById('btnHelp');

const elPassAvatar = document.getElementById('passAvatar');
const elPassName = document.getElementById('passName');
const elPassSpeech = document.getElementById('passSpeech');
const elScale = document.getElementById('scaleDisplay');
const elAnimalGraphic = document.getElementById('animalGraphic');
const elAnimalTrueTag = document.getElementById('animalTrueTag');
const elScratchCanvas = document.getElementById('scratchCanvas');
const elViewportBox = document.getElementById('viewportBox');
const elWipeStatus = document.getElementById('wipeStatus');
const elBtnToolSponge = document.getElementById('btnToolSponge');
const elBtnToolUV = document.getElementById('btnToolUV');
const elToolbox = document.getElementById('toolbox');
const elBtnCoffee = document.getElementById('btnCoffee');
const elBtnVocalize = document.getElementById('btnVocalize');

const elPermitCard = document.getElementById('permitCard');
const elDocPermitId = document.getElementById('docPermitId');
const elDocOwner = document.getElementById('docOwner');
const elDocExpiry = document.getElementById('docExpiry');
const elDocSpecies = document.getElementById('docSpecies');
const elDocWeight = document.getElementById('docWeight');
const elDocChip = document.getElementById('docChip');
const elDocSeal = document.getElementById('docSeal');
const elDocSealImg = document.getElementById('docSealImg');
const elDocCurrentDate = document.getElementById('docCurrentDate');
const elStampOverlay = document.getElementById('stampOverlay');

const elBtnDeny = document.getElementById('btnDeny');
const elBtnApprove = document.getElementById('btnApprove');
const elToast = document.getElementById('verdictToast');
const elToastIcon = document.getElementById('toastIcon');
const elToastMsg = document.getElementById('toastMsg');

// Modals
const elMainMenuModal = document.getElementById('mainMenuModal');
const elBtnMenuStory = document.getElementById('btnMenuStory');
const elBtnMenuArcade = document.getElementById('btnMenuArcade');
const elMenuStoryBadge = document.getElementById('menuStoryBadge');
const elMenuArcadeHighScore = document.getElementById('menuArcadeHighScore');
const elBtnResetStory = document.getElementById('btnResetStory');

const elBulletinModal = document.getElementById('bulletinModal');
const elBulletinTitle = document.getElementById('bulletinTitle');
const elBulletinStory = document.getElementById('bulletinStory');
const elBulletinRulesList = document.getElementById('bulletinRulesList');
const elBtnStartBulletinShift = document.getElementById('btnStartBulletinShift');

const elGameOverModal = document.getElementById('gameOverModal');
const elEndTitle = document.getElementById('endTitle');
const elEndSubtitle = document.getElementById('endSubtitle');
const elEndRank = document.getElementById('endRank');
const elEndScore = document.getElementById('endScore');
const elEndCases = document.getElementById('endCases');
const elEndSmugglers = document.getElementById('endSmugglers');
const elEndStrikes = document.getElementById('endStrikes');
const elBtnEndAction = document.getElementById('btnEndAction');
const elBtnEndReturnMenu = document.getElementById('btnEndReturnMenu');

const elPetdexModal = document.getElementById('petdexModal');
const elBtnCloseDex = document.getElementById('btnCloseDex');
const elSuspectsModal = document.getElementById('suspectsModal');
const elBtnCloseSuspects = document.getElementById('btnCloseSuspects');
const elRulesModal = document.getElementById('rulesModal');
const elBtnCloseRules = document.getElementById('btnCloseRules');

const canvasCtx = elScratchCanvas.getContext('2d');

// --- 8. SCRATCH CANVAS REVEAL MECHANIC ---
const crateCoverImg = new Image();
crateCoverImg.src = 'art/scene/crate-cover.svg';

// Every animal arrives under the same crate cover, so the cover itself tells you nothing.
function setupScratchCanvas(covered) {
  const w = elScratchCanvas.width;
  const h = elScratchCanvas.height;

  canvasCtx.globalCompositeOperation = 'source-over';
  canvasCtx.clearRect(0, 0, w, h);
  gameState.revealed = !covered;

  if (!covered) {
    elScratchCanvas.style.pointerEvents = 'none';
    elWipeStatus.textContent = "";
    elAnimalTrueTag.style.opacity = "1";
    return;
  }

  elScratchCanvas.style.pointerEvents = 'auto';

  if (crateCoverImg.complete && crateCoverImg.naturalWidth > 0) {
    canvasCtx.drawImage(crateCoverImg, 0, 0, w, h);
    canvasCtx.textAlign = 'center';
    canvasCtx.fillStyle = '#2A2623';
    canvasCtx.font = "25px 'Lilita One', sans-serif";
    if ('letterSpacing' in canvasCtx) canvasCtx.letterSpacing = '3px';
    canvasCtx.fillText("MZINGA AIR CARGO · LIVE ANIMAL", w / 2, 222);
    if ('letterSpacing' in canvasCtx) canvasCtx.letterSpacing = '0px';
    canvasCtx.textAlign = 'start';
    elWipeStatus.textContent = "Scrub the crate to see inside!";
    elAnimalTrueTag.style.opacity = "0";
    return;
  }

  // Tarp base
  canvasCtx.fillStyle = '#6d5a3a';
  canvasCtx.fillRect(0, 0, w, h);

  // Random dust blotches so crates look different without hinting at contents
  for (let i = 0; i < 18; i++) {
    canvasCtx.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.06)';
    canvasCtx.beginPath();
    canvasCtx.arc(Math.random() * w, Math.random() * h, 10 + Math.random() * 28, 0, Math.PI * 2);
    canvasCtx.fill();
  }

  // Crate slats
  canvasCtx.fillStyle = 'rgba(0,0,0,0.28)';
  for (let x = 0; x < w; x += 56) {
    canvasCtx.fillRect(x, 0, 4, h);
  }
  canvasCtx.fillRect(0, 34, w, 6);
  canvasCtx.fillRect(0, h - 40, w, 6);

  // Stencil markings
  canvasCtx.textAlign = 'center';
  canvasCtx.fillStyle = 'rgba(255, 224, 130, 0.85)';
  canvasCtx.font = 'bold 16px monospace';
  canvasCtx.fillText("MZINGA AIR CARGO · LIVE ANIMAL", w / 2, h / 2 - 6);
  canvasCtx.fillStyle = 'rgba(255,255,255,0.75)';
  canvasCtx.font = 'bold 13px monospace';
  canvasCtx.fillText("SCRUB TO INSPECT", w / 2, h / 2 + 18);
  canvasCtx.textAlign = 'start';

  elWipeStatus.textContent = "Scrub the crate to see inside!";
  elAnimalTrueTag.style.opacity = "0";
}

function clearScratchCanvas() {
  canvasCtx.clearRect(0, 0, elScratchCanvas.width, elScratchCanvas.height);
  elAnimalTrueTag.style.opacity = "1";
}

function scratchAt(clientX, clientY) {
  if (gameState.activeTool !== 'sponge' || !gameState.active) return;

  const rect = elScratchCanvas.getBoundingClientRect();
  const scaleX = elScratchCanvas.width / rect.width;
  const scaleY = elScratchCanvas.height / rect.height;
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  // Erase a continuous stroke from the last point so fast swipes don't leave gaps.
  const from = gameState.lastScratchPoint || { x, y };
  canvasCtx.save();
  canvasCtx.globalCompositeOperation = 'destination-out';
  canvasCtx.lineWidth = 80;
  canvasCtx.lineCap = 'round';
  canvasCtx.beginPath();
  canvasCtx.moveTo(from.x, from.y);
  canvasCtx.lineTo(x, y);
  canvasCtx.stroke();
  canvasCtx.restore();
  gameState.lastScratchPoint = { x, y };

  const now = Date.now();
  if (now - gameState.lastSpongeSoundTime > 90) {
    sound.playSponge();
    gameState.lastSpongeSoundTime = now;
  }

  sampleWipeProgress();
}

function sampleWipeProgress(force = false) {
  if (gameState.revealed) return;
  const now = Date.now();
  if (!force && now - gameState.lastWipeSample < 80) return;
  gameState.lastWipeSample = now;

  const w = elScratchCanvas.width;
  const h = elScratchCanvas.height;
  const stepX = Math.floor(w / 12);
  const stepY = Math.floor(h / 8);
  let cleared = 0;
  let total = 0;

  const imgData = canvasCtx.getImageData(0, 0, w, h).data;
  for (let y = stepY; y < h - stepY; y += stepY) {
    for (let x = stepX; x < w - stepX; x += stepX) {
      total++;
      const alphaIdx = (y * w + x) * 4 + 3;
      if (imgData[alphaIdx] < 60) {
        cleared++;
      }
    }
  }

  const percent = Math.min(100, Math.round((cleared / total) * 100));

  if (percent < 45) {
    elWipeStatus.textContent = `Scrubbing... (${percent}% cleared)`;
  } else {
    // Wipe the rest away so the player gets a clean look at the animal.
    gameState.revealed = true;
    clearScratchCanvas();
    emitGameEvent('reveal');
    elWipeStatus.textContent = "Crate open. Compare with the permit!";
  }
}

// Scratch input: pointer events cover mouse, touch and stylus with one code path.
elScratchCanvas.addEventListener('pointerdown', (e) => {
  gameState.isWiping = true;
  gameState.lastScratchPoint = null;
  sound.init();
  elScratchCanvas.setPointerCapture(e.pointerId);
  scratchAt(e.clientX, e.clientY);
  e.preventDefault();
});

elScratchCanvas.addEventListener('pointermove', (e) => {
  if (!gameState.isWiping) return;
  scratchAt(e.clientX, e.clientY);
});

function endScratch() {
  gameState.isWiping = false;
  gameState.lastScratchPoint = null;
  sampleWipeProgress(true);
}

elScratchCanvas.addEventListener('pointerup', endScratch);
elScratchCanvas.addEventListener('pointercancel', endScratch);

// Tiny event hook so the tutorial can wait for "the player scrubbed the crate" etc.
const gameEventListeners = [];
function onGameEvent(fn) {
  gameEventListeners.push(fn);
  return () => gameEventListeners.splice(gameEventListeners.indexOf(fn), 1);
}
function emitGameEvent(name, data) {
  [...gameEventListeners].forEach(fn => fn(name, data));
}

// --- 9. PROCEDURAL CASE GENERATOR ---
// Build a clean, legal case first, then break 0-2 rules chosen from what this shift allows.
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const randFloat = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(randFloat(min, max + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function formatDate(d) {
  return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
}

function addDays(d, days) {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

const roundTo = (n, step) => Math.round(n / step) * step;

// A believable typo: swap two inner letters, change a vowel, or swap the first name.
const FIRST_NAMES = ["Wanjiru", "Kiptoo", "Achieng", "Mutua", "Nekesa", "Omondi", "Wairimu", "Kibet", "Zawadi", "Juma"];
const VOWELS = "aeiou";

function forgeName(name) {
  const parts = name.split(' ');
  const surname = parts[parts.length - 1];

  for (let attempt = 0; attempt < 10; attempt++) {
    const strategy = randInt(0, 2);
    let forged = surname;

    if (strategy === 0 && surname.length >= 4) {
      const i = randInt(1, surname.length - 3);
      forged = surname.slice(0, i) + surname[i + 1] + surname[i] + surname.slice(i + 2);
    } else if (strategy === 1) {
      const vowelIdx = [...surname].map((ch, i) => (i > 0 && VOWELS.includes(ch) ? i : -1)).filter(i => i >= 0);
      if (vowelIdx.length > 0) {
        const i = pick(vowelIdx);
        const replacement = pick([...VOWELS].filter(v => v !== surname[i]));
        forged = surname.slice(0, i) + replacement + surname.slice(i + 1);
      }
    } else if (parts.length > 1) {
      const newFirst = pick(FIRST_NAMES.filter(n => n !== parts[parts.length - 2]));
      return [...parts.slice(0, -2), newFirst, surname].join(' ');
    }

    if (forged !== surname) {
      return [...parts.slice(0, -1), forged].join(' ');
    }
  }
  return name + "e";
}

function getCombinedPassengers() {
  return [...DEFAULT_PASSENGERS, ...StorageManager.getCustomSuspects()];
}

function getActiveRules() {
  if (gameState.mode === 'tutorial') {
    return { violations: ["expired", "name"], doubleChance: 0 };
  }
  if (gameState.mode === 'story') {
    const conf = STORY_SHIFTS[gameState.storyShiftIndex] || STORY_SHIFTS[0];
    return { violations: conf.violations, doubleChance: conf.doubleChance || 0 };
  }
  return ARCADE_RULES;
}

function pickViolations(rules) {
  if (Math.random() < 0.5) return []; // roughly half of all cases are legal
  const pool = [...rules.violations];
  const first = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
  const picked = [first];
  if (pool.length > 0 && Math.random() < rules.doubleChance) {
    picked.push(pick(pool));
  }
  return picked;
}

// `overrides` lets the tutorial and shift intros script a case:
// { violations, passengerName, animalSpecies, disguiseId, expiryDays, permitOwner, speech }
function generateNewCase(overrides = {}) {
  const rules = getActiveRules();
  const violations = overrides.violations || pickViolations(rules);
  const passengers = getCombinedPassengers();
  const passenger = passengers.find(p => p.name === overrides.passengerName) || pick(passengers);
  const covered = rules.violations.includes('disguise');

  // Animal: disguise swaps what's under the cover, while the permit stays on the look-alike species.
  let declared, underEmoji, underArt, underTag, vocalSound, dexId;
  let disguise = null;
  if (violations.includes('disguise')) {
    disguise = DISGUISES.find(d => d.dexId === overrides.disguiseId) || pick(DISGUISES);
    declared = disguise.declared;
    underEmoji = disguise.emoji;
    underArt = `animals/${disguise.dexId}`;
    underTag = disguise.revealTag;
    vocalSound = disguise.sound;
    dexId = disguise.dexId;
  } else {
    const animal = LEGAL_ANIMALS.find(a => overrides.animalSpecies && a.species.startsWith(overrides.animalSpecies)) || pick(LEGAL_ANIMALS);
    declared = animal;
    underEmoji = animal.emoji;
    underArt = animal.art;
    underTag = `Looks like: ${animal.species.split(' (')[0]}`;
    vocalSound = animal.sound;
    dexId = animal.dexId || null;
  }

  // Weight: normally under the limit; a weight violation goes 6-25% over.
  const permitMax = declared.max;
  let scaleWeight = randFloat(declared.min, permitMax * 0.97);
  if (violations.includes('weight')) {
    scaleWeight = permitMax * randFloat(1.06, 1.25);
  }
  scaleWeight = roundTo(scaleWeight, permitMax < 2 ? 0.01 : 0.1);

  // Expiry: valid permits run 3-500 days past today, expired ones lapsed 1-120 days ago.
  let expiry = violations.includes('expired')
    ? addDays(TODAY, -randInt(1, 120))
    : addDays(TODAY, randInt(3, 500));
  if (overrides.expiryDays !== undefined) expiry = addDays(TODAY, overrides.expiryDays);

  const permitOwner = overrides.permitOwner
    || (violations.includes('name') ? forgeName(passenger.name) : passenger.name);

  // Forged seals look genuine in normal light; some have a visible misprint for sharp eyes.
  const sealGenuine = !violations.includes('seal');
  const sealMisprint = !sealGenuine && Math.random() < 0.35;

  // Speech: disguise excuse, a hint for the broken rule, or small talk. Honest people sometimes sound shifty too.
  let speech;
  const hintable = violations.filter(v => HINT_LINES[v]);
  if (disguise && Math.random() < 0.6) {
    speech = pick(disguise.speech);
  } else if (hintable.length > 0 && Math.random() < 0.4) {
    speech = pick(HINT_LINES[pick(hintable)]);
  } else if (violations.length === 0 && Math.random() < 0.15) {
    speech = pick(HINT_LINES[pick(Object.keys(HINT_LINES))]);
  } else if (Math.random() < 0.3 && passenger.quote) {
    speech = passenger.quote;
  } else {
    speech = pick(GENERIC_LINES);
  }

  if (overrides.speech) speech = overrides.speech;

  const newCase = {
    passengerName: passenger.name,
    passengerAvatar: passenger.avatar,
    passengerArt: passenger.art,
    passengerSpeech: speech,
    permitId: "#WTP-" + randInt(1000, 9999) + "-K",
    chipId: "#CHIP-" + randInt(1000, 9999) + "-KE",
    permitOwner,
    expiry,
    declaredSpecies: declared.species,
    permitMax,
    scaleWeight,
    sealGenuine,
    sealMisprint,
    covered,
    underEmoji,
    underArt,
    underTag,
    vocalSound,
    dexId,
    disguise,
    violations,
    shouldApprove: violations.length === 0
  };

  gameState.currentCase = newCase;
  gameState.resolving = false;
  renderCase(newCase);
}

function formatWeight(kg) {
  return kg < 2 ? kg.toFixed(2) : kg.toFixed(1);
}

function renderCase(c) {
  elStampOverlay.className = "rubber-stamp-overlay";
  document.querySelectorAll('.flagged').forEach(el => el.classList.remove('flagged'));

  setArt(elPassAvatar, c.passengerArt, c.passengerAvatar);
  elPassName.textContent = c.passengerName;
  elPassSpeech.textContent = `"${c.passengerSpeech}"`;

  elScale.textContent = `${formatWeight(c.scaleWeight)} KG`;
  setArt(elAnimalGraphic, c.underArt, c.underEmoji);
  elAnimalTrueTag.textContent = c.underTag;

  elDocPermitId.textContent = c.permitId;
  elDocOwner.textContent = c.permitOwner;
  elDocExpiry.textContent = formatDate(c.expiry);
  elDocSpecies.textContent = c.declaredSpecies;
  elDocWeight.textContent = `Max ${formatWeight(c.permitMax)} KG`;
  elDocChip.textContent = c.chipId;
  elDocCurrentDate.textContent = TODAY_STR;


  setupScratchCanvas(c.covered);
  updateToolAvailability();
  updateSealImage();
}

// Explain each broken rule and point at the fields that prove it.
function describeViolation(c, v) {
  switch (v) {
    case 'expired':
      return { text: `Permit expired ${formatDate(c.expiry)}. Today is ${TODAY_STR}.`, els: [elDocExpiry.parentElement, elDocCurrentDate.parentElement] };
    case 'name':
      return { text: `Permit says "${c.permitOwner}", but the passenger is ${c.passengerName}.`, els: [elDocOwner.parentElement, elPassName] };
    case 'weight':
      return { text: `Scale read ${formatWeight(c.scaleWeight)} KG, but the permit allows ${formatWeight(c.permitMax)} KG.`, els: [elDocWeight.parentElement, elScale.parentElement] };
    case 'seal':
      return { text: `The seal had no UV watermark. Forged permit!`, els: [elDocSeal] };
    case 'disguise':
      return { text: c.disguise.reason, els: [elViewportBox] };
    default:
      return { text: "", els: [] };
  }
}

// --- 10. VERDICT HANDLING ---
function handleVerdict(approvedByUser) {
  if (gameState.mode === 'tutorial') {
    Tutorial.onVerdict(approvedByUser);
    return;
  }
  // No stamping while a briefing is on screen.
  if (Dialogue.isOpen()) return;
  if (!gameState.active || !gameState.currentCase || gameState.resolving) return;
  gameState.introPause = false;

  // Lock until the next case is on the desk so one case can't be stamped twice.
  gameState.resolving = true;
  const c = gameState.currentCase;
  gameState.currentCase = null;
  const isCorrect = (approvedByUser === c.shouldApprove);

  sound.init();
  sound.playStamp(approvedByUser);

  showStampImprint(approvedByUser);

  // Show the truth: open the crate and point at whatever was wrong.
  if (c.covered) {
    clearScratchCanvas();
    elWipeStatus.textContent = "";
  }
  const findings = c.violations.map(v => describeViolation(c, v));
  findings.forEach(f => f.els.forEach(el => el.classList.add('flagged')));
  const findingText = findings.map(f => f.text).join(' ');

  if (isCorrect) {
    sound.playSuccess();
    gameState.score += 100;
    gameState.casesProcessed++;
    gameState.correctCalls++;
    gameState.quotaMetCount++;
    if (!c.shouldApprove) {
      gameState.smugglersCaught++;
    }

    let dexNote = "";
    if (c.dexId && StorageManager.saveDexItem(c.dexId)) {
      updateDexBadge();
      dexNote = " New Pet-Dex entry!";
    }

    const reason = c.shouldApprove
      ? "Clean case, approved! (+100 PTS)"
      : `Busted! ${findingText} (+100 PTS)`;
    showToast(true, reason + dexNote);

    // In Story Mode: Check if target quota has been achieved!
    if (gameState.mode === 'story' && gameState.quotaMetCount >= gameState.targetQuota) {
      gameState.active = false;
      updateHUD();
      setTimeout(() => {
        handleShiftEnd(true, "QUOTA COMPLETED!", "Excellent detective work! Shift requirements met.");
      }, 1200);
      return;
    }
  } else {
    sound.playStrike();
    triggerScreenShake();
    gameState.strikes++;
    gameState.wrongCalls++;
    gameState.timeLeft = Math.max(0, gameState.timeLeft - 10);

    const failDetail = approvedByUser
      ? `You let it through! ${findingText} (-10s)`
      : `False rejection! Everything checked out on that one. (-10s)`;
    showToast(false, `STRIKE ${gameState.strikes}! ${failDetail}`);
  }

  updateHUD();

  if (gameState.strikes >= gameState.maxStrikes) {
    gameState.active = false;
    setTimeout(() => {
      handleShiftEnd(false, "FIRED BY THE CHIEF", "3 Strikes! You've been sent home from the customs desk.");
    }, 1400);
    return;
  }

  // Mistakes stay on screen longer so the player can see what they missed. The clock is paused meanwhile.
  setTimeout(() => {
    if (gameState.active) {
      generateNewCase();
    }
  }, isCorrect ? 900 : 2200);
}

function showStampImprint(approved) {
  document.getElementById('stampOverlayImg').src = `art/ui/${approved ? 'stamp-approved' : 'stamp-denied'}.svg`;
  elStampOverlay.className = `rubber-stamp-overlay active-stamp ${approved ? 'approved' : 'denied'}`;
}

function triggerScreenShake() {
  elDesk.classList.remove('screen-shake');
  void elDesk.offsetWidth;
  elDesk.classList.add('screen-shake');
}

function showToast(isCorrect, message) {
  elToast.className = `verdict-feedback show ${isCorrect ? 'correct' : 'wrong'}`;
  elToastIcon.innerHTML = ICON(isCorrect ? 'star' : 'strike');
  elToastMsg.textContent = message;

  clearTimeout(elToast.hideTimeout);
  elToast.hideTimeout = setTimeout(() => {
    elToast.className = 'verdict-feedback';
  }, 3800);
}

function updateHUD() {
  const mins = Math.floor(gameState.timeLeft / 60);
  const secs = gameState.timeLeft % 60;
  elHudTimer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (gameState.isTimeFrozen || gameState.introPause) {
    elTimerBox.classList.add('frozen');
  } else {
    elTimerBox.classList.remove('frozen');
  }

  // Panic Mode (< 10 seconds remaining)
  if (gameState.timeLeft <= 10 && !gameState.isTimeFrozen && gameState.active) {
    elTimerBox.classList.add('urgent');
    elDesk.classList.add('panic-glow');
  } else {
    elTimerBox.classList.remove('urgent');
    elDesk.classList.remove('panic-glow');
  }

  elHudScore.textContent = gameState.score;

  // Quota Display for Story vs Arcade
  if (gameState.mode === 'tutorial') {
    elHudQuotaCard.style.display = 'none';
    elHudModeBadge.textContent = "ORIENTATION";
    elHudTimer.textContent = "--:--";
  } else if (gameState.mode === 'story') {
    elHudQuotaCard.style.display = 'block';
    elHudQuota.textContent = `${gameState.quotaMetCount} / ${gameState.targetQuota}`;
    elHudModeBadge.textContent = `STORY: SHIFT ${gameState.storyShiftIndex + 1}`;
  } else {
    elHudQuotaCard.style.display = 'none';
    elHudModeBadge.textContent = "ARCADE SHIFT";
  }

  elStrike1.className = gameState.strikes >= 1 ? 'strike-box active' : 'strike-box';
  elStrike2.className = gameState.strikes >= 2 ? 'strike-box active' : 'strike-box';
  elStrike3.className = gameState.strikes >= 3 ? 'strike-box active' : 'strike-box';
}

// --- 11. NAVIGATION & SHIFT LIFECYCLE ---
function showMainMenu() {
  Dialogue.close();
  if (gameState.mode === 'tutorial') gameState.mode = 'story';
  gameState.active = false;
  gameState.introPause = false;
  clearInterval(gameState.shiftInterval);

  const highScore = StorageManager.getArcadeHighScore();
  elMenuArcadeHighScore.textContent = `${highScore} PTS`;

  const savedShift = StorageManager.getStoryShift();
  elMenuStoryBadge.textContent = `SHIFT ${savedShift} / 10`;

  elMainMenuModal.classList.remove('hidden');
  elBulletinModal.classList.add('hidden');
  elGameOverModal.classList.add('hidden');
  elPetdexModal.classList.add('hidden');
  elSuspectsModal.classList.add('hidden');
  elRulesModal.classList.add('hidden');
}

function prepareStoryShift(shiftIndex) {
  gameState.mode = 'story';
  gameState.storyShiftIndex = Math.min(shiftIndex, STORY_SHIFTS.length - 1);
  const conf = STORY_SHIFTS[gameState.storyShiftIndex];

  gameState.targetQuota = conf.quota;
  gameState.timeLeft = conf.timeLimit;

  // Populate Daily Bulletin overlay
  elBulletinTitle.textContent = conf.title;
  elBulletinStory.textContent = conf.story;
  
  elBulletinRulesList.innerHTML = "";
  conf.rules.forEach(r => {
    const li = document.createElement('li');
    li.textContent = `• ${r}`;
    elBulletinRulesList.appendChild(li);
  });

  elMainMenuModal.classList.add('hidden');
  elGameOverModal.classList.add('hidden');
  elBulletinModal.classList.remove('hidden');
}

function startActualShift() {
  sound.init();
  gameState.active = true;
  gameState.score = 0;
  gameState.quotaMetCount = 0;
  gameState.strikes = 0;
  gameState.casesProcessed = 0;
  gameState.smugglersCaught = 0;
  gameState.correctCalls = 0;
  gameState.wrongCalls = 0;
  gameState.coffeeAvailable = true;
  gameState.isTimeFrozen = false;
  gameState.resolving = false;
  gameState.introPause = false;
  clearTimeout(gameState.coffeeTimeout);
  elBtnCoffee.classList.remove('used');

  if (gameState.mode === 'arcade') {
    gameState.timeLeft = 90;
  }

  elBulletinModal.classList.add('hidden');
  elMainMenuModal.classList.add('hidden');
  elGameOverModal.classList.add('hidden');

  // A shift that introduces a new rule opens with a scripted case and a short briefing.
  const conf = gameState.mode === 'story' ? STORY_SHIFTS[gameState.storyShiftIndex] : null;
  const intro = conf && conf.intro && !StorageManager.hasSeenIntro(conf.shiftNumber) ? SHIFT_INTROS[conf.intro] : null;
  gameState.introPause = Boolean(intro);

  updateHUD();
  generateNewCase(intro ? intro.firstCase : {});
  if (intro) {
    Dialogue.run(intro.steps).then(() => StorageManager.markIntroSeen(conf.shiftNumber));
  }

  clearInterval(gameState.shiftInterval);
  gameState.shiftInterval = setInterval(() => {
    if (!gameState.active || gameState.isTimeFrozen || gameState.resolving || gameState.introPause || isDeskPopupOpen()) return;
    gameState.timeLeft--;

    if (gameState.timeLeft <= 10 && gameState.timeLeft > 0) {
      sound.playWarning();
    }

    updateHUD();

    if (gameState.timeLeft <= 0) {
      handleShiftEnd(false, "SHIFT CONCLUDED", "Time expired on your watch!");
    }
  }, 1000);
}

function handleShiftEnd(success, title, subtitle) {
  gameState.active = false;
  gameState.resolving = false;
  clearInterval(gameState.shiftInterval);
  clearTimeout(gameState.coffeeTimeout);
  gameState.isTimeFrozen = false;
  elDesk.classList.remove('panic-glow');

  // Arcade high score check
  if (gameState.mode === 'arcade') {
    const isNewHigh = StorageManager.saveArcadeHighScore(gameState.score);
    if (isNewHigh) {
      showToast(true, "New arcade high score!");
    }
  }

  // Story progression check
  if (gameState.mode === 'story' && success) {
    const nextShift = gameState.storyShiftIndex + 2; // convert 0-based to 1-based next
    if (nextShift <= STORY_SHIFTS.length) {
      StorageManager.setStoryShift(nextShift);
    }
  }

  // Calculate Rank
  const totalCalls = gameState.correctCalls + gameState.wrongCalls;
  const accuracy = totalCalls > 0 ? Math.round((gameState.correctCalls / totalCalls) * 100) : 0;
  let rank;
  if (totalCalls < 3) rank = "F DISMISSED";
  else if (accuracy >= 95) rank = "S+ ACE DETECTIVE";
  else if (accuracy >= 85) rank = "A SENIOR INSPECTOR";
  else if (accuracy >= 70) rank = "B JUNIOR AGENT";
  else if (accuracy >= 50) rank = "C ROOKIE";
  else rank = "F DISMISSED";
  rank += ` · ${accuracy}%`;

  elEndTitle.textContent = title;
  elEndSubtitle.textContent = subtitle;
  elEndRank.textContent = rank;
  elEndScore.textContent = gameState.score;
  elEndCases.textContent = gameState.casesProcessed;
  elEndSmugglers.textContent = gameState.smugglersCaught;
  elEndStrikes.textContent = `${gameState.strikes} / 3`;

  if (gameState.mode === 'story') {
    if (success) {
      if (gameState.storyShiftIndex + 1 < STORY_SHIFTS.length) {
        elBtnEndAction.textContent = `COMMENCE SHIFT ${gameState.storyShiftIndex + 2}`;
        elBtnEndAction.onclick = () => {
          prepareStoryShift(gameState.storyShiftIndex + 1);
        };
      } else {
        elBtnEndAction.textContent = "CAMPAIGN COMPLETE!";
        elBtnEndAction.onclick = showMainMenu;
      }
    } else {
      elBtnEndAction.textContent = "RETRY SHIFT";
      elBtnEndAction.onclick = () => {
        prepareStoryShift(gameState.storyShiftIndex);
      };
    }
  } else {
    elBtnEndAction.textContent = "PLAY AGAIN (ARCADE)";
    elBtnEndAction.onclick = () => {
      gameState.mode = 'arcade';
      startActualShift();
    };
  }

  elGameOverModal.classList.remove('hidden');
}

// --- 12. GADGETS & TOOLS ---
elBtnCoffee.addEventListener('click', () => {
  if (!gameState.active || !gameState.coffeeAvailable) return;
  gameState.coffeeAvailable = false;
  gameState.isTimeFrozen = true;
  elBtnCoffee.classList.add('used');

  sound.playCoffee();
  showToast(true, "Chai break! Timer frozen for 5 seconds.");
  updateHUD();

  gameState.coffeeTimeout = setTimeout(() => {
    gameState.isTimeFrozen = false;
    updateHUD();
  }, 5000);
});

const VOCAL_REACTIONS = {
  donkey: `"HEE-HAW! ...Er, that's just how zebras talk in the Mara!"`,
  capybara: `"*High-pitched chirp!* ...He has a little throat tickle!"`,
  cheetah: `"*LOW GROWL!* ...He's just purring passionately!"`,
  bark: `"*Woof!* See? A good dog."`,
  meow: `"*Meow.* She says hello, officer."`,
  squeak: `"*Squeak!* Perfectly calm, as you can hear."`
};

elBtnVocalize.addEventListener('click', () => {
  if (!gameState.active || !gameState.currentCase) return;
  const soundType = gameState.currentCase.vocalSound || 'squeak';
  sound.playVocal(soundType);
  elPassSpeech.textContent = VOCAL_REACTIONS[soundType] || VOCAL_REACTIONS.squeak;
});

// Tools unlock with the rules that need them: sponge with covered crates, UV with forged seals.
function getAvailableTools() {
  const rules = getActiveRules();
  const tools = [];
  if (rules.violations.includes('disguise')) tools.push('sponge');
  if (rules.violations.includes('seal')) tools.push('uv');
  return tools;
}

function updateSealImage() {
  const c = gameState.currentCase;
  if (!c) return;
  const uv = gameState.activeTool === 'uv';
  let name;
  if (uv) name = c.sealGenuine ? 'seal-uv-genuine' : 'seal-uv-fake';
  else name = c.sealMisprint ? 'seal-fake' : 'seal-genuine';
  elDocSealImg.src = `art/ui/${name}.svg`;
}

function setTool(tool) {
  gameState.activeTool = tool;
  emitGameEvent('tool', tool);
  updateSealImage();
  elBtnToolSponge.classList.toggle('active', tool === 'sponge');
  elBtnToolUV.classList.toggle('active', tool === 'uv');
  elPermitCard.classList.toggle('uv-on', tool === 'uv');
  elViewportBox.classList.toggle('uv-cursor', tool === 'uv');
}

function updateToolAvailability() {
  const tools = getAvailableTools();
  elBtnToolSponge.classList.toggle('hidden', !tools.includes('sponge'));
  elBtnToolUV.classList.toggle('hidden', !tools.includes('uv'));
  elToolbox.classList.toggle('hidden', tools.length === 0);
  // Each new case starts with the sponge in hand (or no tool if the sponge isn't unlocked yet).
  setTool(tools.includes('sponge') ? 'sponge' : 'none');
}

function toggleTool() {
  const tools = getAvailableTools();
  if (!gameState.active || tools.length === 0) return;
  if (tools.length === 1) {
    setTool(gameState.activeTool === tools[0] ? 'none' : tools[0]);
    return;
  }
  setTool(gameState.activeTool === 'sponge' ? 'uv' : 'sponge');
}

elBtnToolSponge.addEventListener('click', () => setTool('sponge'));
elBtnToolUV.addEventListener('click', () => setTool(gameState.activeTool === 'uv' ? 'none' : 'uv'));

// --- 13. PET-DEX & SUSPECT ROSTER VIEWERS ---
function updateDexBadge() {
  const count = StorageManager.getUserDex().length;
  document.getElementById('dexCountBadge').textContent = `(${count}/${PET_DEX_MASTER.length})`;
}

function renderPetDex() {
  const grid = document.getElementById('petdexGrid');
  grid.innerHTML = "";
  const userDex = StorageManager.getUserDex();

  PET_DEX_MASTER.forEach((item) => {
    const isDiscovered = userDex.includes(item.id);
    const card = document.createElement('div');
    card.className = `dex-card ${isDiscovered ? 'discovered' : 'locked'}`;
    card.innerHTML = `
      ${isDiscovered ? '<span class="dex-busted-tag">BUSTED</span>' : ''}
      <div class="dex-icon">${isDiscovered ? item.emoji : ICON('lock')}</div>
      <div class="dex-name">${isDiscovered ? item.name : '??? Locked'}</div>
      <div class="dex-species">${isDiscovered ? item.species : 'Undiscovered'}</div>
      ${isDiscovered ? `<div style="font-size:0.62rem; color:#b0bec5; margin-top:4px;">${item.lore}</div>` : ''}
    `;
    grid.appendChild(card);
  });
}

function renderSuspectsList() {
  const list = document.getElementById('suspectsList');
  list.innerHTML = "";
  const all = getCombinedPassengers();

  all.forEach((s, idx) => {
    const item = document.createElement('div');
    item.className = "suspect-item";
    item.innerHTML = `
      <div class="s-info">
        <span style="font-size:1.2rem; margin-right:6px;"></span>
        <strong></strong>
        <div style="font-size:0.68rem; color:#90a4ae; font-style:italic;"></div>
      </div>
      ${idx >= DEFAULT_PASSENGERS.length ? `<button data-idx="${idx - DEFAULT_PASSENGERS.length}" class="btnDeleteSuspect" style="background:#d32f2f; border:none; color:#fff; border-radius:4px; padding:2px 6px; font-size:0.7rem; cursor:pointer;">Del</button>` : '<span style="font-size:0.65rem; color:#546e7a;">DEFAULT</span>'}
    `;
    item.querySelector('.s-info span').textContent = s.avatar;
    item.querySelector('.s-info strong').textContent = s.name;
    item.querySelector('.s-info div').textContent = `"${s.quote}"`;
    list.appendChild(item);
  });

  document.querySelectorAll('.btnDeleteSuspect').forEach(b => {
    b.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.idx, 10);
      const customList = StorageManager.getCustomSuspects();
      customList.splice(index, 1);
      StorageManager.saveCustomSuspects(customList);
      renderSuspectsList();
    });
  });
}

// --- 14. EVENT BINDINGS & INIT ---
elBtnApprove.addEventListener('click', () => handleVerdict(true));
elBtnDeny.addEventListener('click', () => handleVerdict(false));

function isDeskPopupOpen() {
  return [elPetdexModal, elSuspectsModal, elRulesModal].some(m => !m.classList.contains('hidden'));
}

function isAnyPopupOpen() {
  return document.querySelector('.modal-backdrop:not(.hidden)') !== null;
}

window.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, select') || isAnyPopupOpen()) return;
  if (Dialogue.handleKey(e)) return;
  if (e.key === 'a' || e.key === 'A') {
    handleVerdict(true);
  } else if (e.key === 'd' || e.key === 'D') {
    handleVerdict(false);
  } else if (e.key === ' ' || e.key === 'w' || e.key === 'W') {
    // Stop Space from also "clicking" whichever button still has focus.
    e.preventDefault();
    toggleTool();
  }
});

// Small screens fold the header buttons into a menu.
const elBtnMoreMenu = document.getElementById('btnMoreMenu');
const elHeaderBtns = document.getElementById('headerBtns');

function setHeaderMenuOpen(open) {
  elHeaderBtns.classList.toggle('open', open);
  elBtnMoreMenu.setAttribute('aria-expanded', String(open));
}

elBtnMoreMenu.addEventListener('click', (e) => {
  e.stopPropagation();
  setHeaderMenuOpen(!elHeaderBtns.classList.contains('open'));
});
elHeaderBtns.addEventListener('click', () => setHeaderMenuOpen(false));
document.addEventListener('click', (e) => {
  if (!elHeaderBtns.contains(e.target)) setHeaderMenuOpen(false);
});

// Menu Actions
elBtnMenuStory.addEventListener('click', () => {
  if (!StorageManager.isTutorialDone()) {
    Tutorial.start();
    return;
  }
  const currentShift = StorageManager.getStoryShift();
  prepareStoryShift(currentShift - 1);
});

document.getElementById('btnReplayTutorial').addEventListener('click', () => Tutorial.start());

elBtnMenuArcade.addEventListener('click', () => {
  gameState.mode = 'arcade';
  startActualShift();
});

elBtnResetStory.addEventListener('click', () => {
  if (confirm("Reset your Story Campaign back to Shift 1?")) {
    StorageManager.resetStory();
    elMenuStoryBadge.textContent = "SHIFT 1 / 10";
    showToast(true, "Campaign reset to Shift 1.");
  }
});

elBtnStartBulletinShift.addEventListener('click', startActualShift);
elBtnMainMenu.addEventListener('click', showMainMenu);
elBtnEndReturnMenu.addEventListener('click', showMainMenu);

elBtnOpenDex.addEventListener('click', () => {
  renderPetDex();
  elPetdexModal.classList.remove('hidden');
});
elBtnCloseDex.addEventListener('click', () => {
  elPetdexModal.classList.add('hidden');
});

elBtnCustomSuspects.addEventListener('click', () => {
  renderSuspectsList();
  elSuspectsModal.classList.remove('hidden');
});
elBtnCloseSuspects.addEventListener('click', () => {
  elSuspectsModal.classList.add('hidden');
});

document.getElementById('btnAddSuspect').addEventListener('click', () => {
  const name = document.getElementById('inputSuspectName').value.trim();
  const quote = document.getElementById('inputSuspectQuote').value.trim();
  const avatar = document.getElementById('selectAvatar').value;

  if (!name) return;

  const list = StorageManager.getCustomSuspects();
  list.push({
    name: name,
    avatar: avatar,
    quote: quote || "I assure you this is completely legal!"
  });

  StorageManager.saveCustomSuspects(list);
  document.getElementById('inputSuspectName').value = "";
  document.getElementById('inputSuspectQuote').value = "";
  renderSuspectsList();
});

elBtnSound.addEventListener('click', () => {
  sound.init();
  sound.muted = !sound.muted;
  elBtnSound.innerHTML = `${ICON(sound.muted ? 'sound-off' : 'sound-on')} ${sound.muted ? 'OFF' : 'ON'}`;
});

elBtnHelp.addEventListener('click', () => {
  elRulesModal.classList.remove('hidden');
});
elBtnCloseRules.addEventListener('click', () => {
  elRulesModal.classList.add('hidden');
});

// App Startup
updateDexBadge();
showMainMenu();
