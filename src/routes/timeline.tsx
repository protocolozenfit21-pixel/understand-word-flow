import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { Pill } from "@/components/ui-bits";
import { timeline } from "@/data/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "História da Bíblia — linha do tempo | Elohim" },
      {
        name: "description",
        content:
          "Uma linha do tempo visual da Criação ao Apocalipse, com períodos históricos, personagens, locais e passagens relacionadas.",
      },
      { property: "og:title", content: "Linha do tempo da Bíblia" },
      { property: "og:description", content: "Entenda a ordem dos acontecimentos e quem estava envolvido em cada época." },
    ],
  }),
  component: Timeline,
});

function Timeline() {
  const [open, setOpen] = useState<string | null>(timeline[0]?.id ?? null);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="🕰️ História da Bíblia"
        title="A ordem dos acontecimentos"
        description="Toque em um evento para ver período, local, personagens e passagens relacionadas."
      />

      <ol className="relative border-l border-border pl-6">
        {timeline.map((e) => {
          const active = open === e.id;
          return (
            <li key={e.id} className="relative pb-3">
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[31px] top-5 grid size-6 place-items-center rounded-full text-xs",
                  active ? "bg-gold" : "bg-secondary",
                )}
              >
                {e.emoji}
              </span>
              <button
                type="button"
                onClick={() => setOpen(active ? null : e.id)}
                className={cn(
                  "w-full rounded-3xl border p-4 text-left transition-colors",
                  active ? "border-gold/50 bg-gold/10" : "border-border/70 bg-card hover:bg-secondary/60",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{e.title}</h2>
                  <Pill>{e.period}</Pill>
                </div>
                {active ? (
                  <div className="mt-3 space-y-3 text-sm">
                    <p className="leading-relaxed text-muted-foreground">{e.description}</p>
                    <p>
                      <span className="font-medium">🌎 Localização:</span> {e.place}
                    </p>
                    <p>
                      <span className="font-medium">📖 Passagens:</span> {e.passages.join(", ")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {e.characters.map((c) => (
                        <Pill key={c}>👤 {c}</Pill>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      🗺️ O mapa bíblico com estes locais entra nas próximas atualizações.
                    </p>
                  </div>
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
