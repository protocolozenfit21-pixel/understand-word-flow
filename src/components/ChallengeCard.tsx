import { Link } from "@tanstack/react-router";
import type { Challenge } from "@/types";
import { useAppState } from "@/lib/store";
import { Pill, ProgressBar } from "./ui-bits";

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const day = useAppState((s) => s.challengeProgress[challenge.id]);
  const joined = day !== undefined;
  const next = challenge.plan[0];

  return (
    <Link
      to="/desafios/$challengeId"
      params={{ challengeId: challenge.id }}
      className="group flex flex-col rounded-3xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-xl">{challenge.emoji}</span>
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug">{challenge.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{challenge.description}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Pill>📅 {challenge.days} dias</Pill>
        <Pill>📖 {challenge.readings} leituras</Pill>
        <Pill>⏱️ {challenge.minutesPerDay} min/dia</Pill>
      </div>

      {joined ? (
        <div className="mt-4">
          <ProgressBar value={day} max={challenge.days} tone="gold" />
          <p className="mt-2 text-xs text-muted-foreground">
            Dia {day} de {challenge.days} · Próxima leitura: {next?.reference ?? "—"}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-xs font-medium text-primary">Começar quando você quiser →</p>
      )}
    </Link>
  );
}
