import { useState } from "react";
import { Sparkles, RotateCcw, Wand2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  loadAutoMascotMode,
  saveAutoMascotMode,
  loadScopeMap,
  saveScopeMap,
  DEFAULT_SCOPE_MAP,
  getMascotImage,
  mascotOutfits,
  type TaskScope,
  type MascotCategory,
} from "@/lib/mascot";
import { getMascotName } from "@/lib/mascotNames";
import { MascotGallery } from "@/components/MascotGallery";

interface ScopeDef {
  id: TaskScope;
  labelKey: TranslationKey;
  emoji: string;
}

const SCOPES: ScopeDef[] = [
  { id: "trabajo", labelKey: "work", emoji: "💼" },
  { id: "estudio", labelKey: "study", emoji: "📚" },
  { id: "hogar", labelKey: "home", emoji: "🏠" },
  { id: "salud", labelKey: "health", emoji: "❤️" },
  { id: "personal", labelKey: "personal", emoji: "✨" },
];

// Affinity: which mascot categories suit each task scope.
// Each scope picks randomly from any of its preferred categories.
const SCOPE_AFFINITY: Record<TaskScope, MascotCategory[]> = {
  trabajo: ["tech", "business", "engineering"],
  estudio: ["education"],
  hogar: ["service", "seasons"],
  salud: ["health"],
  personal: ["creative", "festive", "accessories", "original"],
};

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function AutoMascotSettings() {
  const { t, locale } = useI18n();
  const [enabled, setEnabled] = useState(loadAutoMascotMode);
  const [scopeMap, setScopeMap] = useState<Record<TaskScope, string>>(loadScopeMap);
  const [editingScope, setEditingScope] = useState<TaskScope | null>(null);

  const handleToggle = (next: boolean) => {
    setEnabled(next);
    saveAutoMascotMode(next);
  };

  const handlePickMascot = (id: string) => {
    if (!editingScope) return;
    const next = { ...scopeMap, [editingScope]: id };
    setScopeMap(next);
    saveScopeMap(next);
    setEditingScope(null);
  };

  const handleReset = () => {
    const next = { ...DEFAULT_SCOPE_MAP };
    setScopeMap(next);
    saveScopeMap(next);
  };

  return (
    <div>
      <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-foreground">
        <Sparkles className="h-4 w-4" />
        {t("autoMascot")}
      </h3>

      {/* Toggle */}
      <label className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-3 cursor-pointer hover:bg-muted/60 transition-colors">
        <div className="min-w-0">
          <p className="text-xs font-bold text-foreground leading-tight">
            {enabled ? t("autoMascotOn") : t("autoMascotOff")}
          </p>
          <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
            {t("autoMascotDesc")}
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      </label>

      {/* Scope map (only when enabled) */}
      <div
        className={cn(
          "mt-2 rounded-xl bg-muted/40 px-3 py-3 transition-opacity",
          !enabled && "opacity-50 pointer-events-none",
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-foreground">
            {t("scopeMascotMap")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={!enabled}
            className="h-6 px-2 text-[10px] font-bold gap-1 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            {t("resetDefaults")}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mb-2">
          {t("scopeMascotMapDesc")}
        </p>
        <div className="grid grid-cols-1 gap-1.5">
          {SCOPES.map((scope) => {
            const mascotId = scopeMap[scope.id] || DEFAULT_SCOPE_MAP[scope.id];
            const outfit = mascotOutfits.find((o) => o.id === mascotId) || mascotOutfits[0];
            return (
              <button
                key={scope.id}
                onClick={() => setEditingScope(scope.id)}
                disabled={!enabled}
                className="flex items-center gap-2.5 rounded-lg bg-card border border-border px-2.5 py-2 text-left transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="text-lg shrink-0" aria-hidden>{scope.emoji}</span>
                <span className="text-xs font-bold text-foreground flex-1 min-w-0 truncate">
                  {t(scope.labelKey)}
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold truncate max-w-[80px]">
                  {getMascotName(outfit.id, locale, outfit.name)}
                </span>
                <img
                  src={getMascotImage(outfit.id, "happy")}
                  alt=""
                  loading="lazy"
                  className="h-8 w-8 object-contain shrink-0"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Picker dialog */}
      <Dialog
        open={!!editingScope}
        onOpenChange={(o) => !o && setEditingScope(null)}
      >
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            {editingScope && (
              <>
                <span>{SCOPES.find((s) => s.id === editingScope)?.emoji}</span>
                <span>{t(SCOPES.find((s) => s.id === editingScope)!.labelKey)}</span>
              </>
            )}
          </DialogTitle>
          {editingScope && (
            <MascotGallery
              currentOutfit={scopeMap[editingScope] || DEFAULT_SCOPE_MAP[editingScope]}
              onChange={handlePickMascot}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
