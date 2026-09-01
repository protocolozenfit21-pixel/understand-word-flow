import { useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./ui-bits";

const speeds = ["1x", "1.25x", "1.5x", "2x"] as const;

export function AudioPlayer({ title, subtitle }: { title: string; subtitle: string }) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof speeds)[number]>("1x");

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">🎧 Ouvir</p>
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>

      <ProgressBar value={playing ? 38 : 12} className="mt-4" tone="gold" />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>{playing ? "1:52" : "0:36"}</span>
        <span>4:58</span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button type="button" aria-label="Voltar" className="grid size-10 place-items-center rounded-full bg-secondary">
          <SkipBack className="size-4" />
        </button>
        <button
          type="button"
          aria-label={playing ? "Pausar" : "Reproduzir"}
          onClick={() => setPlaying((p) => !p)}
          className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"
        >
          {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
        </button>
        <button type="button" aria-label="Avançar" className="grid size-10 place-items-center rounded-full bg-secondary">
          <SkipForward className="size-4" />
        </button>

        <div className="ml-auto flex gap-1">
          {speeds.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                speed === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        A narração em áudio entra em breve. A estrutura de player já está pronta.
      </p>
    </div>
  );
}
