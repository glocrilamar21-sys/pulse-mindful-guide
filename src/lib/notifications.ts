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
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const notified = getNotifiedSet();

  const todayTasks = tasks.filter(
    (t) => t.date === today && t.category === "critical" && !t.done
  );

  for (const task of todayTasks) {
    if (notified.has(task.id)) continue;

    const [h, m] = task.time.split(":").map(Number);
    const taskMinutes = h * 60 + m;
    const diff = taskMinutes - currentMinutes;

    // Notify if task is within ADVANCE_MINUTES or already past due
    if (diff <= ADVANCE_MINUTES) {
      const isPastDue = diff <= 0;
      const title = isPastDue ? "⚠️ ¡Tarea crítica vencida!" : "🔔 Tarea crítica próxima";
      const body = isPastDue
        ? `"${task.name}" ya pasó su hora (${task.time})`
        : `"${task.name}" es en ${diff} minuto${diff !== 1 ? "s" : ""} (${task.time})`;

      try {
        new Notification(title, {
          body,
          icon: "/placeholder.svg",
          tag: task.id,
          requireInteraction: true,
        });
      } catch {
        // Fallback: some browsers don't support Notification constructor in this context
      }

      markNotified(task.id);
    }
  }
}
