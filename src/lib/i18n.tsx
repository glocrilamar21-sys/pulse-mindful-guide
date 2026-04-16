import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Locale = "es" | "en";

const translations = {
  es: {
    // Header
    today: "Hoy",
    // Tabs
    tabFocus: "ENFOQUE",
    tabCalendar: "CALENDARIO",
    tabProjects: "PROYECTOS",
    tabSettings: "AJUSTES",
    // Hero
    morningReflection: "Reflexión Matutina",
    // Sections
    critical: "Crítica",
    tasksRemaining: "Tareas restantes",
    noCriticalTasks: "Sin tareas críticas pendientes ✓",
    flexible: "Flexible",
    inProgress: "En curso",
    noFlexibleTasks: "Sin tareas flexibles pendientes",
    completed: "Completadas",
    noTasksToday: "Sin tareas para hoy",
    noTasksThisDay: "Sin tareas para este día",
    tapToAdd: "Toca + para agregar tu primera tarea",
    // Task Card
    urgent: "Urgente",
    done: "Hecho",
    criticalTask: "Tarea crítica",
    flexibleTask: "Tarea flexible",
    criticalPriority: "Prioridad Crítica",
    complete: "Completado",
    postpone: "Posponer",
    // Add Task Dialog
    taskIdentity: "Identidad de la Tarea",
    contextDetails: "Detalles contextuales",
    taskPlaceholder: "Ej: Tomar medicación matutina",
    timeline: "Línea de tiempo",
    todayLabel: "Hoy",
    moment: "Momento",
    priorityStrategy: "Estrategia de Prioridad",
    activityScope: "Ámbito de Actividad",
    createTask: "Crear Tarea",
    // Scopes
    work: "Trabajo",
    study: "Estudio",
    home: "Hogar",
    personal: "Personal",
    health: "Salud",
    // Calendar
    tasksForToday: "Tareas para hoy",
    tasksFor: "Tareas para el",
    events: "Eventos",
    noTasksDay: "Sin tareas este día",
    // Projects
    overallProgress: "Progreso General",
    tasksCompleted: "tareas completadas",
    of: "de",
    goodPace: "¡Buen ritmo!",
    keepGoing: "¡Sigue avanzando!",
    categories: "Categorías",
    noTasks: "Sin tareas",
    percentComplete: "completado",
    // Settings
    testAlerts: "Probar Alertas",
    testAlertsDesc: "Escucha y siente cada tipo de alerta. Se repite hasta completar la tarea.",
    criticalAlert: "🔊 Alerta Crítica",
    flexibleAlert: "🔔 Alerta Flexible",
    aboutApp: "Acerca de Memory Help",
    aboutDesc: "Asistente de memoria que usa vibraciones y sonidos para recordarte tus tareas importantes del día.",
    language: "Idioma",
    spanish: "Español",
    english: "English",
  },
  en: {
    today: "Today",
    tabFocus: "FOCUS",
    tabCalendar: "CALENDAR",
    tabProjects: "PROJECTS",
    tabSettings: "SETTINGS",
    morningReflection: "Morning Reflection",
    critical: "Critical",
    tasksRemaining: "Tasks remaining",
    noCriticalTasks: "No pending critical tasks ✓",
    flexible: "Flexible",
    inProgress: "In progress",
    noFlexibleTasks: "No pending flexible tasks",
    completed: "Completed",
    noTasksToday: "No tasks for today",
    noTasksThisDay: "No tasks for this day",
    tapToAdd: "Tap + to add your first task",
    urgent: "Urgent",
    done: "Done",
    criticalTask: "Critical task",
    flexibleTask: "Flexible task",
    criticalPriority: "Critical Priority",
    complete: "Complete",
    postpone: "Postpone",
    taskIdentity: "Task Identity",
    contextDetails: "Context details",
    taskPlaceholder: "E.g.: Take morning medication",
    timeline: "Timeline",
    todayLabel: "Today",
    moment: "Time",
    priorityStrategy: "Priority Strategy",
    activityScope: "Activity Scope",
    createTask: "Create Task",
    work: "Work",
    study: "Study",
    home: "Home",
    personal: "Personal",
    health: "Health",
    tasksForToday: "Tasks for today",
    tasksFor: "Tasks for",
    events: "Events",
    noTasksDay: "No tasks this day",
    overallProgress: "Overall Progress",
    tasksCompleted: "tasks completed",
    of: "of",
    goodPace: "Great pace!",
    keepGoing: "Keep going!",
    categories: "Categories",
    noTasks: "No tasks",
    percentComplete: "completed",
    testAlerts: "Test Alerts",
    testAlertsDesc: "Listen and feel each type of alert. It repeats until the task is completed.",
    criticalAlert: "🔊 Critical Alert",
    flexibleAlert: "🔔 Flexible Alert",
    aboutApp: "About Memory Help",
    aboutDesc: "A memory assistant that uses vibrations and sounds to remind you of your important daily tasks.",
    language: "Language",
    spanish: "Español",
    english: "English",
  },
} as const;

export type TranslationKey = keyof typeof translations.es;

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return (localStorage.getItem("app-locale") as Locale) || "es";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("app-locale", l);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key] || key,
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
