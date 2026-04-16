import heroPlants from "@/assets/hero-plants.jpg";
import heroBeach from "@/assets/hero-beach.jpg";
import heroForest from "@/assets/hero-forest.jpg";
import heroNature from "@/assets/hero-nature.jpg";
import heroZen from "@/assets/hero-zen.jpg";

export interface HeroSlide {
  image: string;
  messages: { es: string; en: string };
  subtitles: { es: string; en: string };
}

export const heroSlides: HeroSlide[] = [
  {
    image: heroPlants,
    messages: { es: "Mantente presente.", en: "Stay present." },
    subtitles: { es: "Reflexión Matutina", en: "Morning Reflection" },
  },
  {
    image: heroBeach,
    messages: { es: "Respira profundo, avanza con calma.", en: "Breathe deep, move with calm." },
    subtitles: { es: "Paz Interior", en: "Inner Peace" },
  },
  {
    image: heroForest,
    messages: { es: "Cada paso cuenta.", en: "Every step counts." },
    subtitles: { es: "Crecimiento Personal", en: "Personal Growth" },
  },
  {
    image: heroNature,
    messages: { es: "Hoy es un gran día para avanzar.", en: "Today is a great day to move forward." },
    subtitles: { es: "Motivación Diaria", en: "Daily Motivation" },
  },
  {
    image: heroZen,
    messages: { es: "La serenidad es tu superpoder.", en: "Serenity is your superpower." },
    subtitles: { es: "Momento Zen", en: "Zen Moment" },
  },
];
