import mascotHappy from "@/assets/mascot-happy.png";
import mascotWorried from "@/assets/mascot-worried.png";
import mascotCelebrating from "@/assets/mascot-celebrating.png";
import mascotHappyGraduate from "@/assets/mascot-happy-graduate.png";
import mascotWorriedGraduate from "@/assets/mascot-worried-graduate.png";
import mascotCelebratingGraduate from "@/assets/mascot-celebrating-graduate.png";
import mascotHappyHero from "@/assets/mascot-happy-hero.png";
import mascotWorriedHero from "@/assets/mascot-worried-hero.png";
import mascotCelebratingHero from "@/assets/mascot-celebrating-hero.png";
import mascotHappyChef from "@/assets/mascot-happy-chef.png";
import mascotWorriedChef from "@/assets/mascot-worried-chef.png";
import mascotCelebratingChef from "@/assets/mascot-celebrating-chef.png";
import mascotHappyStudent from "@/assets/mascot-happy-student.png";
import mascotWorriedStudent from "@/assets/mascot-worried-student.png";
import mascotCelebratingStudent from "@/assets/mascot-celebrating-student.png";
import mascotHappyAthlete from "@/assets/mascot-happy-athlete.png";
import mascotWorriedAthlete from "@/assets/mascot-worried-athlete.png";
import mascotCelebratingAthlete from "@/assets/mascot-celebrating-athlete.png";
import mascotHappyDoctor from "@/assets/mascot-happy-doctor.png";
import mascotWorriedDoctor from "@/assets/mascot-worried-doctor.png";
import mascotCelebratingDoctor from "@/assets/mascot-celebrating-doctor.png";
import mascotHappyGardener from "@/assets/mascot-happy-gardener.png";
import mascotWorriedGardener from "@/assets/mascot-worried-gardener.png";
import mascotCelebratingGardener from "@/assets/mascot-celebrating-gardener.png";

export interface MascotOutfit {
  id: string;
  name: string;
  emoji: string;
  happy: string;
  worried: string;
  celebrating: string;
}

export const mascotOutfits: MascotOutfit[] = [
  { id: "default", name: "Original", emoji: "🧠", happy: mascotHappy, worried: mascotWorried, celebrating: mascotCelebrating },
  { id: "graduate", name: "Graduado", emoji: "🎓", happy: mascotHappyGraduate, worried: mascotWorriedGraduate, celebrating: mascotCelebratingGraduate },
  { id: "hero", name: "Superhéroe", emoji: "🦸", happy: mascotHappyHero, worried: mascotWorriedHero, celebrating: mascotCelebratingHero },
  { id: "chef", name: "Chef", emoji: "👨‍🍳", happy: mascotHappyChef, worried: mascotWorriedChef, celebrating: mascotCelebratingChef },
  { id: "student", name: "Estudiante", emoji: "📚", happy: mascotHappyStudent, worried: mascotWorriedStudent, celebrating: mascotCelebratingStudent },
  { id: "athlete", name: "Deportista", emoji: "🏃", happy: mascotHappyAthlete, worried: mascotWorriedAthlete, celebrating: mascotCelebratingAthlete },
  { id: "doctor", name: "Doctor", emoji: "🩺", happy: mascotHappyDoctor, worried: mascotWorriedDoctor, celebrating: mascotCelebratingDoctor },
  { id: "gardener", name: "Jardinero", emoji: "🌻", happy: mascotHappyGardener, worried: mascotWorriedGardener, celebrating: mascotCelebratingGardener },
];

const MASCOT_KEY = "pulso-diario-mascot";

export function loadMascotOutfit(): string {
  return localStorage.getItem(MASCOT_KEY) || "default";
}

export function saveMascotOutfit(id: string): void {
  localStorage.setItem(MASCOT_KEY, id);
}

export function getMascotImage(outfitId: string, mood: "happy" | "worried" | "celebrating"): string {
  const outfit = mascotOutfits.find((o) => o.id === outfitId) || mascotOutfits[0];
  if (mood === "celebrating") return outfit.celebrating;
  return mood === "happy" ? outfit.happy : outfit.worried;
}
