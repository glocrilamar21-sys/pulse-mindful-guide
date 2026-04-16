// ── Sound & Vibration Presets ──

const CRITICAL_PRESET_KEY = "pulso-critical-preset";
const FLEXIBLE_PRESET_KEY = "pulso-flexible-preset";

export interface SoundPreset {
  id: string;
  emoji: string;
  nameKey: string;
  play: (ctx: AudioContext) => void;
  vibratePattern: number | number[];
}

// ── Critical Presets (loud, intense) ──

function playAlarmSiren(ctx: AudioContext) {
  const times = [0, 0.3, 0.6, 0.9, 1.2];
  times.forEach((start, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = i % 2 === 0 ? 880 : 1100;
    gain.gain.value = 1.0;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + 0.25);
  });
}

function playEmergencyPulse(ctx: AudioContext) {
  const times = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4];
  times.forEach((start) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 900;
    gain.gain.value = 1.0;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + 0.15);
  });
}

function playThunderClap(ctx: AudioContext) {
  // Low rumble + high hit
  const noise = ctx.createOscillator();
  const noiseGain = ctx.createGain();
  noise.type = "sawtooth";
  noise.frequency.value = 80;
  noiseGain.gain.setValueAtTime(1.0, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 1.5);

  // Sharp crack
  const crack = ctx.createOscillator();
  const crackGain = ctx.createGain();
  crack.type = "square";
  crack.frequency.value = 1200;
  crackGain.gain.setValueAtTime(1.0, ctx.currentTime);
  crackGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  crack.connect(crackGain);
  crackGain.connect(ctx.destination);
  crack.start(ctx.currentTime);
  crack.stop(ctx.currentTime + 0.3);
}

function playClassicBeep(ctx: AudioContext) {
  const times = [0, 0.35, 0.7, 1.05, 1.4];
  times.forEach((start) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 900;
    gain.gain.value = 1.0;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + 0.3);
  });
}

export const criticalPresets: SoundPreset[] = [
  {
    id: "classic",
    emoji: "🔊",
    nameKey: "presetClassic",
    play: playClassicBeep,
    vibratePattern: [300, 100, 300, 100, 300, 100, 300],
  },
  {
    id: "siren",
    emoji: "🚨",
    nameKey: "presetSiren",
    play: playAlarmSiren,
    vibratePattern: [200, 50, 200, 50, 200, 50, 200, 50, 200],
  },
  {
    id: "emergency",
    emoji: "🆘",
    nameKey: "presetEmergency",
    play: playEmergencyPulse,
    vibratePattern: [100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100],
  },
  {
    id: "thunder",
    emoji: "⛈️",
    nameKey: "presetThunder",
    play: playThunderClap,
    vibratePattern: [500, 100, 800],
  },
];

// ── Flexible Presets (soft, gentle) ──

function playSoftChime(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 523; // C5
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 1.0);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.value = 659; // E5
  gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.2);
  gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(ctx.currentTime + 0.2);
  osc2.stop(ctx.currentTime + 1.2);
}

function playGentleBell(ctx: AudioContext) {
  const freqs = [440, 554, 659]; // A4, C#5, E5 - A major
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.3 + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.3);
    osc.stop(ctx.currentTime + i * 0.3 + 0.8);
  });
}

function playWhisper(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = 400;
  osc.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.8);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.8);
}

function playClassicFlexible(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = 600;
  gain.gain.value = 0.8;
  gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.5);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
}

export const flexiblePresets: SoundPreset[] = [
  {
    id: "classic",
    emoji: "🔔",
    nameKey: "presetClassicSoft",
    play: playClassicFlexible,
    vibratePattern: 200,
  },
  {
    id: "chime",
    emoji: "🎵",
    nameKey: "presetChime",
    play: playSoftChime,
    vibratePattern: [100, 200, 100],
  },
  {
    id: "bell",
    emoji: "🔔",
    nameKey: "presetBell",
    play: playGentleBell,
    vibratePattern: [80, 150, 80, 150, 80],
  },
  {
    id: "whisper",
    emoji: "🌙",
    nameKey: "presetWhisper",
    play: playWhisper,
    vibratePattern: [50, 100, 50],
  },
];

// ── Persistence ──

export function loadCriticalPreset(): string {
  return localStorage.getItem(CRITICAL_PRESET_KEY) || "classic";
}

export function saveCriticalPreset(id: string): void {
  localStorage.setItem(CRITICAL_PRESET_KEY, id);
}

export function loadFlexiblePreset(): string {
  return localStorage.getItem(FLEXIBLE_PRESET_KEY) || "classic";
}

export function saveFlexiblePreset(id: string): void {
  localStorage.setItem(FLEXIBLE_PRESET_KEY, id);
}

export function getCriticalPreset(): SoundPreset {
  const id = loadCriticalPreset();
  return criticalPresets.find((p) => p.id === id) || criticalPresets[0];
}

export function getFlexiblePreset(): SoundPreset {
  const id = loadFlexiblePreset();
  return flexiblePresets.find((p) => p.id === id) || flexiblePresets[0];
}

// ── Play helpers (used by tasks.ts) ──

export function playCriticalSound(ctx: AudioContext): void {
  getCriticalPreset().play(ctx);
}

export function playFlexibleSound(ctx: AudioContext): void {
  getFlexiblePreset().play(ctx);
}

export function vibrateCriticalPreset(): void {
  if ("vibrate" in navigator) {
    navigator.vibrate(getCriticalPreset().vibratePattern);
  }
}

export function vibrateFlexiblePreset(): void {
  if ("vibrate" in navigator) {
    navigator.vibrate(getFlexiblePreset().vibratePattern);
  }
}
