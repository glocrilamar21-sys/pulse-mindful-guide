import { getMascotImage, loadMascotOutfit } from "@/lib/mascot";
import { cn } from "@/lib/utils";

interface BrainMascotProps {
  mood: "happy" | "worried";
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

export function BrainMascot({ mood, size = "md", className, animate = false }: BrainMascotProps) {
  const outfitId = loadMascotOutfit();
  const src = getMascotImage(outfitId, mood);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  };

  return (
    <img
      src={src}
      alt={mood === "happy" ? "Brain mascot smiling" : "Brain mascot worried"}
      className={cn(
        sizeClasses[size],
        "object-contain select-none",
        animate && mood === "worried" && "animate-bounce",
        animate && mood === "happy" && "animate-pulse",
        className
      )}
      loading="lazy"
      width={512}
      height={512}
    />
  );
}
