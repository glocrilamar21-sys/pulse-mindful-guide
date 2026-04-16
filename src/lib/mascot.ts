import mascotHappy from "@/assets/mascot-happy.png";
import mascotWorried from "@/assets/mascot-worried.png";
import mascotHappyGraduate from "@/assets/mascot-happy-graduate.png";
import mascotWorriedGraduate from "@/assets/mascot-worried-graduate.png";
import mascotHappyHero from "@/assets/mascot-happy-hero.png";
import mascotWorriedHero from "@/assets/mascot-worried-hero.png";
import mascotHappyChef from "@/assets/mascot-happy-chef.png";
import mascotWorriedChef from "@/assets/mascot-worried-chef.png";

export interface MascotOutfit {
  id: string;
  name: string;
  emoji: string;
  happy: string;
  worried: string;
}

export const mascotOutfits: MascotOutfit[] = [
  { id: "default", name: "Original", emoji: "🧠", happy: mascotHappy, worried: mascotWorried },
  { id: "graduate", name: "Graduado", emoji: "🎓", happy: mascotHappyGraduate, worried: mascotWorriedGraduate },
  { id: "hero", name: "Superhéroe", emoji: "🦸", happy: mascotHappyHero, worried: mascotWorriedHero },
  { id: "chef", name: "Chef", emoji: "👨‍🍳", happy: mascotHappyChef, worried: mascotWorriedChef },
];

const MASCOT_KEY = "pulso-diario-mascot";

export function loadMascotOutfit(): string {
  return localStorage.getItem(MASCOT_KEY) || "default";
}

export function saveMascotOutfit(id: string): void {
  localStorage.setItem(MASCOT_KEY, id);
}

export function getMascotImage(outfitId: string, mood: "happy" | "worried"): string {
  const outfit = mascotOutfits.find((o) => o.id === outfitId) || mascotOutfits[0];
  return mood === "happy" ? outfit.happy : outfit.worried;
}
