import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { Pill, SectionCard } from "@/components/ui-bits";
import { startPaths } from "@/data/content";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/comecar")({
  head: () => ({
    meta: [
      { title: "Não sei por onde começar — Lumen" },
      {
        name: "description",
        content: "Duas perguntas e você recebe uma jornada de leitura da Bíblia adequada ao seu momento e objetivo.",
      },
      { property: "og:title", content: "Não sei por onde começar a ler a Bíblia" },
      { property: "og:description", content: "Descubra uma jornada personalizada de 5 dias para começar hoje." },
    ],
  }),
  component: Comecar,
});

const experiences = [
  { id: "nunca", label: "Nunca li", emoji: "🔘" },
  { id: "partes", label: "Li algumas partes", emoji: "🔘" },
  { id: "comecando", label: "Estou começando agora", emoji: "🔘" },
  { id: "bastante", label: "Já conheço bastante", emoji: "🔘" },
];

const goals = [
  { id: "deus", label: "Me aproximar de Deus", emoji: "🙏", path: "iniciante" },
  { id: "conhecer", label: "Conhecer melhor a Bíblia", emoji: "📖", path: "iniciante" },
  { id: "entender", label: "Entender passagens difíceis", emoji: "🧠", path: "profundidade" },
  { id: "habito", label: "Criar o hábito de leitura", emoji: "🔥", path: "habito" },
  { id: "conforto", label: "Encontrar conforto", emoji: "❤️", path: "conforto" },
  { id: "caminhada", label: "Começar minha caminhada", emoji: "✝️", path: "iniciante" },
];

function Comecar() {
  const profile = useAppState((s) => s.profile);
  const [experience, setExperience] = useState(profile?.experience ?? "");
  const [goal, setGoal] = useState(profile?.goal ?? "");

  const pathKey = goal
    ? (goals.find((g) => g.id === goal)?.path ?? "iniciante")
    : experience === "bastante"
      ? "profundidade"
      : "";
  const path = pathKey ? startPaths[pathKey] : undefined;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="📖 Comece por aqui"
        title="Não sei por onde começar"
        description="Muita gente quer ler a Bíblia e desiste porque não sabe onde entrar. Vamos resolver isso em duas perguntas."
      />

      <div className="space-y-4">
        <SectionCard title="Você já leu a Bíblia?">
          <div className="grid gap-2 sm:grid-cols-2">
            {experiences.map((o) => (
              <Option key={o.id} active={experience === o.id} onClick={() => setExperience(o.id)} label={o.label} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Qual é o seu objetivo?">
          <div className="grid gap-2 sm:grid-cols-2">
            {goals.map((o) => (
              <Option key={o.id} active={goal === o.id} onClick={() => setGoal(o.id)} label={`${o.emoji} ${o.label}`} />
            ))}
          </div>
        </SectionCard>

        {path ? (
          <SectionCard eyebrow="Sua jornada recomendada" title={`${path.emoji} ${path.title}`}>
            <p className="text-sm text-muted-foreground">
              Cinco dias curtos, cada um com texto, linguagem atual, explicação e uma reflexão.
            </p>
            <ol className="mt-4 space-y-2">
              {path.steps.map((s) => (
                <li key={s.day} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-semibold">
                    {s.day}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.reference}</p>
                  </div>
                  {s.route ? (
                    <Link
                      to="/biblia/$book/$chapter"
                      params={{ book: s.route.book, chapter: String(s.route.chapter) }}
                      className="ml-auto rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      Ler
                    </Link>
                  ) : (
                    <Pill>Guia</Pill>
                  )}
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/desafios/$challengeId"
                params={{ challengeId: "habito-30" }}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                🌱 Ativar desafio de hábito
              </Link>
              <Link to="/jornada" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium">
                🗺️ Ver a jornada completa
              </Link>
            </div>
          </SectionCard>
        ) : (
          <p className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Responda as duas perguntas acima para ver sua jornada recomendada.
          </p>
        )}
      </div>
    </div>
  );
}

function Option({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-colors",
        active ? "border-primary bg-primary/8" : "border-border bg-background hover:bg-secondary",
      )}
    >
      {label}
    </button>
  );
}
