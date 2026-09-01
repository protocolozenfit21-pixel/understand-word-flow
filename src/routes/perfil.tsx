import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Pill, ProgressBar, SectionCard, StatCard, StreakBadge } from "@/components/ui-bits";
import { achievements } from "@/data/content";
import { actions, useAppState, useStats, useTheme } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Minha Jornada — progresso e conquistas | Elohim" },
      {
        name: "description",
        content:
          "Acompanhe capítulos lidos, dias de constância, tempo dedicado, conquistas desbloqueadas e preferências de notificação.",
      },
      { property: "og:title", content: "Minha Jornada — progresso e conquistas" },
      { property: "og:description", content: "Veja o quanto você já caminhou na leitura da Bíblia." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const stats = useStats();
  const profile = useAppState((s) => s.profile);
  const notifications = useAppState((s) => s.notifications);
  const { theme, toggle } = useTheme();

  const metricValue: Record<string, number> = {
    readings: stats.chapters,
    streak: stats.streak,
    books: stats.books,
    favorites: stats.favorites,
    journal: stats.journal,
    challenges: stats.challenges,
  };

  return (
    <div>
      <PageHeader
        eyebrow="📊 Minha Jornada"
        title={profile?.name ? `Olá, ${profile.name.split(" ")[0]}` : "Seu progresso"}
        description="Sua caminhada é sua. Estes números existem para encorajar, não para cobrar."
        action={<Link to="/onboarding" className="rounded-full border border-border px-4 py-2 text-sm font-medium">Refazer preferências</Link>}
      />

      <div className="mb-5">
        <StreakBadge days={stats.streak} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard emoji="📖" value={stats.chapters} label="capítulos lidos" />
        <StatCard emoji="🔥" value={stats.streak} label="dias consecutivos" />
        <StatCard emoji="⏱️" value={`${stats.hours}h`} label="tempo dedicado" />
        <StatCard emoji="📚" value={stats.books} label="livros iniciados" />
        <StatCard emoji="❤️" value={stats.favorites} label="versículos salvos" />
        <StatCard emoji="📝" value={stats.journal} label="reflexões escritas" />
        <StatCard emoji="🎯" value={stats.challenges} label="desafios ativos" />
        <StatCard emoji="🗺️" value={useAppState((s) => s.journeyDone.length)} label="etapas da jornada" />
      </div>

      <div className="mt-5 space-y-4">
        <SectionCard eyebrow="🏆 Conquistas" title="O que você já desbloqueou">
          <div className="grid gap-3 sm:grid-cols-2">
            {achievements.map((a) => {
              const value = metricValue[a.metric] ?? 0;
              const unlocked = value >= a.goal;
              return (
                <div
                  key={a.id}
                  className={cn(
                    "rounded-2xl border p-4",
                    unlocked ? "border-gold/50 bg-gold/12" : "border-border/70 bg-background",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{a.emoji}</span>
                    <h3 className="text-sm font-semibold">{a.title}</h3>
                    {unlocked ? <Pill tone="gold">Concluída</Pill> : null}
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{a.description}</p>
                  <ProgressBar value={Math.min(value, a.goal)} max={a.goal} className="mt-3" tone={unlocked ? "gold" : "primary"} />
                  <p className="mt-1.5 text-xs text-muted-foreground tabular-nums">
                    {Math.min(value, a.goal)} / {a.goal}
                  </p>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard eyebrow="🔔 Notificações" title="Quando quer ser lembrado?">
          <div className="space-y-2">
            {(
              [
                { key: "morning", label: "☀️ Mensagem da manhã" },
                { key: "reading", label: "📖 Lembrete de leitura" },
                { key: "streak", label: "🔥 Continue sua sequência" },
                { key: "night", label: "🌙 Reflexão noturna" },
              ] as const
            ).map((n) => (
              <label
                key={n.key}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background p-3.5 text-sm"
              >
                {n.label}
                <input
                  type="checkbox"
                  checked={notifications[n.key]}
                  onChange={(e) => actions.setNotifications({ [n.key]: e.target.checked })}
                  className="size-5 accent-[var(--primary)]"
                />
              </label>
            ))}
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background p-3.5 text-sm">
              ⏰ Horário preferido
              <input
                type="time"
                value={notifications.hour}
                onChange={(e) => actions.setNotifications({ hour: e.target.value })}
                className="rounded-lg border border-input bg-card px-2 py-1 text-sm"
              />
            </label>
          </div>
        </SectionCard>

        <SectionCard eyebrow="🎨 Aparência" title="Modo claro ou escuro">
          <button
            type="button"
            onClick={toggle}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium"
          >
            {theme === "dark" ? "☀️ Ativar modo claro" : "🌙 Ativar modo escuro"}
          </button>
        </SectionCard>

        <SectionCard eyebrow="Atalhos" title="Suas áreas pessoais">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { to: "/favoritos", label: "❤️ Meus Versículos" },
              { to: "/diario", label: "📝 Meu Diário" },
              { to: "/ouvir", label: "🎧 Ouvir Bíblia" },
              { to: "/timeline", label: "🕰️ História da Bíblia" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-2xl border border-border/70 bg-background p-4 text-sm font-medium transition-colors hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard eyebrow="👥 Comunidade" title="Em breve">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Grupos de leitura, discussões e pedidos de oração — com moderação e regras claras de convivência entre
            diferentes denominações.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
