import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { JourneyMap } from "@/components/JourneyMap";
import { ProgressBar } from "@/components/ui-bits";
import { journey } from "@/data/content";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/jornada/")({
  head: () => ({
    meta: [
      { title: "Jornada Bíblica — da Criação ao Apocalipse | Lumen" },
      {
        name: "description",
        content:
          "Um mapa de progresso que ensina a história da Bíblia em ordem: Criação, patriarcas, Moisés, reis, profetas, Jesus e a igreja primitiva.",
      },
      { property: "og:title", content: "Jornada Bíblica — da Criação ao Apocalipse" },
      { property: "og:description", content: "Entenda a história da Bíblia etapa por etapa, com contexto e reflexão." },
    ],
  }),
  component: Jornada,
});

function Jornada() {
  const done = useAppState((s) => s.journeyDone);

  return (
    <div>
      <PageHeader
        eyebrow="🗺️ Jornada Bíblica"
        title="A história da Bíblia, na ordem"
        description="Cada etapa traz uma leitura, o contexto histórico, os personagens envolvidos e uma reflexão."
        action={
          <Link to="/timeline" className="rounded-full border border-border px-4 py-2 text-sm font-medium">
            🕰️ Ver linha do tempo
          </Link>
        }
      />

      <div className="mx-auto mb-6 max-w-2xl rounded-3xl border border-border/70 bg-card p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Seu progresso na jornada</span>
          <span className="text-muted-foreground tabular-nums">
            {done.length} de {journey.length} etapas
          </span>
        </div>
        <ProgressBar value={done.length} max={journey.length} className="mt-3" tone="sage" />
      </div>

      <JourneyMap />
    </div>
  );
}
