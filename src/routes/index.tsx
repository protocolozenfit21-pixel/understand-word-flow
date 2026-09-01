import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Compass, HelpCircle, Play } from "lucide-react";
import { DailyMessageCard } from "@/components/DailyMessageCard";
import { ChallengeCard } from "@/components/ChallengeCard";
import { Pill, ProgressBar, StatCard, StreakBadge } from "@/components/ui-bits";
import { challenges, shortReadings, themes } from "@/data/content";
import { useAppState, useStats } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen — Leia e entenda a Bíblia em poucos minutos por dia" },
      {
        name: "description",
        content:
          "Mensagem diária, leitura em três camadas, desafios e progresso. Comece sua jornada pela Bíblia mesmo sem saber por onde começar.",
      },
      { property: "og:title", content: "Lumen — Leia e entenda a Bíblia" },
      {
        property: "og:description",
        content: "Texto bíblico, linguagem atual e explicação lado a lado, com hábito diário e desafios.",
      },
    ],
  }),
  component: Home,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function Home() {
  const profile = useAppState((s) => s.profile);
  const lastRead = useAppState((s) => s.lastRead);
  const stats = useStats();
  const mainChallenge = challenges.find((c) => c.featured)!;
  const challengeDay = useAppState((s) => s.challengeProgress[mainChallenge.id] ?? 0);
  const name = profile?.name?.split(" ")[0] ?? "amigo";

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-muted-foreground">Que bom ter você aqui.</p>
        <h1 className="mt-1 text-2xl font-semibold md:text-3xl">
          {greeting()}, {name}! 👋
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StreakBadge days={stats.streak} />
          <Pill tone="sage">Continue sua caminhada</Pill>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">📖 Continue sua jornada</p>
          <h2 className="mt-3 font-scripture text-2xl">
            {lastRead ? `${lastRead.bookName} ${lastRead.chapter}:${lastRead.verse}` : "Salmos 23"}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Você parou aqui. Retome de onde estava — cinco minutos já contam.
          </p>
          <Link
            to="/biblia/$book/$chapter"
            params={{
              book: lastRead?.book ?? "salmos",
              chapter: String(lastRead?.chapter ?? 23),
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <Play className="size-4" /> Continuar leitura
          </Link>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <StatCard emoji="📖" value={stats.chapters} label="capítulos lidos" />
            <StatCard emoji="⏱️" value={`${stats.hours}h`} label="dedicadas" />
            <StatCard emoji="🔥" value={stats.streak} label="dias seguidos" />
          </div>
        </section>

        <Link
          to="/comecar"
          className="group flex flex-col justify-between rounded-3xl border border-gold/50 bg-gold/15 p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
        >
          <div>
            <span className="grid size-11 place-items-center rounded-2xl bg-gold/40 text-xl">
              <HelpCircle className="size-5 text-gold-foreground" />
            </span>
            <h2 className="mt-4 text-xl font-semibold">📖 Não sei por onde começar</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Responda duas perguntas rápidas e receba uma jornada feita para o seu momento — sem pressa e sem
              vocabulário complicado.
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Descobrir minha jornada <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>

      <DailyMessageCard />

      <section className="rounded-3xl border border-border/70 bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">🎯 Desafio principal</p>
            <h2 className="mt-2 text-lg font-semibold">{mainChallenge.title}</h2>
          </div>
          <Pill tone="gold">
            Dia {challengeDay} de {mainChallenge.days}
          </Pill>
        </div>
        <ProgressBar value={challengeDay} max={mainChallenge.days} className="mt-4" tone="gold" />
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {mainChallenge.plan.map((item) => (
            <div key={item.title} className="rounded-2xl bg-secondary/70 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{item.title}</p>
              <p className="mt-1 text-sm font-medium">{item.reference}</p>
            </div>
          ))}
        </div>
        <Link
          to="/desafios/$challengeId"
          params={{ challengeId: mainChallenge.id }}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          ▶️ Começar leitura de hoje
        </Link>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">⏱️ Tenho apenas 5 minutos</h2>
            <p className="text-sm text-muted-foreground">Leituras curtas, com explicação e reflexão.</p>
          </div>
          <Link to="/curtas" className="text-sm font-medium text-primary">
            Ver todas
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {shortReadings.slice(0, 3).map((r) => (
            <Link
              key={r.id}
              to="/biblia/$book/$chapter"
              params={{ book: r.route.book, chapter: String(r.route.chapter) }}
              className="rounded-3xl border border-border/70 bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <Pill>
                <Clock className="size-3" /> {r.minutes} min
              </Pill>
              <h3 className="mt-3 font-semibold">{r.title}</h3>
              <p className="text-sm text-muted-foreground">{r.reference}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Como você está hoje?</h2>
        <div className="flex flex-wrap gap-2">
          {themes.slice(0, 8).map((t) => (
            <Link
              key={t.id}
              to="/buscar"
              search={{ q: t.name }}
              className="rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              {t.emoji} {t.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold">Desafios para você</h2>
          <Link to="/desafios" className="text-sm font-medium text-primary">
            Ver todos
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {challenges.slice(1, 4).map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      </section>

      <Link
        to="/jornada"
        className="flex items-center gap-4 rounded-3xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
      >
        <span className="grid size-12 place-items-center rounded-2xl bg-secondary">
          <Compass className="size-5" />
        </span>
        <div>
          <h2 className="font-semibold">🗺️ Jornada Bíblica</h2>
          <p className="text-sm text-muted-foreground">
            Da Criação ao Apocalipse, na ordem — com contexto e reflexão em cada etapa.
          </p>
        </div>
        <ArrowRight className="ml-auto size-5 text-muted-foreground" />
      </Link>
    </div>
  );
}
