import {
  BookOpen, Briefcase, Dumbbell, Heart, Home, Leaf, Pill,
  ShoppingCart, Music, Phone, Mail, Camera, Coffee, Utensils,
  Car, Plane, Dog, Baby, Shirt, Wrench, Monitor, Gamepad2,
  Paintbrush, Scissors, Stethoscope, GraduationCap, Clock,
  AlertTriangle, Star, Sparkles, Zap, Sun, Moon,
  type LucideIcon,
} from "lucide-react";

export interface TaskIconOption {
  id: string;
  icon: LucideIcon;
  keywords: string[];
}

export const taskIcons: TaskIconOption[] = [
  { id: "book", icon: BookOpen, keywords: ["leer", "libro", "estudi", "read", "study", "book", "lire", "étude", "leggere", "studio", "ler", "estud"] },
  { id: "briefcase", icon: Briefcase, keywords: ["trabajo", "informe", "reunión", "oficina", "work", "meeting", "office", "report", "travail", "réunion", "lavoro", "riunione", "trabalho"] },
  { id: "dumbbell", icon: Dumbbell, keywords: ["ejerci", "gym", "paseo", "camina", "walk", "exercise", "fitness", "exercice", "marche", "esercizio", "palestra", "exercício"] },
  { id: "pill", icon: Pill, keywords: ["medic", "pastilla", "vitamina", "pill", "medicine", "médicament", "medicina", "remédio"] },
  { id: "leaf", icon: Leaf, keywords: ["planta", "regar", "jardín", "plant", "garden", "water", "plante", "jardin", "pianta", "giardino"] },
  { id: "heart", icon: Heart, keywords: ["amor", "cita", "love", "date", "amour", "amore", "encontro"] },
  { id: "home", icon: Home, keywords: ["casa", "hogar", "limpi", "home", "clean", "maison", "ménage", "pulire"] },
  { id: "cart", icon: ShoppingCart, keywords: ["compra", "super", "mercado", "shop", "buy", "grocery", "courses", "acheter", "spesa", "comprar"] },
  { id: "music", icon: Music, keywords: ["música", "cantar", "piano", "guitar", "music", "sing", "musique", "chanter", "musica", "cantare"] },
  { id: "phone", icon: Phone, keywords: ["llamar", "teléfono", "call", "phone", "appeler", "téléphone", "chiamare", "telefono", "ligar"] },
  { id: "mail", icon: Mail, keywords: ["correo", "email", "carta", "mail", "letter", "courrier", "lettre", "posta", "lettera", "correio"] },
  { id: "camera", icon: Camera, keywords: ["foto", "photo", "cámara", "camera", "appareil", "fotografia", "câmera"] },
  { id: "coffee", icon: Coffee, keywords: ["café", "desayuno", "coffee", "breakfast", "petit-déjeuner", "colazione", "cafeteria"] },
  { id: "utensils", icon: Utensils, keywords: ["cocina", "comer", "almuerzo", "cena", "cook", "lunch", "dinner", "eat", "cuisine", "cuisiner", "cucina", "pranzo", "cozinhar"] },
  { id: "car", icon: Car, keywords: ["coche", "conducir", "viaje", "car", "drive", "trip", "voiture", "conduire", "macchina", "guidare", "carro", "dirigir"] },
  { id: "plane", icon: Plane, keywords: ["vuelo", "avión", "viajar", "flight", "fly", "travel", "vol", "avion", "volo", "aereo", "voo", "avião"] },
  { id: "dog", icon: Dog, keywords: ["perro", "mascota", "pasear", "dog", "pet", "walk", "chien", "promener", "cane", "animale", "cachorro"] },
  { id: "baby", icon: Baby, keywords: ["bebé", "niño", "hijo", "baby", "child", "kid", "bébé", "enfant", "bambino", "figlio", "criança"] },
  { id: "shirt", icon: Shirt, keywords: ["ropa", "lavar", "planchar", "clothes", "laundry", "iron", "vêtements", "lessive", "vestiti", "bucato", "roupa"] },
  { id: "wrench", icon: Wrench, keywords: ["reparar", "arreglar", "fix", "repair", "tool", "réparer", "outil", "riparare", "consertar"] },
  { id: "monitor", icon: Monitor, keywords: ["comput", "pantalla", "programa", "computer", "screen", "code", "ordinateur", "écran", "schermo", "programma"] },
  { id: "gamepad", icon: Gamepad2, keywords: ["jugar", "juego", "game", "play", "jeu", "jouer", "gioco", "giocare", "jogo", "jogar"] },
  { id: "paintbrush", icon: Paintbrush, keywords: ["pintar", "dibujar", "arte", "paint", "draw", "art", "peindre", "dessiner", "dipingere", "disegnare", "pintura"] },
  { id: "scissors", icon: Scissors, keywords: ["cortar", "pelo", "peluqu", "cut", "hair", "salon", "couper", "cheveux", "tagliare", "capelli", "cabelo"] },
  { id: "stethoscope", icon: Stethoscope, keywords: ["doctor", "médico", "hospital", "cita médica", "appointment", "médecin", "hôpital", "dottore", "ospedale"] },
  { id: "graduation", icon: GraduationCap, keywords: ["gradua", "universidad", "clase", "examen", "university", "class", "exam", "université", "cours", "università", "esame", "universidade", "aula"] },
  { id: "star", icon: Star, keywords: ["importante", "especial", "important", "special", "spécial", "importante", "especial"] },
  { id: "sparkles", icon: Sparkles, keywords: ["creativ", "idea", "creative", "créatif", "idée", "creativo"] },
  { id: "zap", icon: Zap, keywords: ["rápido", "urgente", "fast", "quick", "urgent", "rapide", "veloce", "rápido"] },
  { id: "sun", icon: Sun, keywords: ["mañana", "despertar", "morning", "wake", "matin", "réveil", "mattina", "sveglia", "manhã", "acordar"] },
  { id: "moon", icon: Moon, keywords: ["noche", "dormir", "night", "sleep", "nuit", "sommeil", "notte", "dormire", "noite"] },
];

export function suggestIcon(taskName: string): string {
  const lower = taskName.toLowerCase();
  for (const opt of taskIcons) {
    if (opt.keywords.some((kw) => lower.includes(kw))) {
      return opt.id;
    }
  }
  return "";
}

export function getIconById(id: string): LucideIcon | null {
  return taskIcons.find((o) => o.id === id)?.icon ?? null;
}

export function getTaskDisplayIcon(task: { name: string; icon?: string; category: string }): LucideIcon {
  if (task.icon) {
    const found = getIconById(task.icon);
    if (found) return found;
  }
  // fallback: auto-detect
  const lower = task.name.toLowerCase();
  for (const opt of taskIcons) {
    if (opt.keywords.some((kw) => lower.includes(kw))) {
      return opt.icon;
    }
  }
  return task.category === "critical" ? AlertTriangle : Clock;
}
