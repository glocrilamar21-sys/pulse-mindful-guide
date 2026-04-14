export type TaskCategory = "critical" | "flexible";

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  time: string; // HH:MM
  date: string; // YYYY-MM-DD
  done: boolean;
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
    // Strong intermittent pattern
    navigator.vibrate([300, 100, 300, 100, 300, 100, 300]);
  }
}

export function vibrateFlexible(): void {
  if ("vibrate" in navigator) {
    // Single short pulse
    navigator.vibrate(200);
  }
}

export function stopVibration(): void {
  if ("vibrate" in navigator) {
    navigator.vibrate(0);
  }
}
