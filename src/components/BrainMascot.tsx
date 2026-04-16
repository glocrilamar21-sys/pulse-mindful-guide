import { getMascotImage, resolveMascotForScope, type TaskScope } from "@/lib/mascot";
import { cn } from "@/lib/utils";

interface BrainMascotProps {
  mood: "happy" | "worried" | "celebrating";
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
  /**
   * Optional task scope. When auto-mascot mode is enabled in Settings,
   * the displayed mascot is resolved from the scope map; otherwise the
   * globally selected outfit is used.
   */
  scope?: TaskScope;
}

export function BrainMascot({ mood, size = "md", className, animate = false, scope }: BrainMascotProps) {
  const outfitId = resolveMascotForScope(scope);
  const src = getMascotImage(outfitId, mood);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  };

  const altText = mood === "celebrating"
    ? "Brain mascot celebrating with confetti"
    : mood === "happy"
    ? "Brain mascot smiling"
    : "Brain mascot worried";

  return (
    <img
      src={src}
      alt={altText}
      className={cn(
        sizeClasses[size],
        "object-contain select-none",
        animate && mood === "worried" && "animate-bounce",
        animate && mood === "happy" && "animate-pulse",
        animate && mood === "celebrating" && "animate-bounce",
        className
      )}
      loading="lazy"
      width={512}
      height={512}
    />
  );
}
