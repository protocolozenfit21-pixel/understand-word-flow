import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { dailyMessage } from "@/data/content";
import { actions, useAppState } from "@/lib/store";
import { Pill } from "./ui-bits";

export function DailyMessageCard() {
  const done = useAppState((s) => s.completedDailyChallenges.includes(new Date().toISOString().slice(0, 10)));

  return (
    <section className="overflow-hidden rounded-3xl border border-border/70 bg-primary text-primary-foreground shadow-[var(--shadow-lift)]">
      <div className="p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">☀️ Mensagem de hoje</p>

        <blockquote className="mt-4 font-scripture text-xl leading-relaxed md:text-2xl">
          “{dailyMessage.verse}”
        </blockquote>
        <p className="mt-2 text-sm opacity-70">{dailyMessage.reference}</p>

        <div className="mt-6 space-y-4 rounded-2xl bg-background/10 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">💡 Reflexão</p>
            <p className="mt-1.5 text-sm leading-relaxed opacity-95">{dailyMessage.reflection}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">🙏 Oração (opcional)</p>
            <p className="mt-1.5 text-sm leading-relaxed opacity-95">{dailyMessage.prayer}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">🎯 Desafio de hoje</p>
            <p className="mt-1.5 text-sm leading-relaxed opacity-95">{dailyMessage.challenge}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {dailyMessage.route ? (
            <Link
              to="/biblia/$book/$chapter"
              params={{ book: dailyMessage.route.book, chapter: String(dailyMessage.route.chapter) }}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-gold-foreground transition-transform hover:scale-[1.02]"
            >
              📖 Ler a passagem
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => actions.completeDailyChallenge()}
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-primary-foreground/10"
          >
            {done ? (
              <>
                <Check className="size-4" /> Desafio concluído
              </>
            ) : (
              "✅ Marcar desafio como feito"
            )}
          </button>
          {done ? <Pill tone="gold">Bonito trabalho hoje</Pill> : null}
        </div>
      </div>
    </section>
  );
}
