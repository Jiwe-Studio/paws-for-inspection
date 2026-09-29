/* ==========================================================================
   EXOTIC CUSTOMS: PET DETECTIVE - GAME CONTROLLER (v2.1)
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
const STORY_SHIFTS = [
  {
    shiftNumber: 1,
    title: "Shift 1: Rookie Orientation - The Paper Trail",
    story: "Welcome to B.C.E.S.R.A. Checkpoint Charlie! The Inspector General has an eye on you today. Shady travelers frequently forge dates or borrow stolen passports. Keep your cool and double check every date against today's customs calendar.",
    rules: [
      "Target Quota: Process 4 cases correctly.",
      "Check PERMIT EXPIRY DATES (Any date prior to OCT 14, 2026 is an immediate DENY).",
      "Check OWNER NAMES against the passenger badge."
    ],
    quota: 4,
    timeLimit: 90,
    allowedTypes: ["legal", "expired_date", "name_mismatch"]
  },
  {
    shiftNumber: 2,
    title: "Shift 2: Heavy Cargo - Scale Calibrations",
    story: "Intelligence reports that gold bullion and lead weights are being smuggled inside ordinary domestic pet carriers. The bio-mass digital scale has been freshly calibrated. Watch it like a hawk!",
    rules: [
      "Target Quota: Process 5 cases correctly.",
      "Compare scale reading to PERMITTED MAX WEIGHT.",
      "Watch for MISSING CITES HOLOGRAPHIC SEALS."
    ],
    quota: 5,
    timeLimit: 90,
    allowedTypes: ["legal", "weight_mismatch", "missing_seal", "expired_date"]
  },
  {
    shiftNumber: 3,
    title: "Shift 3: Paint & Powder - The Disguise Syndicate",
    story: "A cosmetic hair dye cartel has breached the terminal! Travelers are attempting to pass off domestic farm animals as rare African wildlife. Grab your Solvent Sponge and scrub away suspicious coats.",
    rules: [
      "Target Quota: Process 5 cases correctly.",
      "SCRUB SUSPICIOUS COATS with the Solvent Sponge.",
      "DENY entry if the revealed creature does not match declared species!"
    ],
    quota: 5,
    timeLimit: 85,
    allowedTypes: ["legal", "disguise", "weight_mismatch", "expired_date"]
  },
  {
    shiftNumber: 4,
    title: "Shift 4: The Avian Underground",
    story: "High-roller smugglers have started stitching secret zipper pockets into winter coats and travel vests. Parrots, chameleons, and exotic reptiles are hiding under padded luggage.",
    rules: [
      "Target Quota: Process 6 cases correctly.",
      "Check coats thoroughly for CONTRABAND POCKETS.",
      "Provoke sounds with the Audio Tool to test reactions!"
    ],
    quota: 6,
    timeLimit: 85,
    allowedTypes: ["legal", "disguise", "weight_mismatch", "name_mismatch"]
  },
  {
    shiftNumber: 5,
    title: "Shift 5: High Society Scams",
    story: "Nobility and eccentric millionaires are arriving with purebred prize beasts and forged diplomatic exemptions. Do not let titles intimidate you: the law is the law!",
    rules: [
      "Target Quota: Process 6 cases correctly.",
      "Full rigorous inspection: Name, Seals, Dates, Weights, and Disguises.",
      "Remember to take an Inspector Coffee sip if the clock gets tight!"
    ],
    quota: 6,
    timeLimit: 80,
    allowedTypes: ["legal", "disguise", "missing_seal", "expired_date", "weight_mismatch"]
  },
  {
    shiftNumber: 6,
    title: "Shift 6: Midnight Stampede",
    story: "Terminal rush hour! The line stretches out into the tarmac. The Inspector General demands high velocity without sacrificing accuracy. 3 strikes and you will be escorted off the premises.",
    rules: [
      "Target Quota: Process 7 cases correctly.",
      "Time is reduced to 75 seconds.",
      "Zero tolerance on counterfeit seals and overweight carriers."
    ],
    quota: 7,
    timeLimit: 75,
    allowedTypes: ["legal", "disguise", "weight_mismatch", "expired_date", "name_mismatch"]
  },
  {
    shiftNumber: 7,
    title: "Shift 7: Red Alert - The Chameleon Protocol",
    story: "Counterfeiters have upgraded to high-grade industrial paints and heat-resistant wigs. Some animals look nearly identical until you scrub deeply into the underlayer.",
    rules: [
      "Target Quota: Process 7 cases correctly.",
      "Scrub at least 40% of the animal surface to trigger full tag exposure."
    ],
    quota: 7,
    timeLimit: 75,
    allowedTypes: ["legal", "disguise", "weight_mismatch", "expired_date"]
  },
  {
    shiftNumber: 8,
    title: "Shift 8: The Weight Ring Crackdown",
    story: "Federal marshals have seized a warehouse of lead-lined cages. Massive discrepancies between declared and scale weights are rampant today.",
    rules: [
      "Target Quota: Process 8 cases correctly.",
      "Scrutinize the green LED scale reading immediately."
    ],
    quota: 8,
    timeLimit: 70,
    allowedTypes: ["legal", "weight_mismatch", "disguise", "missing_seal"]
  },
  {
    shiftNumber: 9,
    title: "Shift 9: The Syndicate Boss Approaches",
    story: "Rumors say the notorious smuggling ringleader 'Chester Copperpot' is personally flying in today with a cargo of disguised apex predators. Keep your hand on the DENY stamp.",
    rules: [
      "Target Quota: Process 8 cases correctly.",
      "Stay calm, check permits methodically, and use your tools."
    ],
    quota: 8,
    timeLimit: 70,
    allowedTypes: ["legal", "disguise", "weight_mismatch", "name_mismatch", "expired_date"]
  },
  {
    shiftNumber: 10,
    title: "Shift 10: The Master Inspector Trial",
    story: "Final assessment for the permanent rank of CHIEF DETECTIVE GENERAL. Every trick, disguise, forged stamp, and identity mismatch in the book will cross your desk. Make the bureau proud!",
    rules: [
      "Target Quota: Process 9 cases correctly.",
      "Maintain flawless accuracy to earn the Golden Agency Crest.",
      "3 Strikes = Immediate Termination."
    ],
    quota: 9,
    timeLimit: 65,
    allowedTypes: ["legal", "disguise", "weight_mismatch", "missing_seal", "expired_date", "name_mismatch"]
  }
];

// --- 3. PET-DEX DATABASE ---
const PET_DEX_MASTER = [
  { id: "donkey_zebra", name: "The Donkeyxote", emoji: "🐴", species: "Gray Donkey", disguise: "Painted Zebra", lore: "An ordinary farm donkey spray-painted with cheap acrylic stripes and taped ears." },
  { id: "capybara_dog", name: "Sir Fluffsbark", emoji: "🦫", species: "Giant Capybara", disguise: "Golden Retriever", lore: "Dyed with supermarket bleach. Emits suspicious chirps instead of barks." },
  { id: "cheetah_cat", name: "Barnaby the Tabby", emoji: "🐆", species: "African Cheetah", disguise: "House Cat", lore: "Purrs at 120 decibels. Smuggled under brown shoe polish." },
  { id: "macaw_vest", name: "Trenchcoat Polly", emoji: "🦜", species: "Smuggled Macaws", disguise: "Poodle Vest", lore: "Three rare macaws tucked inside secret velvet-lined zipper pockets." },
  { id: "warthog_pig", name: "Princess Piglet", emoji: "🐗", species: "Savannah Warthog", disguise: "Teacup Pig", lore: "Razor-sharp tusks concealed with thick layers of pink blush powder." },
  { id: "croc_wiener", name: "The Wiener Croc", emoji: "🐊", species: "Baby Alligator", disguise: "Dachshund", lore: "Stuffed inside a knit sweater with glued felt puppy ears." },
  { id: "gold_rabbit", name: "Lead-Foot Thumper", emoji: "🐰", species: "Holland Lop", disguise: "Contraband Weight", lore: "Legit bunny, but its travel carrier was lined with 26 kg of gold bars!" },
  { id: "penguin_butler", name: "Sir Tuxedo", emoji: "🐧", species: "Emperor Penguin", disguise: "Formal Duck", lore: "Wearing a bow-tie. Owner claimed it was an emotional support mallard." },
  { id: "legal_bengal", name: "Her Royal Paws", emoji: "🐱", species: "Purebred Bengal", disguise: "None", lore: "100% legal champion feline with verified diplomatic quarantine clearance." },
  { id: "legal_alpaca", name: "Llama Del Rey", emoji: "🦙", species: "Huacaya Alpaca", disguise: "None", lore: "Legit wool prize alpaca travelling with valid documentation." },
  { id: "legal_hedgehog", name: "Spike McFluff", emoji: "🦔", species: "Pygmy Hedgehog", disguise: "None", lore: "Verified captive-bred insectivore in peak health." },
  { id: "legal_macaw", name: "Captain Feathers", emoji: "🦜", species: "Scarlet Macaw", disguise: "None", lore: "Registered zoological specimen with pristine CITES hologram." }
];

// --- 4. CASE BLUEPRINTS ---
const CASE_BLUEPRINTS = [
  {
    dexId: "donkey_zebra",
    type: "disguise",
    speech: "Just an authentic Serengeti zebra! Loves rolling in dust, definitely don't wash him!",
    declaredSpecies: "Plains Zebra (Equus quagga)",
    declaredWeight: 350.0,
    actualWeight: 210.5,
    revealedEmoji: "🐴",
    revealedTag: "Gray Donkey (Equus asinus) wearing tape!",
    disguiseStyle: "zebra_paint",
    vocalSound: "donkey",
    violationReason: "DISGUISED ANIMAL! Paint rubbed off to reveal an ordinary donkey with taped ears!"
  },
  {
    dexId: "capybara_dog",
    type: "disguise",
    speech: "He's just a funny-looking Golden Retriever puppy. Barks with a squeak!",
    declaredSpecies: "Golden Retriever (Canis lupus familiaris)",
    declaredWeight: 32.0,
    actualWeight: 52.0,
    revealedEmoji: "🦫",
    revealedTag: "Wild Giant Capybara (Hydrochoerus hydrochaeris)",
    disguiseStyle: "golden_fluff",
    vocalSound: "capybara",
    violationReason: "FRAUD! Scrubbing washed away yellow hair dye to reveal a wild Capybara!"
  },
  {
    dexId: "cheetah_cat",
    type: "disguise",
    speech: "He's a domestic tabby, officer. Purrs like a chainsaw and eats whole gazelles!",
    declaredSpecies: "Domestic Cat (Felis catus)",
    declaredWeight: 4.5,
    actualWeight: 39.0,
    revealedEmoji: "🐆",
    revealedTag: "African Cheetah (Acinonyx jubatus)",
    disguiseStyle: "tabby_paint",
    vocalSound: "cheetah",
    violationReason: "ILLEGAL PREDATOR! Brown dye removed to reveal an endangered wild Cheetah!"
  },
  {
    dexId: "macaw_vest",
    type: "disguise",
    speech: "My poodle's coat is naturally bulky. Do not touch her vest, she is sensitive!",
    declaredSpecies: "Standard Poodle (Canis familiaris)",
    declaredWeight: 22.0,
    actualWeight: 29.5,
    revealedEmoji: "🦜",
    revealedTag: "Smuggled Neon Macaws hidden under coat!",
    disguiseStyle: "trenchcoat_contraband",
    vocalSound: "squeak",
    violationReason: "CONTRABAND SMUGGLING! Scrubbed undercoat revealed illegally hidden Macaws!"
  },
  {
    dexId: "warthog_pig",
    type: "disguise",
    speech: "Micro miniature piglet! Those aren't tusks, those are just oversized baby teeth.",
    declaredSpecies: "Teacup Pig (Sus domesticus)",
    declaredWeight: 12.0,
    actualWeight: 88.0,
    revealedEmoji: "🐗",
    revealedTag: "Savannah Warthog (Phacochoerus africanus)",
    disguiseStyle: "pink_powder",
    vocalSound: "growl",
    violationReason: "DANGEROUS BEAST! Pink makeup scrubbed away revealing ferocious tusks!"
  },
  {
    dexId: "croc_wiener",
    type: "disguise",
    speech: "My dachshund has scaly skin because of allergies. Absolutely harmless lap dog!",
    declaredSpecies: "Dachshund (Canis lupus)",
    declaredWeight: 9.0,
    actualWeight: 24.0,
    revealedEmoji: "🐊",
    revealedTag: "Wild American Alligator (Alligator mississippiensis)",
    disguiseStyle: "green_knit",
    vocalSound: "cheetah",
    violationReason: "DEADLY REPTILE! Scrubbing revealed a baby alligator disguised in a sweater!"
  },
  {
    dexId: "gold_rabbit",
    type: "weight_mismatch",
    speech: "My bunny is just slightly plump from all the carrots during the flight.",
    declaredSpecies: "Holland Lop Rabbit (Oryctolagus cuniculus)",
    declaredWeight: 2.5,
    actualWeight: 28.5,
    revealedEmoji: "🐰",
    revealedTag: "Rabbit carrier padded with contraband bricks!",
    disguiseStyle: "clean_dust",
    vocalSound: "squeak",
    violationReason: "WEIGHT FRAUD! Scale reads 28.5 KG vs declared maximum of 2.5 KG!"
  },
  {
    dexId: "penguin_butler",
    type: "disguise",
    speech: "He is my formal emotional support duck. He likes cold showers.",
    declaredSpecies: "Pekin Duck (Anas platyrhynchos)",
    declaredWeight: 3.5,
    actualWeight: 22.0,
    revealedEmoji: "🐧",
    revealedTag: "Emperor Penguin (Aptenodytes forsteri)",
    disguiseStyle: "tabby_paint",
    vocalSound: "squeak",
    violationReason: "PROTECTED SPECIES! Scrubbing revealed an Antarctic Emperor Penguin!"
  },
  // Paperwork Traps
  {
    dexId: "capybara_dog",
    type: "expired_date",
    speech: "Everything is in order! Just renewed it... well, a little while back.",
    declaredSpecies: "Border Collie (Canis familiaris)",
    declaredWeight: 20.0,
    actualWeight: 19.8,
    revealedEmoji: "🐶",
    revealedTag: "Legitimate Border Collie",
    disguiseStyle: "clean_dust",
    vocalSound: "squeak",
    violationReason: "EXPIRED PERMIT! Permit expired in 2024, prior to today's date (OCT 2026)!"
  },
  {
    dexId: "donkey_zebra",
    type: "name_mismatch",
    speech: "I am definitely the registered owner. Pay no attention to my other passport.",
    declaredSpecies: "Persian Cat (Felis catus)",
    declaredWeight: 4.8,
    actualWeight: 4.7,
    revealedEmoji: "🐱",
    revealedTag: "Legitimate Persian Cat",
    disguiseStyle: "clean_dust",
    vocalSound: "squeak",
    violationReason: "IDENTITY MISMATCH! Passenger name does not match permit owner!"
  },
  {
    dexId: "legal_alpaca",
    type: "missing_seal",
    speech: "This permit was printed fresh at the embassy this morning, pinky swear!",
    declaredSpecies: "Huacaya Alpaca (Vicugna pacos)",
    declaredWeight: 65.0,
    actualWeight: 64.2,
    revealedEmoji: "🦙",
    revealedTag: "Domestic Alpaca",
    disguiseStyle: "clean_dust",
    vocalSound: "squeak",
    violationReason: "FORGED DOCUMENT! Permit is missing the mandatory CITES holographic security seal!"
  },
  // Clean Legal Cases
  {
    dexId: "legal_bengal",
    type: "legal",
    speech: "Here is her pedigree and CITES certification. She's fully vaccinated!",
    declaredSpecies: "Bengal Cat (Felis catus × Prionailurus)",
    declaredWeight: 5.5,
    actualWeight: 5.2,
    revealedEmoji: "🐱",
    revealedTag: "Verified Purebred Domestic Bengal",
    disguiseStyle: "clean_dust",
    vocalSound: "squeak",
    violationReason: null
  },
  {
    dexId: "legal_macaw",
    type: "legal",
    speech: "Registered breeder transport with active scientific transit papers.",
    declaredSpecies: "Scarlet Macaw (Ara macao)",
    declaredWeight: 1.2,
    actualWeight: 1.15,
    revealedEmoji: "🦜",
    revealedTag: "Registered Aviary Specimen",
    disguiseStyle: "clean_dust",
    vocalSound: "squeak",
    violationReason: null
  },
  {
    dexId: "legal_hedgehog",
    type: "legal",
    speech: "My sweet little hedgehog. Loves belly rubs and mealworms.",
    declaredSpecies: "African Pygmy Hedgehog (Atelerix albiventris)",
    declaredWeight: 0.5,
    actualWeight: 0.48,
    revealedEmoji: "🦔",
    revealedTag: "Verified Captive Bred Pygmy Hedgehog",
    disguiseStyle: "clean_dust",
    vocalSound: "squeak",
    violationReason: null
  }
];

const DEFAULT_PASSENGERS = [
  { name: "Arthur 'Fingers' McCoy", avatar: "🥸", quote: "Just an authentic Serengeti zebra! Definitely don't wash him!" },
  { name: "Baroness Von Fluff", avatar: "👒", quote: "My puppy is imported from the Austrian Alps, inspector!" },
  { name: "Captain Jack O'Collar", avatar: "🤠", quote: "Don't mind the squawks coming from my coat." },
  { name: "Madame Penelope Zaza", avatar: "👩‍🌾", quote: "He purrs loudly because he loves customs agents!" },
  { name: "Chester Copperpot", avatar: "🧐", quote: "My rabbit has very heavy bones, that is all." },
  { name: "Montgomery Burns", avatar: "🎩", quote: "Release the hounds! I mean, release my prize alpaca." }
];

// --- 5. LOCALSTORAGE PROGRESSION MANAGER ---
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

  static getCustomSuspects() {
    return JSON.parse(localStorage.getItem('petdetect_custom_suspects_v2') || "[]");
  }

  static saveCustomSuspects(list) {
    localStorage.setItem('petdetect_custom_suspects_v2', JSON.stringify(list));
  }
}

// --- 6. GAME CONTROLLER STATE ---
const TODAY_STR = "OCT 14, 2026";
const TODAY_YEAR = 2026;

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
  coffeeTimeout: null,
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
const elWipeStatus = document.getElementById('wipeStatus');
const elBtnToolSponge = document.getElementById('btnToolSponge');
const elBtnToolUV = document.getElementById('btnToolUV');
const elBtnCoffee = document.getElementById('btnCoffee');
const elBtnVocalize = document.getElementById('btnVocalize');

const elPermitCard = document.getElementById('permitCard');
const elDocPermitId = document.getElementById('docPermitId');
const elDocOwner = document.getElementById('docOwner');
const elDocExpiry = document.getElementById('docExpiry');
const elDocExpirySub = document.getElementById('docExpirySub');
const elDocSpecies = document.getElementById('docSpecies');
const elDocWeight = document.getElementById('docWeight');
const elDocChip = document.getElementById('docChip');
const elDocSeal = document.getElementById('docSeal');
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
function setupScratchCanvas(style) {
  const w = elScratchCanvas.width;
  const h = elScratchCanvas.height;

  canvasCtx.globalCompositeOperation = 'source-over';
  canvasCtx.clearRect(0, 0, w, h);

  if (style === 'zebra_paint') {
    canvasCtx.fillStyle = '#f5f5f5';
    canvasCtx.fillRect(0, 0, w, h);

    canvasCtx.fillStyle = '#111';
    for (let x = 20; x < w; x += 40) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(x, 0);
      canvasCtx.lineTo(x + 22, 0);
      canvasCtx.lineTo(x + 8, h * 0.75);
      canvasCtx.lineTo(x - 5, h);
      canvasCtx.lineTo(x - 18, h * 0.7);
      canvasCtx.closePath();
      canvasCtx.fill();

      canvasCtx.beginPath();
      canvasCtx.arc(x - 8, h - 20, 7, 0, Math.PI * 2);
      canvasCtx.fill();
    }

    canvasCtx.fillStyle = '#d32f2f';
    canvasCtx.font = 'bold 14px monospace';
    canvasCtx.fillText("⚠ FRESH ACRYLIC STRIPES", 16, 26);
  } 
  else if (style === 'golden_fluff') {
    canvasCtx.fillStyle = '#ffca28';
    canvasCtx.fillRect(0, 0, w, h);

    canvasCtx.fillStyle = '#f57f17';
    for (let i = 0; i < 35; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      canvasCtx.beginPath();
      canvasCtx.arc(rx, ry, 15 + Math.random() * 20, 0, Math.PI * 2);
      canvasCtx.fill();
    }

    canvasCtx.fillStyle = '#4e342e';
    canvasCtx.font = 'bold 13px monospace';
    canvasCtx.fillText("🏷️ 'SUPER RETRIEVER BLONDE DYE #4'", 16, 26);
  } 
  else if (style === 'tabby_paint') {
    canvasCtx.fillStyle = '#8d6e63';
    canvasCtx.fillRect(0, 0, w, h);

    canvasCtx.fillStyle = '#5d4037';
    for (let y = 30; y < h; y += 38) {
      canvasCtx.fillRect(0, y, w, 14);
    }
    canvasCtx.fillStyle = '#fff';
    canvasCtx.font = 'bold 13px monospace';
    canvasCtx.fillText("🐾 CONCEALING COAT SPRAY", 16, 26);
  } 
  else if (style === 'trenchcoat_contraband') {
    canvasCtx.fillStyle = '#37474f';
    canvasCtx.fillRect(0, 0, w, h);

    canvasCtx.strokeStyle = '#cfd8dc';
    canvasCtx.lineWidth = 4;
    canvasCtx.setLineDash([8, 8]);
    canvasCtx.beginPath();
    canvasCtx.moveTo(w / 2, 0);
    canvasCtx.lineTo(w / 2, h);
    canvasCtx.stroke();
    canvasCtx.setLineDash([]);

    canvasCtx.fillStyle = '#eceff1';
    canvasCtx.font = 'bold 13px monospace';
    canvasCtx.fillText("🧥 PADDED HEAVY TRAVEL VEST", 16, 26);
  }
  else if (style === 'pink_powder') {
    canvasCtx.fillStyle = '#f48fb1';
    canvasCtx.fillRect(0, 0, w, h);

    canvasCtx.fillStyle = '#f06292';
    for (let i = 0; i < 25; i++) {
      canvasCtx.beginPath();
      canvasCtx.arc(Math.random() * w, Math.random() * h, 24, 0, Math.PI * 2);
      canvasCtx.fill();
    }
    canvasCtx.fillStyle = '#880e4f';
    canvasCtx.font = 'bold 13px monospace';
    canvasCtx.fillText("🌸 'TEACUP BLUSH' POWDER", 16, 26);
  }
  else if (style === 'green_knit') {
    canvasCtx.fillStyle = '#795548';
    canvasCtx.fillRect(0, 0, w, h);
    canvasCtx.fillStyle = '#e65100';
    canvasCtx.font = 'bold 13px monospace';
    canvasCtx.fillText("🌭 KNIT DACHSHUND BUN SUIT", 16, 26);
  }
  else {
    canvasCtx.fillStyle = 'rgba(120, 144, 156, 0.45)';
    canvasCtx.fillRect(0, 0, w, h);

    canvasCtx.fillStyle = '#eceff1';
    canvasCtx.font = '12px monospace';
    canvasCtx.fillText("✨ TRAVEL TRANSIT CRATE (CLEAN COAT)", 16, 26);
  }

  elWipeStatus.textContent = "Scrub animal to inspect!";
  elAnimalTrueTag.style.opacity = "0.2";
}

function scratchAt(clientX, clientY) {
  const rect = elScratchCanvas.getBoundingClientRect();
  const scaleX = elScratchCanvas.width / rect.width;
  const scaleY = elScratchCanvas.height / rect.height;
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  canvasCtx.save();
  canvasCtx.globalCompositeOperation = 'destination-out';
  canvasCtx.beginPath();

  const radius = gameState.activeTool === 'sponge' ? 38 : 46;
  canvasCtx.arc(x, y, radius, 0, Math.PI * 2);
  canvasCtx.fill();
  canvasCtx.restore();

  const now = Date.now();
  if (now - gameState.lastSpongeSoundTime > 90) {
    sound.playSponge();
    gameState.lastSpongeSoundTime = now;
  }

  sampleWipeProgress();
}

function sampleWipeProgress() {
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

  if (percent < 15) {
    elWipeStatus.textContent = `Scrubbing... (${percent}% cleared)`;
    elAnimalTrueTag.style.opacity = "0.2";
  } else if (percent < 45) {
    elWipeStatus.textContent = `Features emerging! (${percent}% cleared)`;
    elAnimalTrueTag.style.opacity = "0.6";
  } else {
    elWipeStatus.textContent = `🔍 UNDERLAYER FULLY EXPOSED! (${percent}%)`;
    elAnimalTrueTag.style.opacity = "1";
  }
}

// Scratch Touch & Mouse Events
elScratchCanvas.addEventListener('mousedown', (e) => {
  gameState.isWiping = true;
  sound.init();
  scratchAt(e.clientX, e.clientY);
});

window.addEventListener('mousemove', (e) => {
  if (!gameState.isWiping) return;
  scratchAt(e.clientX, e.clientY);
});

window.addEventListener('mouseup', () => {
  gameState.isWiping = false;
});

elScratchCanvas.addEventListener('touchstart', (e) => {
  gameState.isWiping = true;
  sound.init();
  if (e.touches.length > 0) {
    scratchAt(e.touches[0].clientX, e.touches[0].clientY);
  }
  e.preventDefault();
}, { passive: false });

elScratchCanvas.addEventListener('touchmove', (e) => {
  if (!gameState.isWiping) return;
  if (e.touches.length > 0) {
    scratchAt(e.touches[0].clientX, e.touches[0].clientY);
  }
  e.preventDefault();
}, { passive: false });

elScratchCanvas.addEventListener('touchend', () => {
  gameState.isWiping = false;
});

// --- 9. PROCEDURAL CASE GENERATOR ---
function getCombinedPassengers() {
  return [...DEFAULT_PASSENGERS, ...StorageManager.getCustomSuspects()];
}

function generateNewCase() {
  // Filter case blueprints based on shift allowedTypes if in Story Mode
  let availablePool = CASE_BLUEPRINTS;
  if (gameState.mode === 'story') {
    const shiftConf = STORY_SHIFTS[gameState.storyShiftIndex] || STORY_SHIFTS[0];
    if (shiftConf.allowedTypes && shiftConf.allowedTypes.length > 0) {
      availablePool = CASE_BLUEPRINTS.filter(b => shiftConf.allowedTypes.includes(b.type));
      if (availablePool.length === 0) availablePool = CASE_BLUEPRINTS;
    }
  }

  const blueprint = availablePool[Math.floor(Math.random() * availablePool.length)];
  const passengerList = getCombinedPassengers();
  const passenger = passengerList[Math.floor(Math.random() * passengerList.length)];
  
  const permitId = "#CITES-" + Math.floor(1000 + Math.random() * 9000) + "-X";
  const chipId = "#CHIP-" + Math.floor(1000 + Math.random() * 9000) + "-NAT";

  let expiryYear = TODAY_YEAR;
  let expiryMonth = "NOV";
  let expiryDay = "24";

  if (blueprint.type === 'expired_date') {
    expiryYear = 2024;
    expiryMonth = "MAY";
    expiryDay = "12";
  }

  const expiryStr = `${expiryMonth} ${expiryDay}, ${expiryYear}`;

  let permitOwner = passenger.name;
  if (blueprint.type === 'name_mismatch') {
    permitOwner = "Count Roderick Snodgrass";
  }

  const newCase = {
    blueprint: blueprint,
    passengerName: passenger.name,
    passengerAvatar: passenger.avatar,
    passengerSpeech: blueprint.speech,
    permitId: permitId,
    chipId: chipId,
    permitOwner: permitOwner,
    expiryDate: expiryStr,
    isExpired: expiryYear < TODAY_YEAR,
    hasSeal: blueprint.type !== 'missing_seal',
    scaleWeight: blueprint.actualWeight,
    declaredWeight: blueprint.declaredWeight,
    declaredSpecies: blueprint.declaredSpecies,
    shouldApprove: blueprint.type === 'legal'
  };

  gameState.currentCase = newCase;
  gameState.resolving = false;
  renderCase(newCase);
}

function renderCase(c) {
  elStampOverlay.className = "rubber-stamp-overlay";

  elPassAvatar.textContent = c.passengerAvatar;
  elPassName.textContent = c.passengerName;
  elPassSpeech.textContent = `"${c.passengerSpeech}"`;

  elScale.textContent = `${c.scaleWeight.toFixed(1)} KG`;
  elAnimalGraphic.textContent = c.blueprint.revealedEmoji;
  elAnimalTrueTag.innerHTML = `<span>🔍 ${c.blueprint.revealedTag}</span>`;

  elDocPermitId.textContent = c.permitId;
  elDocOwner.textContent = c.permitOwner;
  elDocExpiry.textContent = c.expiryDate;
  elDocSpecies.textContent = c.declaredSpecies;
  elDocWeight.textContent = `Max ${c.declaredWeight.toFixed(1)} KG`;
  elDocChip.textContent = c.chipId;
  elDocCurrentDate.textContent = TODAY_STR;

  if (c.isExpired) {
    elDocExpirySub.textContent = "Status: EXPIRED";
    elDocExpirySub.style.color = "#d32f2f";
  } else {
    elDocExpirySub.textContent = "Status: ACTIVE";
    elDocExpirySub.style.color = "#2e7d32";
  }

  if (c.hasSeal) {
    elDocSeal.className = "security-hologram";
    elDocSeal.innerHTML = "OFFICIAL<br>CITES SEAL";
  } else {
    elDocSeal.className = "security-hologram missing";
    elDocSeal.innerHTML = "";
  }

  setupScratchCanvas(c.blueprint.disguiseStyle);
}

// --- 10. VERDICT HANDLING ---
function handleVerdict(approvedByUser) {
  if (!gameState.active || !gameState.currentCase || gameState.resolving) return;

  // Lock until the next case is on the desk so one case can't be stamped twice.
  gameState.resolving = true;
  const c = gameState.currentCase;
  gameState.currentCase = null;
  const isCorrect = (approvedByUser === c.shouldApprove);

  sound.init();
  sound.playStamp(approvedByUser);

  elStampOverlay.textContent = approvedByUser ? "APPROVED" : "DENIED";
  elStampOverlay.className = `rubber-stamp-overlay active-stamp ${approvedByUser ? 'approved' : 'denied'}`;

  if (isCorrect) {
    sound.playSuccess();
    gameState.score += 100;
    gameState.casesProcessed++;
    gameState.correctCalls++;
    gameState.quotaMetCount++;
    if (!c.shouldApprove) {
      gameState.smugglersCaught++;
    }

    const dexMatchesCase = c.blueprint.type === 'disguise' || c.blueprint.type === 'legal';
    if (dexMatchesCase && StorageManager.saveDexItem(c.blueprint.dexId)) {
      updateDexBadge();
    }

    const reason = c.shouldApprove 
      ? "Legitimate transit approved! (+100 PTS)" 
      : `Busted! ${c.blueprint.violationReason} (+100 PTS)`;
    showToast(true, reason);

    // In Story Mode: Check if target quota has been achieved!
    if (gameState.mode === 'story' && gameState.quotaMetCount >= gameState.targetQuota) {
      gameState.active = false;
      updateHUD();
      setTimeout(() => {
        handleShiftEnd(true, "QUOTA COMPLETED!", "Excellent detective work! Shift requirements met.");
      }, 550);
      return;
    }
  } else {
    sound.playStrike();
    triggerScreenShake();
    gameState.strikes++;
    gameState.wrongCalls++;
    gameState.timeLeft = Math.max(0, gameState.timeLeft - 10);

    let failDetail = "";
    if (approvedByUser && !c.shouldApprove) {
      failDetail = `Illegal Entry Allowed! ${c.blueprint.violationReason} (-10s penalty)`;
    } else {
      failDetail = `False Rejection! That animal and permit were completely legitimate! (-10s penalty)`;
    }
    showToast(false, `STRIKE ${gameState.strikes}! ${failDetail}`);
  }

  updateHUD();

  if (gameState.strikes >= gameState.maxStrikes) {
    gameState.active = false;
    setTimeout(() => {
      handleShiftEnd(false, "FIRED BY INSPECTOR GENERAL", "3 Strikes! Dismissed from the customs desk.");
    }, 550);
    return;
  }

  setTimeout(() => {
    if (gameState.active) {
      generateNewCase();
    }
  }, 480);
}

function triggerScreenShake() {
  elDesk.classList.remove('screen-shake');
  void elDesk.offsetWidth;
  elDesk.classList.add('screen-shake');
}

function showToast(isCorrect, message) {
  elToast.className = `verdict-feedback show ${isCorrect ? 'correct' : 'wrong'}`;
  elToastIcon.textContent = isCorrect ? '✅' : '❌';
  elToastMsg.textContent = message;

  clearTimeout(elToast.hideTimeout);
  elToast.hideTimeout = setTimeout(() => {
    elToast.className = 'verdict-feedback';
  }, 2600);
}

function updateHUD() {
  const mins = Math.floor(gameState.timeLeft / 60);
  const secs = gameState.timeLeft % 60;
  elHudTimer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (gameState.isTimeFrozen) {
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
  if (gameState.mode === 'story') {
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
  gameState.active = false;
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
  clearTimeout(gameState.coffeeTimeout);
  elBtnCoffee.classList.remove('used');

  if (gameState.mode === 'arcade') {
    gameState.timeLeft = 90;
  }

  elBulletinModal.classList.add('hidden');
  elMainMenuModal.classList.add('hidden');
  elGameOverModal.classList.add('hidden');

  updateHUD();
  generateNewCase();

  clearInterval(gameState.shiftInterval);
  gameState.shiftInterval = setInterval(() => {
    if (!gameState.active || gameState.isTimeFrozen || isDeskPopupOpen()) return;
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
      showToast(true, "🏆 NEW ARCADE HIGH SCORE RECORDED!");
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
        elBtnEndAction.textContent = "CAMPAIGN COMPLETED! 🏆";
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
  showToast(true, "☕ COFFEE BREAK! Shift timer frozen for 5 seconds!");
  updateHUD();

  gameState.coffeeTimeout = setTimeout(() => {
    gameState.isTimeFrozen = false;
    updateHUD();
  }, 5000);
});

elBtnVocalize.addEventListener('click', () => {
  if (!gameState.active || !gameState.currentCase) return;
  const soundType = gameState.currentCase.blueprint.vocalSound || 'squeak';
  sound.playVocal(soundType);

  if (soundType === 'donkey') {
    elPassSpeech.textContent = `"HEE-HAW! ...Er, I mean, that's just a dialect from the savannah!"`;
  } else if (soundType === 'capybara') {
    elPassSpeech.textContent = `"*High Pitch Chirp!* ...He has a little throat tickle!"`;
  } else if (soundType === 'cheetah') {
    elPassSpeech.textContent = `"*LOW MENACING ROAR!* ...He's just purring passionately!"`;
  } else {
    elPassSpeech.textContent = `"*Squeak!* Perfectly calm domestic behavior."`;
  }
});

function toggleTool() {
  if (gameState.activeTool === 'sponge') {
    gameState.activeTool = 'uv';
    elBtnToolUV.classList.add('active');
    elBtnToolSponge.classList.remove('active');
  } else {
    gameState.activeTool = 'sponge';
    elBtnToolSponge.classList.add('active');
    elBtnToolUV.classList.remove('active');
  }
}

elBtnToolSponge.addEventListener('click', () => {
  gameState.activeTool = 'sponge';
  elBtnToolSponge.classList.add('active');
  elBtnToolUV.classList.remove('active');
});

elBtnToolUV.addEventListener('click', () => {
  gameState.activeTool = 'uv';
  elBtnToolUV.classList.add('active');
  elBtnToolSponge.classList.remove('active');
});

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
      <div class="dex-icon">${isDiscovered ? item.emoji : '❓'}</div>
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

// Menu Actions
elBtnMenuStory.addEventListener('click', () => {
  const currentShift = StorageManager.getStoryShift();
  prepareStoryShift(currentShift - 1);
});

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
  elBtnSound.textContent = sound.muted ? "🔇 OFF" : "🔊 ON";
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
