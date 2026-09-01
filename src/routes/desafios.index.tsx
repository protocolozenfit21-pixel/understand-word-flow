import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { ChallengeCard } from "@/components/ChallengeCard";
import { Pill, ProgressBar } from "@/components/ui-bits";
import { challenges } from "@/data/content";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/desafios/")({
  head: () => ({
    meta: [
      { title: "Desafios de leitura da Bíblia — Elohim" },
      {
        name: "description",
        content:
          "Bíblia em 1 ano, Novo Testamento em 90 dias, Salmos, Provérbios e desafios temáticos de 7 a 30 dias com progresso visual.",
      },
      { property: "og:title", content: "Desafios de leitura da Bíblia" },
      { property: "og:description", content: "Escolha um plano no seu ritmo e acompanhe o progresso dia a dia." },
    ],
  }),
  component: Desafios,
});

function Desafios() {
  const main = challenges.find((c) => c.featured)!;
  const day = useAppState((s) => s.challengeProgress[main.id] ?? 0);
  const streak = useAppState((s) => s.streak);

  return (
    <div>
      <PageHeader
        eyebrow="🎯 Desafios"
        title="Escolha um caminho e siga no seu ritmo"
        description="Nada aqui é uma corrida. Os desafios existem para dar direção e constância à sua leitura."
      />

      <section className="mb-6 overflow-hidden rounded-3xl border border-border/70 bg-primary p-6 text-primary-foreground shadow-[var(--shadow-lift)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">Desafio principal</p>
        <h2 className="mt-2 text-2xl font-semibold">
          {main.emoji} {main.title}
        </h2>
        <p className="mt-1 text-sm opacity-80">
          📅 Dia {day} de {main.days}
        </p>

        <div className="mt-5 rounded-2xl bg-background/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">📖 Leitura de hoje</p>
          <ul className="mt-3 space-y-2">
            {main.plan.map((item) => (
              <li key={item.title} className="flex items-center justify-between gap-3 text-sm">
                <span className="opacity-80">{item.title}</span>
                <span className="font-medium">{item.reference}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-background/20">
            <div className="h-full rounded-full bg-gold" style={{ width: `${(day / main.days) * 100}%` }} />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs opacity-80">
            <span>
              {day} de {main.days} dias
            </span>
            <span>🔥 {streak} dias de sequência</span>
          </div>
        </div>

        <Link
          to="/desafios/$challengeId"
          params={{ challengeId: main.id }}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-gold-foreground"
        >
          ▶️ Começar leitura de hoje
        </Link>
      </section>

      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-lg font-semibold">Outros desafios</h2>
        <Pill tone="sage">Do rápido ao profundo</Pill>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {challenges
          .filter((c) => !c.featured)
          .map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
      </div>

      <section className="mt-8 rounded-3xl border border-dashed border-border p-6">
        <h2 className="font-semibold">📖 Desafio em grupo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Em breve você poderá convidar amigos e acompanhar o progresso do grupo.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-secondary/60 p-4">
            <p className="text-sm font-medium">Novo Testamento em 90 dias · 👥 12 participantes</p>
            <p className="mt-2 text-xs text-muted-foreground">Seu progresso</p>
            <ProgressBar value={42} tone="gold" className="mt-1" />
          </div>
          <div className="rounded-2xl bg-secondary/60 p-4">
            <p className="text-sm font-medium">Progresso do grupo</p>
            <ProgressBar value={35} className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">Com moderação e regras de convivência.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
