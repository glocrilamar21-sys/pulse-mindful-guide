import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Check, Star } from "lucide-react";
import { mascotOutfits, getMascotImage, type MascotCategory, type MascotOutfit } from "@/lib/mascot";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { getMascotName } from "@/lib/mascotNames";
import { loadFavorites, saveFavorites, toggleFavorite } from "@/lib/favorites";

interface MascotGalleryProps {
  currentOutfit: string;
  onChange: (id: string) => void;
}

interface CategoryDef {
  id: "all" | MascotCategory;
  labelKey: TranslationKey;
  emoji: string;
}

const CATEGORIES: CategoryDef[] = [
  { id: "all", labelKey: "catAll", emoji: "✨" },
  { id: "original", labelKey: "catOriginal", emoji: "🧠" },
  { id: "health", labelKey: "catHealth", emoji: "🩺" },
  { id: "tech", labelKey: "catTech", emoji: "💻" },
  { id: "engineering", labelKey: "catEngineering", emoji: "🏗️" },
  { id: "creative", labelKey: "catCreative", emoji: "🎨" },
  { id: "service", labelKey: "catService", emoji: "🚒" },
  { id: "business", labelKey: "catBusiness", emoji: "📊" },
  { id: "education", labelKey: "catEducation", emoji: "🎓" },
  { id: "seasons", labelKey: "catSeasons", emoji: "🌸" },
  { id: "festive", labelKey: "catFestive", emoji: "🎃" },
  { id: "accessories", labelKey: "catAccessories", emoji: "🕶️" },
];

const LONG_PRESS_MS = 450;

