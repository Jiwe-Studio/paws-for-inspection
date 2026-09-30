/* ==========================================================================
   PAWS FOR INSPECTION - STORY: scenes, team activities, perks, finale
   Loaded after tutorial.js (Dialogue, CREW) and before game.js; it only touches
   game globals at runtime.
   ========================================================================== */

// --- STORY PROGRESS (seen scenes, earned perks) ---
const StoryProgress = {
  _get(key) {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { return []; }
  },
  _add(key, value) {
    const list = this._get(key);
    if (!list.includes(value)) {
      list.push(value);
      localStorage.setItem(key, JSON.stringify(list));
    }
  },
  seen(id) { return this._get('petdetect_story_seen').includes(id); },
  markSeen(id) { this._add('petdetect_story_seen', id); },
  hasPerk(id) { return this._get('petdetect_perks').includes(id); },
  addPerk(id) { this._add('petdetect_perks', id); },
  reset() {
    localStorage.removeItem('petdetect_story_seen');
    localStorage.removeItem('petdetect_perks');
  }
};

// Scene backgrounds from Claude Design Round 2 (Batches 9–10). Until a file lands,
// the airport terminal stands in.
function sceneBackdrop(id) {
  return id && ART_FILES.has(id) ? `art/${id}.svg` : 'art/scene/airport-bg.svg';
}

// --- SCENES ---
// Each shift can have a scene before its bulletin and after a successful shift.
// `activity` runs after the `after` scene and unlocks a perk.
const STORY_SCENES = {
  1: {
    before: { bg: 'scene/chief-office-bg', steps: [
      { who: "kiprop", mood: "neutral", text: "So you're Mama Rehema's rookie. I'm Chief Kiprop. This desk has never waved through a smuggler on my watch." },
      { who: "kiprop", text: "Four clean cases today. Names and dates. Don't embarrass my desk." },
      { who: "tony", mood: "happy", text: "Tony Wafula. Started Monday, already processed forty cases. Try to keep up, rookie." },
      { who: "rehema", text: "He processed forty and approved a painted goat. Ignore him. Read the permit, not Tony." }
    ] },
    after: { bg: 'scene/staffroom-bg', steps: [
      { who: "tony", mood: "worried", text: "Four clean? Eh. Beginner's luck." },
      { who: "rehema", mood: "happy", text: "Four clean calls on your first day. Chai is on me tomorrow." }
    ] }
  },
  2: {
    before: { bg: 'scene/chief-office-bg', steps: [
      { who: "kiprop", text: "Carriers are coming through heavy. Someone is packing contraband in with the pets. Watch the scale." }
    ] },
    after: { bg: 'activity/k9-yard-bg', steps: [
      { who: "wiji", mood: "happy", text: "Rookie! Chief says team training this afternoon. Come and meet the best nose in the building." },
      { who: "biscuit", mood: "happy", text: "Woof!" },
      { who: "wiji", text: "Biscuit sniffs, the animal inside calls out, and you name it. Ready?" }
    ] },
    activity: 'k9'
  },
  3: {
    before: { bg: 'scene/chief-office-bg', steps: [
      { who: "kiprop", mood: "worried", text: "The painted animals are a distraction. Intelligence says someone big is moving real wildlife behind them." },
      { who: "rehema", text: "Then we scrub every crate. Every single one." }
    ] },
    after: { bg: 'scene/cctv-bg', steps: [
      { who: "kiboko", mood: "smug", text: "Ah, the new inspector. Scrubbing crates like a car-wash attendant. Cute." },
      { who: "kiboko", mood: "smug", text: "They call me Big Man Kiboko. Enjoy your little desk while you still have it." },
      { who: "kiprop", mood: "worried", text: "He hacked our CCTV. Kiboko runs the biggest wildlife-trafficking ring in the region, and now he knows your face." }
    ] }
  },
  4: {
    after: { bg: 'scene/staffroom-bg', steps: [
      { who: "tony", mood: "worried", text: "Rookie... I approved a permit with a fake seal last week. Chief doesn't know. Can you show me the UV trick?" },
      { who: "rehema", mood: "happy", text: "Look at that. Tony Wafula asking for help. Now I can retire happy." }
    ] }
  },
  5: {
    before: { bg: 'scene/chief-office-bg', steps: [
      { who: "kiprop", text: "VIP arrivals today. Honourables, CEOs, socialites. Titles don't get stamps. Permits do." }
    ] },
    after: { bg: 'activity/warehouse-bg', steps: [
      { who: "kiprop", mood: "happy", text: "Good work today. A tip-off says Kiboko's crew is hiding crates in the cargo warehouse." },
      { who: "kiprop", text: "We raid it tonight, as a team. Scrub every crate you can before his lorry comes back." },
      { who: "tony", mood: "happy", text: "I'll hold the torch. You scrub." }
    ] },
    activity: 'raid'
  },
  6: {
    before: { bg: 'scene/staffroom-bg', steps: [
      { who: "rehema", text: "Three flights at once and a queue to the car park. Also... next week is my last week, rookie." },
      { who: "tony", mood: "worried", text: "Wait, what? Who's going to shout at me?" }
    ] },
    after: { bg: 'scene/staffroom-bg', steps: [
      { who: "rehema", mood: "happy", text: "Steady hands in a rush. You're ready for more than you think." }
    ] }
  },
  7: {
    after: { bg: 'scene/cctv-bg', steps: [
      { who: "kiboko", mood: "angry", text: "Three shipments! You've cost me three shipments, inspector!" },
      { who: "kiboko", mood: "angry", text: "Fine. My painters are better now. Let's see you catch what you can't see." },
      { who: "wiji", text: "He's bluffing. Scrub deeper. The crate always tells the truth." }
    ] }
  },
  8: {
    before: { bg: 'scene/chief-office-bg', steps: [
      { who: "kiprop", text: "Kiboko's crew is lining crates with lead to fool the scale. Read every number to the decimal." }
    ] },
    after: { bg: 'activity/quiz-bg', steps: [
      { who: "rehema", mood: "happy", text: "That was my last shift at this desk. Thirty years. Asante sana, all of you." },
      { who: "tony", mood: "happy", text: "Quiz night in the staff room for Mama Rehema! Rookie versus me. Loser buys the chai." }
    ] },
    activity: 'quiz'
  },
  9: {
    before: { bg: 'scene/chief-office-bg', steps: [
      { who: "kiprop", mood: "worried", text: "Kiboko is flooding the queue with decoys to wear you down. Stay methodical." }
    ] },
    after: { bg: 'scene/chief-office-bg', steps: [
      { who: "kiprop", text: "Intelligence confirms it. Big Man Kiboko is flying in tomorrow. Personally." },
      { who: "tony", text: "We've got your back, rookie. Biscuit too." },
      { who: "biscuit", mood: "alert", text: "Grrr... woof!" }
    ] }
  },
  10: {
    before: { bg: 'scene/chief-office-bg', steps: [
      { who: "kiprop", text: "Your final assessment for Chief Inspector. And somewhere in today's queue is Big Man Kiboko." },
      { who: "rehema", mood: "happy", text: "I came back to watch. Names, dates, weight, crate, seal. You know this." }
    ] },
    after: { bg: 'scene/staffroom-bg', steps: [
      { who: "kiboko", mood: "busted", text: "This is outrageous! Do you know who I am?" },
      { who: "kiprop", mood: "happy", text: "We do. So does the Kenya Wildlife Service, who are taking every animal from your crates home." },
      { who: "tony", mood: "happy", text: "Rookie of the year! Okay, fine. Inspector of the year." },
      { who: "rehema", mood: "happy", text: "Thirty years I waited to see that man in handcuffs. Welcome to the team, Chief Inspector." },
      { who: "biscuit", mood: "happy", text: "Woof!" }
    ] }
  }
};

