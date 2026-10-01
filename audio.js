/* ==========================================================================
   PAWS FOR INSPECTION - AUDIO: recorded samples, layered music, airport ambience
   Everything plays through the buses on `sound` (game.js): music, sfx, ambience.
   Recorded files are listed in audio/manifest.json (see docs/AUDIO_WORK_ORDER.md);
   anything without a file falls back to the sounds synthesised in code.
   ========================================================================== */

// --- SAMPLE LIBRARY ---
const AudioLibrary = {
  manifest: { sfx: {}, music: {}, ambience: {} },
  buffers: {},
  loading: null,

  // Load the manifest and decode every listed file. Called once audio is unlocked.
  load(ctx) {
    if (this.loading) return this.loading;
    this.loading = fetch('audio/manifest.json')
      .then(r => (r.ok ? r.json() : null))
      .catch(() => null)
      .then(async manifest => {
        if (!manifest) return;
        this.manifest = { sfx: {}, music: {}, ambience: {}, ...manifest };
        const files = new Set();
        Object.values(this.manifest).forEach(group =>
          Object.values(group).forEach(list => [].concat(list).forEach(f => files.add(f))));
        await Promise.all([...files].map(async file => {
          try {
            const res = await fetch(`audio/${file}`);
            if (!res.ok) return;
            this.buffers[file] = await ctx.decodeAudioData(await res.arrayBuffer());
          } catch (e) {
            // A missing or unreadable file just keeps the synthesised version.
          }
        }));
      });
    return this.loading;
  },

  // A decoded buffer for a named sound; picks a random variant when several are listed.
  get(group, name) {
    const list = [].concat(this.manifest[group][name] || []).filter(f => this.buffers[f]);
    return list.length ? this.buffers[list[Math.floor(Math.random() * list.length)]] : null;
  }
};

// --- MUSIC ---
// Three layers that play in sync: a calm base, percussion when the clock runs low, and a
// tension layer on the second strike. Uses recorded stems when present, otherwise a
// light synthesised benga-style loop.
const Music = (() => {
  let scene = 'off';
  let wanted = 'off';
  let layers = null;
  let intensity = { urgent: false, tension: false };
  let scheduler = null;
  let nextTime = 0;
  let step = 0;
  let recorded = [];

  const PENTA = [62, 64, 66, 69, 71, 74, 76, 78, 81]; // D major pentatonic (MIDI)
  const CHORDS = [[62, 66, 69], [67, 71, 74], [69, 73, 76], [62, 66, 69]]; // D G A D
  const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function ensureLayers() {
    const ctx = sound.ctx;
    if (layers || !ctx || !sound.musicBus) return layers;
    layers = {};
    ['base', 'percussion', 'tension'].forEach(name => {
      const g = ctx.createGain();
      g.gain.value = name === 'base' ? 1 : 0;
      g.connect(sound.musicBus);
      layers[name] = g;
    });
    return layers;
  }

  function pluck(time, midi, gainNode, level = 0.12, length = 0.35) {
    const ctx = sound.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq(midi), time);
    g.gain.setValueAtTime(level, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + length);
    osc.connect(g);
    g.connect(gainNode);
    osc.start(time);
    osc.stop(time + length + 0.02);
  }

  function shaker(time, gainNode, accent) {
    const ctx = sound.ctx;
    const len = Math.floor(ctx.sampleRate * 0.05);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 6000;
    const g = ctx.createGain();
    g.gain.value = accent ? 0.09 : 0.04;
    src.connect(hp);
    hp.connect(g);
    g.connect(gainNode);
    src.start(time);
  }

  function kick(time, gainNode) {
    const ctx = sound.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);
    g.gain.setValueAtTime(0.35, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    osc.connect(g);
    g.connect(gainNode);
    osc.start(time);
    osc.stop(time + 0.22);
  }

  function drone(time, gainNode, midi, length) {
    const ctx = sound.ctx;
    [0, 7].forEach(detune => {
      const osc = ctx.createOscillator();
      const lp = ctx.createBiquadFilter();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq(midi - 24), time);
      osc.detune.value = detune;
      lp.type = 'lowpass';
      lp.frequency.value = 320;
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(0.05, time + length * 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, time + length);
      osc.connect(lp);
      lp.connect(g);
      g.connect(gainNode);
      osc.start(time);
      osc.stop(time + length + 0.05);
    });
  }

  // One eighth note of the synthesised loop.
  function scheduleStep(time, eighth) {
    const bar = Math.floor(step / 8) % CHORDS.length;
    const pos = step % 8;
    const chord = CHORDS[bar];
    // Base: syncopated guitar plucks and a walking bass, benga style.
    const pattern = [0, 2, 1, 2, 0, 2, 1, 2];
    pluck(time, chord[pattern[pos]] + 12, layers.base, pos % 2 ? 0.06 : 0.1, 0.3);
    if (pos === 0 || pos === 3 || pos === 4 || pos === 6) pluck(time, chord[0] - 12, layers.base, 0.14, 0.4);
    if (pos === 7 && Math.random() < 0.5) pluck(time, PENTA[Math.floor(Math.random() * PENTA.length)] + 12, layers.base, 0.05, 0.25);
    // Percussion layer: shaker every eighth, kick on 1 and 3.
    shaker(time, layers.percussion, pos % 2 === 0);
    if (pos === 0 || pos === 4) kick(time, layers.percussion);
    // Tension layer: a low drone once a bar.
    if (pos === 0) drone(time, layers.tension, chord[0], eighth * 8);
    step++;
  }

  function startSynth() {
    const ctx = sound.ctx;
    const bpm = scene === 'menu' ? 92 : 108;
    const eighth = 60 / bpm / 2;
    nextTime = ctx.currentTime + 0.1;
    step = 0;
    scheduler = setInterval(() => {
      while (nextTime < ctx.currentTime + 0.15) {
        scheduleStep(nextTime, eighth);
        nextTime += eighth;
      }
    }, 25);
  }

  function startRecorded(names) {
    const ctx = sound.ctx;
    const at = ctx.currentTime + 0.05;
    recorded = names.map(([layer, buffer]) => {
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.connect(layers[layer]);
      src.start(at);
      return src;
    });
  }

  function stopAll() {
    clearInterval(scheduler);
    scheduler = null;
    recorded.forEach(src => { try { src.stop(); } catch (e) { /* already stopped */ } });
    recorded = [];
  }

  function applyIntensity(rampSeconds = 1.2) {
    if (!layers) return;
    const t = sound.ctx.currentTime;
    const set = (layer, on) => {
      layers[layer].gain.cancelScheduledValues(t);
      layers[layer].gain.setTargetAtTime(on ? 1 : 0, t, rampSeconds / 3);
    };
    set('percussion', scene === 'desk' && intensity.urgent);
    set('tension', scene === 'desk' && intensity.tension);
  }

  function play(name) {
    stopAll();
    scene = name;
    if (name === 'off' || !ensureLayers()) return;
    // Recorded stems: menu (single loop) or desk-base / desk-percussion / desk-tension.
    const stems = name === 'menu'
      ? [['base', AudioLibrary.get('music', 'menu')]]
      : [['base', AudioLibrary.get('music', 'desk-base')], ['percussion', AudioLibrary.get('music', 'desk-percussion')], ['tension', AudioLibrary.get('music', 'desk-tension')]];
    if (stems[0][1]) startRecorded(stems.filter(s => s[1]));
    else startSynth();
    applyIntensity(0.1);
  }

  return {
    // Remember the scene; it starts as soon as audio is unlocked by the first tap.
    setScene(name) {
      wanted = name;
      if (sound.ctx && sound.ctx.state === 'running' && name !== scene) play(name);
    },
    setIntensity(next) {
      if (next.urgent === intensity.urgent && next.tension === intensity.tension) return;
      intensity = { ...next };
      applyIntensity();
    },
    resume() {
      if (wanted !== scene) play(wanted);
    },
    restart() {
      const current = wanted;
      scene = 'off';
      play(current);
    }
  };
})();

