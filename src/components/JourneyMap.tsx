import { Link } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";
import { journey } from "@/data/content";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

export function JourneyMap() {
  const done = useAppState((s) => s.journeyDone);
  const currentIndex = journey.findIndex((s) => !done.includes(s.id));

  return (
    <ol className="relative mx-auto max-w-2xl">
      {journey.map((step, i) => {
        const isDone = done.includes(step.id);
        const isCurrent = i === currentIndex;
        const locked = !isDone && !isCurrent;
        const align = i % 2 === 0 ? "md:pr-20" : "md:pl-20";

        return (
          <li key={step.id} className={cn("relative pb-4", align)}>
            {i < journey.length - 1 ? (
              <span
                aria-hidden
                className={cn("absolute left-7 top-16 h-[calc(100%-3rem)] w-0.5 rounded", isDone ? "bg-sage" : "bg-border")}
              />
            ) : null}

            <Link
              to="/jornada/$stepId"
              params={{ stepId: step.id }}
              className={cn(
                "flex items-start gap-4 rounded-3xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]",
                isCurrent ? "border-gold bg-gold/10" : "border-border/70 bg-card",
                locked && "opacity-70",
              )}
            >
              <span
                className={cn(
                  "grid size-14 shrink-0 place-items-center rounded-2xl text-2xl",
                  isDone ? "bg-sage/25" : isCurrent ? "bg-gold/30" : "bg-secondary",
                )}
              >
                {isDone ? <Check className="size-6 text-sage-foreground dark:text-sage" /> : step.emoji}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{step.title}</h3>
                  {locked ? <Lock className="size-3.5 text-muted-foreground" /> : null}
                </div>
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{step.era}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.summary}</p>
                <p className="mt-2 text-xs font-medium text-primary">📖 {step.reading}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
