import { Task, todayStr } from "./tasks";

const NOTIFIED_KEY = "pulso-notified-tasks";
const ENABLED_KEY = "pulso-notifications-enabled";
const ADVANCE_MINUTES = 5; // notify 5 minutes before task time

export function isNotificationSupported(): boolean {
  return "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function isNotificationsEnabled(): boolean {
  return localStorage.getItem(ENABLED_KEY) === "true";
}

export function setNotificationsEnabled(enabled: boolean): void {
  localStorage.setItem(ENABLED_KEY, enabled ? "true" : "false");
}

function getNotifiedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function markNotified(taskId: string): void {
  const set = getNotifiedSet();
  set.add(taskId);
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...set]));
}

/** Clear notified set daily */
export function clearNotifiedIfNewDay(): void {
  const lastDate = localStorage.getItem("pulso-notified-date");
  const today = todayStr();
  if (lastDate !== today) {
    localStorage.setItem(NOTIFIED_KEY, "[]");
    localStorage.setItem("pulso-notified-date", today);
  }
}

/** Check tasks and fire notifications for critical tasks about to expire */
export function checkAndNotify(tasks: Task[]): void {
  if (!isNotificationsEnabled()) return;
  if (getNotificationPermission() !== "granted") return;

  const today = todayStr();
  const now = new Date();
  const notified = getNotifiedSet();

  // Include any pending task (critical or flexible) whose date is today or earlier.
  const dueTasks = tasks.filter(
    (t) => !t.done && t.date <= today
  );

  for (const task of dueTasks) {
    if (notified.has(task.id)) continue;

    const [h, m] = task.time.split(":").map(Number);
    const [y, mo, d] = task.date.split("-").map(Number);
    if (!y || Number.isNaN(h)) continue;
    const taskTime = new Date(y, mo - 1, d, h, m).getTime();
    const diff = Math.round((taskTime - now.getTime()) / 60000);

    // Notify if task is within ADVANCE_MINUTES or already past due
    if (diff <= ADVANCE_MINUTES) {
      const isPastDue = diff <= 0;
      const title = isPastDue ? "⚠️ ¡Tarea vencida!" : "🔔 Recordatorio próximo";
      const body = isPastDue
        ? `"${task.name}" ya pasó su hora (${task.time})`
        : `"${task.name}" es en ${diff} minuto${diff !== 1 ? "s" : ""} (${task.time})`;

      try {
        new Notification(title, {
          body,
          icon: "/icon-192.png",
          tag: task.id,
          requireInteraction: true,
        });
        if ("vibrate" in navigator) {
          navigator.vibrate(task.category === "critical" ? [400, 150, 400, 150, 400] : [200, 100, 200]);
        }
      } catch {
        /* noop */
      }

      markNotified(task.id);
    }
  }
}