// --- AIRPORT AMBIENCE ---
// A low terminal hum with the occasional PA chime (or recorded announcements when present).
const Ambience = (() => {
  let running = false;
  let wanted = false;
  let source = null;
  let paTimer = null;

  function brownNoise(ctx, seconds) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      d[i] = last * 3.5;
    }
    return buf;
  }

  function chime() {
    const ctx = sound.ctx;
    const t = ctx.currentTime;
    [[659, 0], [523, 0.45]].forEach(([f, delay]) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + delay);
      g.gain.exponentialRampToValueAtTime(0.12, t + delay + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 1.1);
      osc.connect(g);
      g.connect(sound.ambienceBus);
      osc.start(t + delay);
      osc.stop(t + delay + 1.2);
    });
  }

  function announcement() {
    const buf = AudioLibrary.get('ambience', 'pa');
    if (!buf) { chime(); return; }
    const src = sound.ctx.createBufferSource();
    src.buffer = buf;
    src.connect(sound.ambienceBus);
    src.start();
  }

  function schedulePA() {
    paTimer = setTimeout(() => {
      if (running) announcement();
      schedulePA();
    }, 25000 + Math.random() * 25000);
  }

  function start() {
    const ctx = sound.ctx;
    if (running || !ctx || !sound.ambienceBus) return;
    running = true;
    source = ctx.createBufferSource();
    source.buffer = AudioLibrary.get('ambience', 'airport-loop') || brownNoise(ctx, 4);
    source.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = AudioLibrary.get('ambience', 'airport-loop') ? 20000 : 500;
    const g = ctx.createGain();
    g.gain.value = 0.25;
    source.connect(lp);
    lp.connect(g);
    g.connect(sound.ambienceBus);
    source.start();
    schedulePA();
  }

  function stop() {
    running = false;
    clearTimeout(paTimer);
    if (source) { try { source.stop(); } catch (e) { /* already stopped */ } }
    source = null;
  }

  return {
    set(on) {
      wanted = on;
      if (!sound.ctx || sound.ctx.state !== 'running') return;
      if (on) start(); else stop();
    },
    resume() { if (wanted && !running) start(); }
  };
})();
