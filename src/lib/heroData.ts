import heroPlants from "@/assets/hero-plants.jpg";
import heroBeach from "@/assets/hero-beach.jpg";
import heroForest from "@/assets/hero-forest.jpg";
import heroNature from "@/assets/hero-nature.jpg";
import heroZen from "@/assets/hero-zen.jpg";
import heroMountainLake from "@/assets/hero-mountain-lake.jpg";
import heroWaterfall from "@/assets/hero-waterfall.jpg";
import heroLavender from "@/assets/hero-lavender.jpg";
import heroStarryNight from "@/assets/hero-starry-night.jpg";
import heroBamboo from "@/assets/hero-bamboo.jpg";
import heroEagle from "@/assets/hero-eagle.jpg";
import heroResilience from "@/assets/hero-resilience.jpg";
import heroPath from "@/assets/hero-path.jpg";
import heroWave from "@/assets/hero-wave.jpg";
import heroSummit from "@/assets/hero-summit.jpg";

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
  {
    image: heroMountainLake,
    messages: { es: "La paciencia mueve montañas.", en: "Patience moves mountains.", pt: "A paciência move montanhas.", fr: "La patience déplace les montagnes.", it: "La pazienza muove le montagne." },
    subtitles: { es: "Amanecer Dorado", en: "Golden Dawn", pt: "Amanhecer Dourado", fr: "Aube Dorée", it: "Alba Dorata" },
  },
  {
    image: heroWaterfall,
    messages: { es: "Deja que todo fluya como el agua.", en: "Let everything flow like water.", pt: "Deixe tudo fluir como a água.", fr: "Laissez tout couler comme l'eau.", it: "Lascia che tutto scorra come l'acqua." },
    subtitles: { es: "Fluir Natural", en: "Natural Flow", pt: "Fluxo Natural", fr: "Flux Naturel", it: "Flusso Naturale" },
  },
  {
    image: heroLavender,
    messages: { es: "Confía en tu proceso, todo llega a su tiempo.", en: "Trust your process, everything comes in time.", pt: "Confie no seu processo, tudo chega a seu tempo.", fr: "Faites confiance à votre processus, tout arrive en son temps.", it: "Fidati del tuo processo, tutto arriva a tempo debito." },
    subtitles: { es: "Confianza Plena", en: "Full Trust", pt: "Confiança Plena", fr: "Confiance Totale", it: "Piena Fiducia" },
  },
  {
    image: heroStarryNight,
    messages: { es: "Incluso en la oscuridad, siempre hay luz.", en: "Even in darkness, there is always light.", pt: "Mesmo na escuridão, sempre há luz.", fr: "Même dans l'obscurité, il y a toujours de la lumière.", it: "Anche nell'oscurità, c'è sempre luce." },
    subtitles: { es: "Cielo Infinito", en: "Infinite Sky", pt: "Céu Infinito", fr: "Ciel Infini", it: "Cielo Infinito" },
  },
  {
    image: heroBamboo,
    messages: { es: "Sé flexible como el bambú: fuerte pero adaptable.", en: "Be flexible like bamboo: strong yet adaptable.", pt: "Seja flexível como o bambu: forte mas adaptável.", fr: "Soyez flexible comme le bambou : fort mais adaptable.", it: "Sii flessibile come il bambù: forte ma adattabile." },
    subtitles: { es: "Camino Interior", en: "Inner Path", pt: "Caminho Interior", fr: "Chemin Intérieur", it: "Cammino Interiore" },
  },
];
