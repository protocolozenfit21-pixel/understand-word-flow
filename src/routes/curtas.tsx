import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Clock } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Pill } from "@/components/ui-bits";
import { shortReadings } from "@/data/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/curtas")({
  head: () => ({
    meta: [
      { title: "Tenho apenas 5 minutos — leituras curtas | Elohim" },
      {
        name: "description",
        content: "Leituras de 5, 10 ou 20 minutos com texto bíblico, explicação simples e uma reflexão para o dia.",
      },
      { property: "og:title", content: "Leituras curtas da Bíblia" },
      { property: "og:description", content: "Você não precisa de horas por dia para começar a ler a Bíblia." },
    ],
  }),
  component: Curtas,
});

const options = [5, 10, 20] as const;

function Curtas() {
  const [minutes, setMinutes] = useState<(typeof options)[number]>(5);
  const list = shortReadings.filter((r) => r.minutes === minutes);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="⏱️ Leituras curtas"
        title="Quanto tempo você tem hoje?"
        description="Você não precisa ler horas por dia para começar. Escolha um tempo e siga."
      />

      <div className="mb-5 flex gap-1.5 rounded-full border border-border/70 bg-card p-1.5">
        {options.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMinutes(m)}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              minutes === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary",
            )}
          >
            ⏱️ {m} minutos
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((r) => (
          <article key={r.id} className="rounded-3xl border border-border/70 bg-card p-5">
            <Pill tone="gold">
              <Clock className="size-3" /> {r.minutes} min
            </Pill>
            <h2 className="mt-3 font-semibold">{r.title}</h2>
            <p className="text-sm text-muted-foreground">{r.reference}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.why}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Pill>📖 Leitura</Pill>
              <Pill>💡 Explicação</Pill>
              <Pill>🤔 Reflexão</Pill>
            </div>
            <Link
              to="/biblia/$book/$chapter"
              params={{ book: r.route.book, chapter: String(r.route.chapter) }}
              className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              ▶️ Começar
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
