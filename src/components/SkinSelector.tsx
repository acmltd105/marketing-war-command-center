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
              "group relative flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-[0_12px_32px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl transition",
              "hover:border-slate-300 hover:text-slate-800 hover:shadow-[0_16px_36px_-16px_rgba(15,23,42,0.38)]",
            )}
            aria-label="Select dashboard skin"
            aria-busy={!isHydrated || isRemoteLoading}
            disabled={!isHydrated && isRemoteLoading}
          >
            <Paintbrush className="h-3.5 w-3.5 text-primary transition group-hover:text-primary" />
            <span className="font-semibold normal-case tracking-tight text-slate-700 group-hover:text-slate-900">
              {isHydrated ? currentSkin.name : "Hydrating skin..."}
            </span>
            {(isRemoteLoading || pendingSkinId === currentSkinId || !isHydrated) && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" aria-hidden />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-80 space-y-4 border border-slate-200/80 bg-white/85 p-4 shadow-[0_28px_60px_-36px_rgba(15,23,42,0.55)] backdrop-blur-2xl"
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
                    "relative overflow-hidden rounded-xl border border-slate-200/70 bg-white/70 p-3 text-left shadow-[0_18px_38px_-28px_rgba(15,23,42,0.4)] transition backdrop-blur-xl",
                    "hover:border-slate-300 hover:shadow-[0_20px_44px_-28px_rgba(15,23,42,0.45)]",
                    isActive && "border-primary/70 shadow-[0_20px_48px_-28px_rgba(37,99,235,0.45)] ring-2 ring-primary/60",
                    isSaving && "opacity-80",
                  )}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{ background: skin.heroGradient }}
                  />
                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{skin.name}</p>
                      <p className="text-xs text-slate-500">{skin.description}</p>
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
                  <p className="relative mt-3 text-[0.6rem] uppercase tracking-[0.3em] text-slate-500">
                    {skin.headline}
                  </p>
                </button>
              );
            })}
          </div>
          {lastError && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
              <AlertCircle className="mt-[2px] h-3.5 w-3.5" />
              <span>{lastError}</span>
            </div>
          )}
        </PopoverContent>
      </Popover>
      <span className="text-[0.55rem] uppercase tracking-[0.32em] text-slate-500">Skin</span>
    </div>
  );
};

export default SkinSelector;
