import { getMascotImage, resolveMascotForScope, type TaskScope } from "@/lib/mascot";
import { getMascotName } from "@/lib/mascotNames";
import { useI18n } from "@/lib/i18n";
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

const moodWordByLocale: Record<string, Record<"happy" | "worried" | "celebrating", string>> = {
  es: { happy: "feliz", worried: "preocupado", celebrating: "celebrando" },
  en: { happy: "smiling", worried: "worried", celebrating: "celebrating" },
  pt: { happy: "feliz", worried: "preocupado", celebrating: "comemorando" },
  fr: { happy: "souriante", worried: "inquiète", celebrating: "en fête" },
  it: { happy: "felice", worried: "preoccupata", celebrating: "in festa" },
};

const mascotWordByLocale: Record<string, string> = {
  es: "Mascota",
  en: "mascot",
  pt: "Mascote",
  fr: "Mascotte",
  it: "Mascotte",
};

export function BrainMascot({ mood, size = "md", className, animate = false, scope }: BrainMascotProps) {
  const { locale } = useI18n();
  const outfitId = resolveMascotForScope(scope);
  const src = getMascotImage(outfitId, mood);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  };

  const fallbackName = outfitId.charAt(0).toUpperCase() + outfitId.slice(1);
  const mascotName = getMascotName(outfitId, locale, fallbackName);
  const moodWord = (moodWordByLocale[locale] ?? moodWordByLocale.en)[mood];
  const mascotWord = mascotWordByLocale[locale] ?? mascotWordByLocale.en;

  // Examples:
  //   en: "Astronaut mascot worried"
  //   es: "Mascota Astronauta preocupado"
  const altText = locale === "en"
    ? `${mascotName} ${mascotWord} ${moodWord}`
    : `${mascotWord} ${mascotName} ${moodWord}`;

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
