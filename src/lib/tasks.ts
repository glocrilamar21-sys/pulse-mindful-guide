export type TaskCategory = "critical" | "flexible";
export type TaskScope = "trabajo" | "estudio" | "hogar" | "personal" | "salud";

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  time: string; // HH:MM
  date: string; // YYYY-MM-DD
  done: boolean;
  scope?: TaskScope;
  postponedUntil?: string; // ISO string
}

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const STORAGE_KEY = "pulso-diario-tasks";

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function vibrateCritical(): void {
  if ("vibrate" in navigator) {
    navigator.vibrate([300, 100, 300, 100, 300, 100, 300]);
  }
}

export function vibrateFlexible(): void {
  if ("vibrate" in navigator) {
    navigator.vibrate(200);
  }
}

export function stopVibration(): void {
  if ("vibrate" in navigator) {
    navigator.vibrate(0);
  }
}

// ── Persistent Audio Alert System ──

let alertInterval: ReturnType<typeof setInterval> | null = null;
let activeCtx: AudioContext | null = null;

function playCriticalBeep(ctx: AudioContext) {
  const times = [0, 0.35, 0.7, 1.05, 1.4];
  times.forEach((start) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 900;
    gain.gain.value = 1.0; // Maximum volume
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + 0.3);
  });
}

function playFlexibleBeep(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = 600;
  gain.gain.value = 0.8; // High volume
  gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.5);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
}

/** Start a looping alert sound + vibration that repeats until stopAlert() is called */
export function startAlert(type: "critical" | "flexible"): void {
  stopAlert(); // clear any existing
  activeCtx = new AudioContext();

  const play = () => {
    if (!activeCtx) return;
    if (type === "critical") {
      playCriticalBeep(activeCtx);
      vibrateCritical();
    } else {
      playFlexibleBeep(activeCtx);
      vibrateFlexible();
    }
  };

  play(); // play immediately
  // Loop: critical every 2s, flexible every 3.5s
  const interval = type === "critical" ? 2000 : 3500;
  alertInterval = setInterval(play, interval);
}

/** Stop all alert sounds and vibrations */
export function stopAlert(): void {
  if (alertInterval) {
    clearInterval(alertInterval);
    alertInterval = null;
  }
  if (activeCtx) {
    activeCtx.close().catch(() => {});
    activeCtx = null;
  }
  stopVibration();
}

/** Play a single demo sound (for settings panel) */
export function playDemoSound(type: "critical" | "flexible"): void {
  const ctx = new AudioContext();
  if (type === "critical") {
    playCriticalBeep(ctx);
    vibrateCritical();
  } else {
    playFlexibleBeep(ctx);
    vibrateFlexible();
  }
  // Close context after sound finishes
  setTimeout(() => ctx.close().catch(() => {}), 2000);
}
