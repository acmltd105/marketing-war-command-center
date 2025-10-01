import { useState } from "react";
import { useSkin } from "@/hooks/useSkin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCircle, Check, Loader2, Paintbrush, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SkinId } from "@/lib/skins";

const SkinSelector = () => {
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
    <div className="flex flex-col items-end gap-1">
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          if (!isHydrated) {
            return;
          }
          setOpen(nextOpen);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "group relative flex items-center gap-2 rounded-full border border-white/15 bg-background/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-md transition",
              "hover:border-white/35 hover:text-foreground",
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
          className="w-80 space-y-4 border border-white/12 bg-background/95 p-4 shadow-xl backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Dashboard skins</p>
              <p className="text-xs text-muted-foreground">
                Swap live palettes and liquid glass templates.
              </p>
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
                    "relative overflow-hidden rounded-xl border border-white/10 bg-background/60 p-3 text-left transition",
                    "hover:border-white/25 hover:shadow-lg",
                    isActive && "border-primary/60 shadow-[0_0_0_1px_rgba(0,0,0,0.35)] ring-2 ring-primary/70",
                    isSaving && "opacity-80",
                  )}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{ background: skin.heroGradient }}
                  />
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
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
              <AlertCircle className="mt-[2px] h-3.5 w-3.5" />
              <span>{lastError}</span>
            </div>
          )}
        </PopoverContent>
      </Popover>
      <span className="text-[0.55rem] uppercase tracking-[0.32em] text-muted-foreground">Skin</span>
    </div>
  );
};

export default SkinSelector;
