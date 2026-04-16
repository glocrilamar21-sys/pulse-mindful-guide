import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { medalInfo, type MedalTier } from "@/lib/medals";

interface MedalProps {
  tier: MedalTier;
  /** Show label next to emoji (e.g. "Oro"). Defaults to false (compact). */
  showLabel?: boolean;
  /** Compact size — smaller emoji, used inline next to scores. */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: { emoji: "text-sm", label: "text-[10px]" },
  md: { emoji: "text-base", label: "text-xs" },
  lg: { emoji: "text-3xl", label: "text-sm" },
} as const;

export function Medal({ tier, showLabel = false, size = "sm", className }: MedalProps) {
  const { t } = useI18n();
  if (!tier) return null;
  const info = medalInfo(tier);
  const sizes = SIZE_MAP[size];

  return (
    <span
      className={cn("inline-flex items-center gap-1 font-bold", info.colorClass, className)}
      title={t(info.labelKey)}
      aria-label={`${t("medalEarned")}: ${t(info.labelKey)}`}
    >
      <span className={cn("leading-none", sizes.emoji)} aria-hidden>
        {info.emoji}
      </span>
      {showLabel && <span className={cn("leading-none", sizes.label)}>{t(info.labelKey)}</span>}
    </span>
  );
}