// --- PERKS ---
const PERKS = {
  biscuit: { title: "Biscuit joins your desk", text: "Once per shift, Biscuit sniffs a covered crate and tells you if something's wrong inside." },
  big_sponge: { title: "Wiji's industrial sponge", text: "Your sponge scrubs a much wider path from now on." },
  double_chai: { title: "Tony's chai flask", text: "You can take two chai breaks per shift instead of one." }
};

// --- TEAM ACTIVITIES ---
const shuffle = (arr) => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(p => p[1]);

const Activity = (() => {
  const modal = () => document.getElementById('activityModal');
  const body = () => document.getElementById('activityBody');
  const progress = () => document.getElementById('activityProgress');

  function open(kicker, title) {
    document.getElementById('activityKicker').textContent = kicker;
    document.getElementById('activityTitle').textContent = title;
    progress().textContent = "";
    body().replaceChildren();
    modal().classList.remove('hidden');
  }

  function close() {
    modal().classList.add('hidden');
    body().replaceChildren();
  }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Results card shared by all activities; resolves when the player continues.
  function results(line, perkId) {
    return new Promise(resolve => {
      progress().textContent = "";
      const wrap = el('div', 'activity-results');
      wrap.appendChild(el('div', 'activity-result-line', line));
      if (perkId) {
        StoryProgress.addPerk(perkId);
        const perk = el('div', 'activity-perk');
        perk.appendChild(el('div', 'activity-perk-title', `Unlocked: ${PERKS[perkId].title}`));
        perk.appendChild(el('div', 'activity-perk-text', PERKS[perkId].text));
        wrap.appendChild(perk);
      }
      const btn = el('button', 'big-btn big-btn-ochre', 'Continue');
      btn.addEventListener('click', () => { close(); resolve(); });
      wrap.appendChild(btn);
      body().replaceChildren(wrap);
    });
  }

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  // K9 training: Biscuit sniffs, the animal calls out, the player names it.
  const K9_ANIMALS = [
    { sound: 'donkey', art: 'donkey_zebra', name: "Donkey" },
    { sound: 'capybara', art: 'capybara_dog', name: "Capybara" },
    { sound: 'cheetah', art: 'cheetah_cat', name: "Cheetah cub" },
    { sound: 'bark', art: 'border_collie', name: "Dog" },
    { sound: 'meow', art: 'persian_cat', name: "Cat" }
  ];

  async function k9() {
    open("TEAM ACTIVITY · AFTER SHIFT 2", "K9 training with Biscuit");
    const rounds = shuffle(K9_ANIMALS);
    let score = 0;

    for (let i = 0; i < rounds.length; i++) {
      const answer = rounds[i];
      progress().textContent = `${i + 1} / ${rounds.length}`;
      const stage = el('div', 'k9-stage');
      const dog = el('div', 'k9-biscuit');
      setArt(dog, 'crew/biscuit_sniffing', '🐕');
      const crate = el('div', 'k9-crate');
      stage.append(dog, crate);
      const prompt = el('div', 'activity-prompt', "Biscuit is sniffing crate " + (i + 1) + ". Listen: what's inside?");
      const replay = el('button', 'gadget-btn', 'Play the sound again');
      replay.addEventListener('click', () => { sound.init(); sound.playVocal(answer.sound); });
      const options = el('div', 'activity-options');
      const choices = shuffle([answer, ...shuffle(K9_ANIMALS.filter(a => a !== answer)).slice(0, 2)]);
      body().replaceChildren(stage, prompt, replay, options);
      sound.init();
      await wait(500);
      sound.playVocal(answer.sound);

      const picked = await new Promise(resolve => {
        choices.forEach(choice => {
          const btn = el('button', 'activity-option');
          const badge = el('span', 'activity-option-art');
          setArt(badge, `animals/${choice.art}_dex`, '?');
          btn.append(badge, el('span', 'activity-option-name', choice.name));
          btn.addEventListener('click', () => resolve(choice));
          options.appendChild(btn);
        });
      });

      const correct = picked === answer;
      if (correct) score++;
      setArt(dog, correct ? 'crew/biscuit_happy' : 'crew/biscuit_neutral', '🐕');
      crate.classList.add('open');
      setArt(crate, `animals/${answer.art}_dex`, '?');
      prompt.textContent = correct ? `Woof! It was a ${answer.name.toLowerCase()}.` : `Not quite. It was a ${answer.name.toLowerCase()}.`;
      options.querySelectorAll('button').forEach(b => { b.disabled = true; });
      if (correct) sound.playSuccess(); else sound.playStrike();
      await wait(1300);
    }

    const line = score >= 4 ? `${score} / 5. Biscuit thinks you're a natural.`
      : score >= 2 ? `${score} / 5. Biscuit is patient. You'll get there.`
      : `${score} / 5. Biscuit has decided to help you anyway.`;
    await results(line, 'biscuit');
  }

  // Warehouse raid: scrub six crates before the lorry returns; three hide trafficked animals.
  async function raid() {
    open("TEAM ACTIVITY · AFTER SHIFT 5", "Warehouse raid");
    const trafficked = shuffle(PET_DEX_MASTER.filter(d => d.kind === 'trafficked')).slice(0, 3);
    const contents = shuffle([...trafficked, null, null, null]);
    let found = 0;
    let timeLeft = 30;

    const prompt = el('div', 'activity-prompt', "Scrub the crates. Three of them hide trafficked animals.");
    const grid = el('div', 'raid-grid');
    body().replaceChildren(prompt, grid);

    const coverImg = new Image();
    coverImg.src = 'art/scene/crate-cover.svg';
    await new Promise(r => { if (coverImg.complete) r(); else { coverImg.onload = r; coverImg.onerror = r; } });

    let finish;
    const done = new Promise(r => { finish = r; });

    contents.forEach(entry => {
      const cell = el('div', 'raid-crate');
      const inside = el('div', 'raid-inside');
      if (entry) setArt(inside, `animals/${entry.art}_dex`, entry.emoji);
      else inside.appendChild(el('span', 'raid-empty', 'Empty'));
      const canvas = document.createElement('canvas');
      canvas.width = 280;
      canvas.height = 140;
      canvas.className = 'raid-cover';
      const ctx = canvas.getContext('2d');
      if (coverImg.naturalWidth) ctx.drawImage(coverImg, 0, 0, 280, 140);
      else { ctx.fillStyle = '#6d5a3a'; ctx.fillRect(0, 0, 280, 140); }
      cell.append(inside, canvas);
      grid.appendChild(cell);

      let last = null;
      let opened = false;
      const scrub = (e) => {
        if (opened) return;
        const r = canvas.getBoundingClientRect();
        const x = (e.clientX - r.left) * (280 / r.width);
        const y = (e.clientY - r.top) * (140 / r.height);
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 70;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo((last || { x }).x, (last || { y }).y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
        last = { x, y };
        sound.playSponge();
        const data = ctx.getImageData(0, 0, 280, 140).data;
        let cleared = 0, total = 0;
        for (let yy = 10; yy < 140; yy += 20) {
          for (let xx = 10; xx < 280; xx += 20) {
            total++;
            if (data[(yy * 280 + xx) * 4 + 3] < 60) cleared++;
          }
        }
        if (cleared / total > 0.45) {
          opened = true;
          canvas.style.opacity = '0';
          if (entry) {
            found++;
            cell.classList.add('rescued');
            sound.playSuccess();
            if (found === trafficked.length) finish();
          }
        }
      };
      canvas.addEventListener('pointerdown', (e) => { sound.init(); canvas.setPointerCapture(e.pointerId); last = null; scrub(e); e.preventDefault(); });
      canvas.addEventListener('pointermove', (e) => { if (e.buttons || e.pointerType === 'touch') scrub(e); });
      canvas.addEventListener('pointerup', () => { last = null; });
    });

    progress().textContent = `0:${String(timeLeft).padStart(2, '0')}`;
    const timer = setInterval(() => {
      timeLeft--;
      progress().textContent = `0:${String(Math.max(0, timeLeft)).padStart(2, '0')}`;
      if (timeLeft <= 0) finish();
    }, 1000);
    await done;
    clearInterval(timer);
    await wait(700);

    const line = found === 3 ? "All three animals rescued before the lorry came back. The Kenya Wildlife Service is on its way."
      : `${found} of 3 animals rescued. Tony swears he saw the lorry's number plate.`;
    await results(line, 'big_sponge');
  }

  // Quiz night: rapid-fire rule questions against Tony, who buzzes after a few seconds.
  const QUIZ = [
    { q: "The permit expired yesterday.", a: false },
    { q: "The permit says 'Brian Kamua'. The passenger is Brian Kamau.", a: false },
    { q: "The scale reads 4.8 kg. The permit allows 5.0 kg. Everything else matches.", a: true },
    { q: "The scale reads 20.3 kg. The permit allows 20.0 kg.", a: false },
    { q: "Everything matches and the seal glows green under UV.", a: true },
    { q: "The seal stays dark under UV.", a: false },
    { q: "The seal reads 'JIWF' instead of 'JIWE'.", a: false },
    { q: "An Honourable says 'Do you know who I am?' His permit expired last month.", a: false },
    { q: "Under a knitted hedgehog hat, the 'hedgehog' is a pangolin.", a: false },
    { q: "Names match, the date is next year, the weight is fine, and the crate shows the declared Galla goat.", a: true }
  ];

  async function quiz() {
    open("TEAM ACTIVITY · AFTER SHIFT 8", "Quiz night: you vs Tony");
    const questions = shuffle(QUIZ).slice(0, 6);
    let you = 0;
    let tony = 0;

    const board = el('div', 'quiz-board');
    const youEl = el('div', 'quiz-score', 'You 0');
    const tonyEl = el('div', 'quiz-score tony', 'Tony 0');
    board.append(youEl, tonyEl);
    const question = el('div', 'quiz-question');
    const status = el('div', 'activity-prompt');
    const buttons = el('div', 'quiz-buttons');
    const deny = el('button', 'stamp-btn deny', 'DENY');
    const approve = el('button', 'stamp-btn approve', 'APPROVE');
    buttons.append(deny, approve);
    body().replaceChildren(board, question, status, buttons);

    for (let i = 0; i < questions.length; i++) {
      const item = questions[i];
      progress().textContent = `${i + 1} / ${questions.length}`;
      question.textContent = item.q;
      status.textContent = "Approve or deny? Beat Tony to the buzzer.";
      deny.disabled = approve.disabled = false;

      const outcome = await new Promise(resolve => {
        const tonyTimer = setTimeout(() => resolve({ by: 'tony', right: Math.random() < 0.7 }), 2500 + Math.random() * 2000);
        const answer = (value) => { clearTimeout(tonyTimer); resolve({ by: 'you', right: value === item.a }); };
        deny.onclick = () => answer(false);
        approve.onclick = () => answer(true);
      });
      deny.disabled = approve.disabled = true;

      const verdict = item.a ? "APPROVE" : "DENY";
      if (outcome.by === 'you') {
        if (outcome.right) { you++; status.textContent = `Correct! It's a ${verdict}.`; sound.playSuccess(); }
        else { tony++; status.textContent = `Wrong, it's a ${verdict}. Point to Tony.`; sound.playStrike(); }
      } else if (outcome.right) {
        tony++; status.textContent = `Tony buzzed first: ${verdict}. Point to Tony.`; sound.playWarning();
      } else {
        you++; status.textContent = `Tony buzzed and got it wrong! It's a ${verdict}. Your point.`; sound.playSuccess();
      }
      youEl.textContent = `You ${you}`;
      tonyEl.textContent = `Tony ${tony}`;
      await wait(1600);
    }

    const line = you > tony ? `You win ${you}–${tony}. Tony is buying the chai.`
      : you === tony ? `A ${you}–${tony} draw. Mama Rehema buys the chai for everyone.`
      : `Tony wins ${tony}–${you}, and he will never let you forget it.`;
    await results(line, 'double_chai');
  }

  return { k9, raid, quiz, close };
})();

// --- FINALE: Big Man Kiboko comes to your counter ---
const KIBOKO_PASSENGER = {
  name: "Big Man Kiboko",
  avatar: "🦛",
  art: "crew/big_man_kiboko",
  moodMap: { neutral: "smug", nervous: "angry", relieved: "smug", busted: "busted" }
};

// --- STORY API used by game.js ---
const Story = {
  // Scene before the shift's bulletin (once per shift).
  async before(shiftNumber) {
    const scene = STORY_SCENES[shiftNumber] && STORY_SCENES[shiftNumber].before;
    const id = `before-${shiftNumber}`;
    if (!scene || StoryProgress.seen(id)) return;
    const ok = await Dialogue.run(scene.steps, { backdrop: sceneBackdrop(scene.bg) });
    if (ok) StoryProgress.markSeen(id);
  },

  // Scene and team activity after a successful shift (once per shift).
  async after(shiftNumber) {
    const scene = STORY_SCENES[shiftNumber];
    if (!scene) return;
    const id = `after-${shiftNumber}`;
    if (scene.after && !StoryProgress.seen(id)) {
      const ok = await Dialogue.run(scene.after.steps, { backdrop: sceneBackdrop(scene.after.bg) });
      if (!ok) return;
      StoryProgress.markSeen(id);
    }
    const activityId = `activity-${shiftNumber}`;
    if (scene.activity && !StoryProgress.seen(activityId)) {
      await Activity[scene.activity]();
      StoryProgress.markSeen(activityId);
    }
  },

  // In the final shift, the last case is always Kiboko's own, until he's caught.
  kibokoOverrides() {
    const conf = STORY_SHIFTS[gameState.storyShiftIndex];
    if (gameState.mode !== 'story' || !conf || conf.shiftNumber !== 10) return null;
    if (gameState.kibokoCaught || gameState.quotaMetCount < gameState.targetQuota - 1) return null;
    return {
      violations: ["disguise", "seal"],
      disguiseId: "pangolin_hedgehog",
      passenger: KIBOKO_PASSENGER,
      speech: "I am a VIP. My hedgehog does not queue.",
      isKiboko: true
    };
  },

  // Short scene when Kiboko reaches the counter. The clock waits until the stamp.
  kibokoArrives() {
    gameState.introPause = true;
    const first = !gameState.kibokoSeen;
    gameState.kibokoSeen = true;
    return Dialogue.run(first ? [
      { who: "rehema", mood: "worried", text: "That's him. Big Man Kiboko. Check everything, rookie." },
      { who: "kiboko", mood: "smug", text: "Stamp it quickly, inspector. I have a jet waiting." }
    ] : [
      { who: "biscuit", mood: "alert", text: "Grrr... WOOF!" },
      { who: "tony", mood: "worried", text: "Biscuit blocked the gate! He's back at your counter. Look again!" }
    ]);
  },

  hasPerk: (id) => StoryProgress.hasPerk(id),
  reset: () => StoryProgress.reset()
};
