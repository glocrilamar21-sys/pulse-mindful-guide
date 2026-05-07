import { Capacitor } from "@capacitor/core";
import { LocalNotifications, ScheduleOptions } from "@capacitor/local-notifications";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import type { Task } from "./tasks";

export const isNative = (): boolean => Capacitor.isNativePlatform();

/** Stable numeric id derived from task.id (string) */
function taskNumericId(taskId: string): number {
  let hash = 0;
  for (let i = 0; i < taskId.length; i++) {
    hash = (hash * 31 + taskId.charCodeAt(i)) | 0;
  }
  // Positive 31-bit int
  return Math.abs(hash) % 2147483647;
}

export async function ensureNativePermission(): Promise<boolean> {
  if (!isNative()) return false;
  const perm = await LocalNotifications.checkPermissions();
  if (perm.display === "granted") return true;
  const req = await LocalNotifications.requestPermissions();
  return req.display === "granted";
}

/** Schedule (or reschedule) all pending tasks as native local notifications. */
export async function syncNativeNotifications(tasks: Task[]): Promise<void> {
  if (!isNative()) return;

  const granted = await ensureNativePermission();
  if (!granted) return;

  // Cancel previously scheduled notifications we own
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length) {
      await LocalNotifications.cancel({
        notifications: pending.notifications.map((n) => ({ id: n.id })),
      });
    }
  } catch {
    /* noop */
  }

  const now = Date.now();
  const toSchedule: ScheduleOptions["notifications"] = [];

  for (const task of tasks) {
    if (task.done) continue;
    const [h, m] = task.time.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) continue;
    const [y, mo, d] = task.date.split("-").map(Number);
    if (!y || !mo || !d) continue;
    const fireAt = new Date(y, mo - 1, d, h, m, 0, 0).getTime();
    if (fireAt <= now) continue; // skip past

    const isCritical = task.category === "critical";
    toSchedule.push({
      id: taskNumericId(task.id),
      title: isCritical ? "⚠️ Memory Help" : "🔔 Memory Help",
      body: `${task.name} — ${task.time}`,
      schedule: { at: new Date(fireAt), allowWhileIdle: true },
      sound: undefined, // use default system sound
      smallIcon: "ic_stat_icon_config_sample",
      extra: { taskId: task.id, category: task.category },
    });
  }

  if (toSchedule.length) {
    try {
      await LocalNotifications.schedule({ notifications: toSchedule });
    } catch (err) {
      console.error("[native] schedule failed", err);
    }
  }
}

export async function nativeHaptic(type: "critical" | "flexible"): Promise<void> {
  if (!isNative()) return;
  try {
    await Haptics.impact({
      style: type === "critical" ? ImpactStyle.Heavy : ImpactStyle.Medium,
    });
  } catch {
    /* noop */
  }
}
