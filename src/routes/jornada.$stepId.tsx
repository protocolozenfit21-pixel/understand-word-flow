import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Pill, SectionCard } from "@/components/ui-bits";
import { journey } from "@/data/content";
import { actions, useAppState } from "@/lib/store";

export const Route = createFileRoute("/jornada/$stepId")({
  loader: ({ params }) => {
    const step = journey.find((s) => s.id === params.stepId);
    if (!step) throw notFound();
    return { title: step.title, summary: step.summary, era: step.era };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Etapa não encontrada — Elohim" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.title} — ${loaderData.era} | Jornada Bíblica` },
        { name: "description", content: loaderData.summary },
        { property: "og:title", content: `${loaderData.title} — Jornada Bíblica` },
        { property: "og:description", content: loaderData.summary },
      ],
    };
  },
  component: JourneyStepPage,
});

function JourneyStepPage() {
  const { stepId } = Route.useParams();
  const step = journey.find((s) => s.id === stepId);
  const done = useAppState((s) => s.journeyDone.includes(stepId));

  if (!step) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/jornada" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <ArrowLeft className="size-4" /> Jornada
      </Link>

      <PageHeader eyebrow={`${step.emoji} ${step.era}`} title={step.title} description={step.summary} />

      <div className="space-y-4">
        <SectionCard eyebrow="📖 Leitura desta etapa" title={step.reading}>
          {step.route ? (
            <Link
              to="/biblia/$book/$chapter"
              params={{ book: step.route.book, chapter: String(step.route.chapter) }}
              className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              ▶️ Abrir leitura
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">
              Esta etapa é um guia introdutório. A leitura completa entra nas próximas atualizações.
            </p>
          )}
        </SectionCard>

        <SectionCard eyebrow="📚 Contexto histórico" title="O que estava acontecendo">
          <p className="text-sm leading-relaxed">{step.context}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {step.characters.map((c) => (
              <Pill key={c}>👤 {c}</Pill>
            ))}
          </div>
        </SectionCard>

        <SectionCard eyebrow="🤔 Reflexão" title={step.reflection}>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {step.questions.map((q) => (
              <li key={q} className="rounded-xl bg-secondary/60 p-3">
                {q}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Perguntas opcionais — sem certo ou errado.</p>
        </SectionCard>

        <button
          type="button"
          onClick={() => {
            actions.completeJourneyStep(stepId);
            toast.success("Etapa concluída", { description: "Sua jornada avançou um passo." });
          }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          {done ? <Check className="size-4" /> : null} {done ? "Etapa concluída" : "✅ Marcar etapa como concluída"}
        </button>
      </div>
    </div>
  );
}
