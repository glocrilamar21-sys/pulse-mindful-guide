import heroPlants from "@/assets/hero-plants.jpg";
import heroBeach from "@/assets/hero-beach.jpg";
import heroForest from "@/assets/hero-forest.jpg";
import heroNature from "@/assets/hero-nature.jpg";
import heroZen from "@/assets/hero-zen.jpg";

export interface HeroSlide {
  image: string;
  messages: Record<string, string>;
  subtitles: Record<string, string>;
}

export const heroSlides: HeroSlide[] = [
  {
    image: heroPlants,
    messages: { es: "Mantente presente.", en: "Stay present.", pt: "Fique presente.", fr: "Restez présent.", it: "Resta presente." },
    subtitles: { es: "Reflexión Matutina", en: "Morning Reflection", pt: "Reflexão Matinal", fr: "Réflexion Matinale", it: "Riflessione Mattutina" },
  },
  {
    image: heroBeach,
    messages: { es: "Respira profundo, avanza con calma.", en: "Breathe deep, move with calm.", pt: "Respire fundo, avance com calma.", fr: "Respirez profondément, avancez calmement.", it: "Respira profondamente, procedi con calma." },
    subtitles: { es: "Paz Interior", en: "Inner Peace", pt: "Paz Interior", fr: "Paix Intérieure", it: "Pace Interiore" },
  },
  {
    image: heroForest,
    messages: { es: "Cada paso cuenta.", en: "Every step counts.", pt: "Cada passo conta.", fr: "Chaque pas compte.", it: "Ogni passo conta." },
    subtitles: { es: "Crecimiento Personal", en: "Personal Growth", pt: "Crescimento Pessoal", fr: "Croissance Personnelle", it: "Crescita Personale" },
  },
  {
    image: heroNature,
    messages: { es: "Hoy es un gran día para avanzar.", en: "Today is a great day to move forward.", pt: "Hoje é um ótimo dia para avançar.", fr: "Aujourd'hui est un grand jour pour avancer.", it: "Oggi è un grande giorno per andare avanti." },
    subtitles: { es: "Motivación Diaria", en: "Daily Motivation", pt: "Motivação Diária", fr: "Motivation Quotidienne", it: "Motivazione Quotidiana" },
  },
  {
    image: heroZen,
    messages: { es: "La serenidad es tu superpoder.", en: "Serenity is your superpower.", pt: "A serenidade é o seu superpoder.", fr: "La sérénité est votre superpouvoir.", it: "La serenità è il tuo superpotere." },
    subtitles: { es: "Momento Zen", en: "Zen Moment", pt: "Momento Zen", fr: "Moment Zen", it: "Momento Zen" },
  },
];
