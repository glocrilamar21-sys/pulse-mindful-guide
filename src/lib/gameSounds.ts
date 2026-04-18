/**
 * Subtle synthesized sound effects for memory games.
 * Uses Web Audio API — no network, no assets, no latency.
 *
 * Sounds are deliberately quiet (gain ≤ 0.08) and short (≤ 350 ms).
 */

export type GameSound = "flip" | "match" | "wrong" | "win" | "tap" | "correct";

const STORAGE_KEY = "memoryGames.soundsEnabled.v1";
const VOLUME_KEY = "memoryGames.volume.v1";
const DEFAULT_VOLUME = 70; // 0-100

let cachedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (cachedCtx) return cachedCtx;
  try {
    const Ctor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    cachedCtx = new Ctor();
    return cachedCtx;
  } catch {
    return null;
  }
}

export function loadGameSoundsEnabled(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === null ? true : v === "1"; // default on
  } catch {
    return true;
  }
}

export function saveGameSoundsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    /* noop */
  }
}

/** Load volume 0-100. Defaults to 70. */
export function loadGameVolume(): number {
  try {
    const v = localStorage.getItem(VOLUME_KEY);
    if (v === null) return DEFAULT_VOLUME;
    const n = Number(v);
    if (!Number.isFinite(n)) return DEFAULT_VOLUME;
    return Math.max(0, Math.min(100, Math.round(n)));
  } catch {
    return DEFAULT_VOLUME;
  }
}

export function saveGameVolume(volume: number): void {
  try {
    const clamped = Math.max(0, Math.min(100, Math.round(volume)));
    localStorage.setItem(VOLUME_KEY, String(clamped));
  } catch {
    /* noop */
  }
}

interface ToneSpec {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  /** Frequency at end of the tone (linear ramp). */
  endFreq?: number;
  /** Delay (in seconds) before this tone starts, relative to play start. */
  delay?: number;
}

function playTone(ctx: AudioContext, spec: ToneSpec, startAt: number, volumeScale: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const peak = Math.max(0.0002, (spec.gain ?? 0.05) * volumeScale);
  const start = startAt + (spec.delay ?? 0);
  const end = start + spec.duration;

  osc.type = spec.type ?? "sine";
  osc.frequency.setValueAtTime(spec.freq, start);
  if (spec.endFreq !== undefined) {
    osc.frequency.linearRampToValueAtTime(spec.endFreq, end);
  }

  // Quick attack, exponential release for soft, non-clicky feel.
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(end + 0.02);
}

const SOUND_MAP: Record<GameSound, ToneSpec[]> = {
  // Soft, short woody tap — for flipping a card or tapping a digit.
  flip: [{ freq: 520, endFreq: 380, duration: 0.08, type: "triangle", gain: 0.04 }],
  tap: [{ freq: 440, endFreq: 360, duration: 0.06, type: "triangle", gain: 0.04 }],

  // Pleasant ascending two-note (perfect 5th) for correct match.
  match: [
    { freq: 660, duration: 0.12, type: "sine", gain: 0.06 },
    { freq: 990, duration: 0.16, type: "sine", gain: 0.06, delay: 0.09 },
  ],
  // Same family as match, slightly brighter for "correct answer" in quiz games.
  correct: [
    { freq: 720, duration: 0.1, type: "sine", gain: 0.06 },
    { freq: 1080, duration: 0.14, type: "sine", gain: 0.05, delay: 0.08 },
  ],

  // Soft descending buzz — never harsh.
  wrong: [
    { freq: 280, endFreq: 180, duration: 0.22, type: "sawtooth", gain: 0.05 },
  ],

  // Triumphant 3-note arpeggio (C-E-G).
  win: [
    { freq: 523, duration: 0.14, type: "sine", gain: 0.06 },
    { freq: 659, duration: 0.14, type: "sine", gain: 0.06, delay: 0.12 },
    { freq: 784, duration: 0.28, type: "sine", gain: 0.07, delay: 0.24 },
  ],
};

export function playGameSound(sound: GameSound): void {
  if (!loadGameSoundsEnabled()) return;
  const volume = loadGameVolume();
  if (volume <= 0) return;
  const ctx = getCtx();
  if (!ctx) return;

  // Browsers suspend the AudioContext until a user gesture; resume on demand.
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {
      /* ignore */
    });
  }

  const volumeScale = volume / 100;
  const tones = SOUND_MAP[sound];
  const startAt = ctx.currentTime;
  for (const t of tones) playTone(ctx, t, startAt, volumeScale);
}
