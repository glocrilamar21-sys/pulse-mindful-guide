import {
  playCriticalSound,
  playFlexibleSound,
  vibrateCriticalPreset,
  vibrateFlexiblePreset,
} from "./soundPresets";

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
  icon?: string;
  postponedUntil?: string; // ISO string
}

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const STORAGE_KEY = "pulso-diario-tasks";

/** Type guard: ensures a value matches the Task shape closely enough to render safely. */
function isValidTask(v: unknown): v is Task {
  if (!v || typeof v !== "object") return false;
  const t = v as Record<string, unknown>;
  return (
    typeof t.id === "string" &&
    typeof t.name === "string" &&
    (t.category === "critical" || t.category === "flexible") &&
    typeof t.time === "string" &&
    typeof t.date === "string" &&
    typeof t.done === "boolean"
  );
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTask);
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    /* noop — quota exceeded or private mode */
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function vibrateCritical(): void {
  vibrateCriticalPreset();
}

export function vibrateFlexible(): void {
  vibrateFlexiblePreset();
}

export function stopVibration(): void {
  if ("vibrate" in navigator) {
    navigator.vibrate(0);
  }
}

// ── Persistent Audio Alert System ──

let alertInterval: ReturnType<typeof setInterval> | null = null;
let activeCtx: AudioContext | null = null;

/** Start a looping alert sound + vibration that repeats until stopAlert() is called */
export function startAlert(type: "critical" | "flexible"): void {
  stopAlert();
  activeCtx = new AudioContext();

  const play = () => {
    if (!activeCtx) return;
    if (type === "critical") {
      playCriticalSound(activeCtx);
      vibrateCriticalPreset();
    } else {
      playFlexibleSound(activeCtx);
      vibrateFlexiblePreset();
    }
  };

  play();
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
    playCriticalSound(ctx);
    vibrateCriticalPreset();
  } else {
    playFlexibleSound(ctx);
    vibrateFlexiblePreset();
  }
  setTimeout(() => ctx.close().catch(() => {}), 2000);
}

/** Play a specific preset demo */
export function playPresetDemo(preset: { play: (ctx: AudioContext) => void; vibratePattern: number | number[] }): void {
  const ctx = new AudioContext();
  preset.play(ctx);
  if ("vibrate" in navigator) {
    navigator.vibrate(preset.vibratePattern);
  }
  setTimeout(() => ctx.close().catch(() => {}), 2000);
}
