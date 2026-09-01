import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  max = 100,
  className,
  tone = "primary",
}: {
  value: number;
  max?: number;
  className?: string;
  tone?: "primary" | "gold" | "sage";
}) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  const tones = {
    primary: "bg-primary",
    gold: "bg-gold",
    sage: "bg-sage",
  } as const;
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", tones[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function StatCard({
  emoji,
  value,
  label,
}: {
  emoji: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4">
      <div className="text-lg">{emoji}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function SectionCard({
  title,
  eyebrow,
  children,
  className,
  footer,
}: {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] md:p-6",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
      ) : null}
      {title ? <h2 className="mb-3 text-lg font-semibold">{title}</h2> : null}
      {children}
      {footer ? <div className="mt-4">{footer}</div> : null}
    </section>
  );
}

export function Pill({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "gold" | "sage" | "primary" }) {
  const tones = {
    muted: "bg-secondary text-secondary-foreground",
    gold: "bg-gold/25 text-gold-foreground dark:text-gold",
    sage: "bg-sage/20 text-sage-foreground dark:text-sage",
    primary: "bg-primary/10 text-primary",
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

export function StreakBadge({ days }: { days: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1.5 text-sm font-medium text-gold-foreground dark:text-gold">
      <span aria-hidden>🔥</span>
      {days} dias caminhando na Palavra
    </div>
  );
}

export function EmptyState({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center">
      <div className="text-3xl">{emoji}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