export function MascotGallery({ currentOutfit, onChange }: MascotGalleryProps) {
  const { t, locale } = useI18n();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | MascotCategory>("all");
  const [previewOutfit, setPreviewOutfit] = useState<MascotOutfit | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());

  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => toggleFavorite(prev, id));
    if ("vibrate" in navigator) {
      try { navigator.vibrate?.(10); } catch { /* noop */ }
    }
  };

  const { favoritesList, restList, totalCount } = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = mascotOutfits.filter((o) => {
      if (activeCategory !== "all" && o.category !== activeCategory) return false;
      if (q) {
        const localized = getMascotName(o.id, locale, o.name).toLowerCase();
        if (!localized.includes(q) && !o.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    const favSet = new Set(favorites);
    const favs: MascotOutfit[] = [];
    const rest: MascotOutfit[] = [];
    list.forEach((o) => (favSet.has(o.id) ? favs.push(o) : rest.push(o)));
    return { favoritesList: favs, restList: rest, totalCount: list.length };
  }, [search, activeCategory, locale, favorites]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: mascotOutfits.length };
    mascotOutfits.forEach((o) => {
      map[o.category] = (map[o.category] || 0) + 1;
    });
    return map;
  }, []);

  const startLongPress = (outfit: MascotOutfit) => {
    longPressTriggered.current = false;
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      setPreviewOutfit(outfit);
      if ("vibrate" in navigator) {
        try { navigator.vibrate?.(15); } catch { /* noop */ }
      }
    }, LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleClick = (outfit: MascotOutfit) => {
    if (longPressTriggered.current) {
      // Suppress click that follows a long-press
      longPressTriggered.current = false;
      return;
    }
    onChange(outfit.id);
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("gallerySearchPlaceholder")}
          className="pl-9 pr-9 h-10 rounded-xl bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-primary"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full hover:bg-muted cursor-pointer"
            aria-label={t("gallerySearchPlaceholder")}
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = counts[cat.id] || 0;
          if (count === 0 && cat.id !== "all") return null;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              <span>{cat.emoji}</span>
              <span>{t(cat.labelKey)}</span>
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  isActive ? "bg-primary-foreground/20" : "bg-background/60"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results header + hint */}
      <div className="flex items-center justify-between px-1 gap-2">
        <span className="text-xs text-muted-foreground font-semibold">
          {filtered.length} {filtered.length === 1 ? t("galleryCountOne") : t("galleryCountMany")}
        </span>
        <span className="text-[10px] text-muted-foreground/70 italic truncate">
          {t("previewHint")}
        </span>
      </div>

      {/* Gallery grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground font-semibold">{t("galleryNoResults")}</p>
          <p className="text-xs text-muted-foreground/70">{t("galleryNoResultsHint")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5">
          {filtered.map((outfit) => {
            const isActive = currentOutfit === outfit.id;
            const isFav = favorites.includes(outfit.id);
            return (
              <button
                key={outfit.id}
                onClick={() => handleClick(outfit)}
                onPointerDown={() => startLongPress(outfit)}
                onPointerUp={cancelLongPress}
                onPointerLeave={cancelLongPress}
                onPointerCancel={cancelLongPress}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setPreviewOutfit(outfit);
                }}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 transition-all cursor-pointer group select-none touch-manipulation",
                  isActive
                    ? "ring-2 ring-primary bg-accent shadow-md"
                    : "bg-muted/40 hover:bg-muted hover:scale-[1.02]"
                )}
              >
                {isActive && (
                  <div className="absolute top-1.5 right-1.5 h-5 w-5 bg-primary rounded-full flex items-center justify-center shadow">
                    <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                  </div>
                )}
                {isFav && !isActive && (
                  <div className="absolute top-1.5 right-1.5 h-5 w-5 bg-background/90 rounded-full flex items-center justify-center shadow">
                    <Star className="h-3 w-3 text-[hsl(var(--warning))]" fill="hsl(var(--warning))" strokeWidth={2} />
                  </div>
                )}
                {isFav && isActive && (
                  <div className="absolute top-1.5 left-1.5 h-5 w-5 bg-background/90 rounded-full flex items-center justify-center shadow">
                    <Star className="h-3 w-3 text-[hsl(var(--warning))]" fill="hsl(var(--warning))" strokeWidth={2} />
                  </div>
                )}
                <div className="relative h-14 w-14 flex items-center justify-center">
                  <img
                    src={getMascotImage(outfit.id, "happy")}
                    alt={getMascotName(outfit.id, locale, outfit.name)}
                    loading="lazy"
                    draggable={false}
                    className={cn(
                      "h-full w-full object-contain transition-transform pointer-events-none",
                      isActive && "scale-110"
                    )}
                  />
                </div>
                <span className="text-[11px] font-bold text-foreground text-center leading-tight line-clamp-2">
                  <span className="mr-0.5">{outfit.emoji}</span>
                  {getMascotName(outfit.id, locale, outfit.name)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Preview dialog (3 states) */}
      <Dialog open={!!previewOutfit} onOpenChange={(o) => !o && setPreviewOutfit(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          {previewOutfit && (
            <div className="flex flex-col items-center gap-4 pt-2">
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <span>{previewOutfit.emoji}</span>
                <span>{getMascotName(previewOutfit.id, locale, previewOutfit.name)}</span>
              </DialogTitle>

              <div className="grid grid-cols-3 gap-3 w-full animate-fade-in">
                {([
                  { mood: "happy" as const, labelKey: "moodHappy" as TranslationKey, ring: "ring-primary/30" },
                  { mood: "worried" as const, labelKey: "moodWorried" as TranslationKey, ring: "ring-[hsl(var(--critical))]/30" },
                  { mood: "celebrating" as const, labelKey: "moodCelebrating" as TranslationKey, ring: "ring-primary/40" },
                ]).map(({ mood, labelKey, ring }) => (
                  <div key={mood} className="flex flex-col items-center gap-1.5">
                    <div className={cn("h-24 w-full bg-muted/40 rounded-xl flex items-center justify-center ring-2", ring)}>
                      <img
                        src={getMascotImage(previewOutfit.id, mood)}
                        alt={t(labelKey)}
                        className="h-20 w-20 object-contain"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground">{t(labelKey)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleToggleFavorite(previewOutfit.id)}
                  aria-label={favorites.includes(previewOutfit.id) ? t("removeFavorite") : t("addFavorite")}
                  className={cn(
                    "rounded-xl shrink-0 transition-colors",
                    favorites.includes(previewOutfit.id) && "border-[hsl(var(--warning))] bg-[hsl(var(--warning-light))] hover:bg-[hsl(var(--warning-light))]"
                  )}
                >
                  <Star
                    className={cn(
                      "h-4 w-4 transition-colors",
                      favorites.includes(previewOutfit.id) ? "text-[hsl(var(--warning))]" : "text-muted-foreground"
                    )}
                    fill={favorites.includes(previewOutfit.id) ? "hsl(var(--warning))" : "none"}
                    strokeWidth={2}
                  />
                </Button>
                <Button
                  onClick={() => {
                    onChange(previewOutfit.id);
                    setPreviewOutfit(null);
                  }}
                  className="flex-1 rounded-xl font-bold"
                >
                  {currentOutfit === previewOutfit.id ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      {t("complete")}
                    </>
                  ) : (
                    t("selectMascot")
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
