import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Pill, ProgressBar, SectionCard, StatCard } from "@/components/ui-bits";
import { getChallenge } from "@/data/content";
import { actions, useAppState } from "@/lib/store";

export const Route = createFileRoute("/desafios/$challengeId")({
  loader: ({ params }) => {
    const challenge = getChallenge(params.challengeId);
    if (!challenge) throw notFound();
    return { title: challenge.title, description: challenge.description, days: challenge.days };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Desafio não encontrado — Lumen" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.title} — desafio de ${loaderData.days} dias | Lumen` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: `${loaderData.title} · ${loaderData.days} dias` },
        { property: "og:description", content: loaderData.description },
      ],
    };
  },
  component: ChallengeDetail,
});

function ChallengeDetail() {
  const { challengeId } = Route.useParams();
  const challenge = getChallenge(challengeId);
  const day = useAppState((s) => s.challengeProgress[challengeId]);

  if (!challenge) return null;
  const joined = day !== undefined;
  const current = day ?? 0;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/desafios" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <ArrowLeft className="size-4" /> Desafios
      </Link>

      <PageHeader
        eyebrow={`${challenge.emoji} Desafio de ${challenge.days} dias`}
        title={challenge.title}
        description={challenge.description}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard emoji="📅" value={`${challenge.days}`} label="dias" />
        <StatCard emoji="📖" value={challenge.readings} label="leituras" />
        <StatCard emoji="⏱️" value={`${challenge.minutesPerDay} min`} label="por dia" />
        <StatCard emoji="🔥" value={joined ? current : "—"} label="seu dia atual" />
      </div>

      <div className="mt-5 space-y-4">
        <SectionCard title="Seu progresso">
          <ProgressBar value={current} max={challenge.days} tone="gold" />
          <p className="mt-2 text-sm text-muted-foreground">
            {joined
              ? `Dia ${current} de ${challenge.days}. Continue sua caminhada — um dia por vez.`
              : "Você ainda não começou este desafio. Pode entrar hoje mesmo."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {joined ? (
              <button
                type="button"
                onClick={() => {
                  actions.advanceChallenge(challengeId);
                  toast.success("Dia concluído", { description: "Você está construindo um lindo hábito." });
                }}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                ✅ Concluir o dia
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  actions.joinChallenge(challengeId);
                  toast.success("Desafio iniciado", { description: challenge.title });
                }}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                ▶️ Começar este desafio
              </button>
            )}
            <Link to="/curtas" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium">
              ⏱️ Tenho pouco tempo hoje
            </Link>
          </div>
        </SectionCard>

        <SectionCard title="Próximas leituras">
          <ul className="space-y-2">
            {challenge.plan.map((item, i) => (
              <li
                key={`${item.day}-${item.title}-${i}`}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-background p-3"
              >
                <Pill>Dia {item.day}</Pill>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.reference}</p>
                </div>
                {item.route ? (
                  <Link
                    to="/biblia/$book/$chapter"
                    params={{ book: item.route.book, chapter: String(item.route.chapter) }}
                    className="ml-auto rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    Ler agora
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
