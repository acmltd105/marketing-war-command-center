import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSkin } from "@/hooks/useSkin";
import type { SkinId } from "@/lib/skins";
import { AlertCircle, Check, Loader2, Paintbrush, Sparkles } from "lucide-react";

const SkinSelectorComponent = () => {
  const {
    availableSkins,
    currentSkinId,
    currentSkin,
    selectSkin,
    isRemoteLoading,
    pendingSkinId,
    lastError,
    isHydrated,
  } = useSkin();
  const [open, setOpen] = useState(false);

  const handleSelect = async (skinId: SkinId) => {
    try {
      await selectSkin(skinId);
      setOpen(false);
    } catch (error) {
      console.error("Skin selection failed", error);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (!isHydrated) {
            return;
          }
          setOpen(next);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "group relative flex items-center gap-2 rounded-full border border-white/20 bg-background/70 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground backdrop-blur-xl transition",
              "hover:border-white/40 hover:text-foreground",
            )}
            aria-label="Select dashboard skin"
            aria-busy={!isHydrated || isRemoteLoading}
            disabled={!isHydrated && isRemoteLoading}
          >
            <Paintbrush className="h-3.5 w-3.5 text-primary transition group-hover:text-primary" />
            <span className="font-semibold normal-case tracking-tight text-foreground/90 group-hover:text-foreground">
              {isHydrated ? currentSkin.name : "Hydrating skin..."}
            </span>
            {(isRemoteLoading || pendingSkinId === currentSkinId || !isHydrated) && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" aria-hidden />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-80 space-y-4 border border-white/12 bg-background/95 p-4 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Dashboard skins</p>
              <p className="text-xs text-muted-foreground">Swap live palettes and liquid glass templates.</p>
            </div>
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
          </div>
          <div className="grid gap-3">
            {availableSkins.map((skin) => {
              const isActive = skin.id === currentSkinId;
              const isSaving = pendingSkinId === skin.id;
              return (
                <button
                  key={skin.id}
                  type="button"
                  onClick={() => handleSelect(skin.id)}
                  disabled={isSaving}
                  className={cn(
                    "relative overflow-hidden rounded-xl border border-white/10 bg-background/70 p-3 text-left shadow-lg transition backdrop-blur-xl",
                    "hover:border-white/25 hover:shadow-xl",
                    isActive && "border-primary/60 shadow-[0_0_0_1px_rgba(15,23,42,0.25)] ring-2 ring-primary/60",
                    isSaving && "opacity-80",
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-50" style={{ background: skin.heroGradient }} />
                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{skin.name}</p>
                      <p className="text-xs text-muted-foreground">{skin.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" aria-hidden />}
                      {isActive && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 border-0 bg-primary/20 text-[0.6rem] uppercase tracking-[0.25em] text-primary"
                        >
                          <Check className="h-3 w-3" /> Active
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="relative mt-3 flex gap-2">
                    {skin.previewColors.map((color, index) => (
                      <span
                        key={`${skin.id}-preview-${index}`}
                        className="h-6 flex-1 rounded-full border border-white/25 shadow-inner"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                  <p className="relative mt-3 text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
                    {skin.headline}
                  </p>
                </button>
              );
            })}
          </div>
          {lastError && (
            <div className="flex items-start gap-2 rounded-lg border border-corporate-crimson/40 bg-corporate-crimson/10 p-3 text-xs text-corporate-crimson">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5" aria-hidden />
              <div>
                <p className="font-semibold">Supabase sync issue</p>
                <p>{lastError}</p>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const SkinSelector = SkinSelectorComponent;
export default SkinSelectorComponent;
