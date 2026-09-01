import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { actions } from "@/lib/store";
import { ProgressBar } from "@/components/ui-bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Vamos começar juntos — Elohim" },
      {
        name: "description",
        content: "Conte um pouco sobre o seu momento e receba uma jornada de leitura da Bíblia feita para você.",
      },
      { property: "og:title", content: "Vamos começar juntos — Elohim" },
      { property: "og:description", content: "Personalize sua jornada de leitura da Bíblia em três passos." },
    ],
  }),
  component: Onboarding,
});

const experiences = [
  { id: "nunca", label: "Nunca li", emoji: "🌱" },
  { id: "partes", label: "Li algumas partes", emoji: "📖" },
  { id: "comecando", label: "Estou começando agora", emoji: "🚶" },
  { id: "bastante", label: "Já conheço bastante", emoji: "📚" },
];

const goals = [
  { id: "deus", label: "Me aproximar de Deus", emoji: "🙏" },
  { id: "conhecer", label: "Conhecer melhor a Bíblia", emoji: "📖" },
  { id: "entender", label: "Entender passagens difíceis", emoji: "🧠" },
  { id: "habito", label: "Criar o hábito de leitura", emoji: "🔥" },
  { id: "conforto", label: "Encontrar conforto", emoji: "❤️" },
  { id: "caminhada", label: "Começar minha caminhada", emoji: "✝️" },
];

const stylesOptions = [
  { id: "lendo", label: "Lendo", emoji: "📖" },
  { id: "ouvindo", label: "Ouvindo", emoji: "🎧" },
  { id: "perguntas", label: "Respondendo perguntas", emoji: "🧠" },
  { id: "refletindo", label: "Refletindo e escrevendo", emoji: "✍️" },
];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [goal, setGoal] = useState("");
  const [styles, setStyles] = useState<string[]>([]);

  const canAdvance = [name.trim().length > 0, experience !== "", goal !== "", styles.length > 0][step];

  function finish() {
    actions.saveProfile({
      name: name.trim() || "amigo",
      experience,
      goal,
      styles,
      completedAt: new Date().toISOString(),
    });
    navigate({ to: "/comecar" });
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 py-8">
      <div className="flex items-center gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            aria-label="Voltar"
            className="grid size-9 place-items-center rounded-full bg-secondary"
          >
            <ArrowLeft className="size-4" />
          </button>
        ) : null}
        <span className="text-sm font-semibold tracking-tight">Elohim</span>
        <span className="ml-auto text-xs text-muted-foreground">Passo {step + 1} de 4</span>
      </div>
      <ProgressBar value={step + 1} max={4} className="mt-4" />

      <div className="mt-10 flex-1">
        {step === 0 ? (
          <div>
            <h1 className="text-2xl font-semibold">Como podemos te chamar?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sua jornada é pessoal. Nada aqui é comparado com outras pessoas.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="mt-6 w-full rounded-2xl border border-input bg-card px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
        ) : null}

        {step === 1 ? (
          <Choices
            title="Você já leu a Bíblia?"
            subtitle="Não existe resposta errada — isso só nos ajuda a ajustar o ritmo."
            options={experiences}
            value={[experience]}
            onSelect={(id) => setExperience(id)}
          />
        ) : null}

        {step === 2 ? (
          <Choices
            title="Qual é o seu objetivo?"
            subtitle="Vamos recomendar leituras e desafios com base nisso."
            options={goals}
            value={[goal]}
            onSelect={(id) => setGoal(id)}
          />
        ) : null}

        {step === 3 ? (
          <Choices
            title="Como você prefere aprender?"
            subtitle="Pode escolher mais de uma opção."
            options={stylesOptions}
            value={styles}
            onSelect={(id) => setStyles((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))}
          />
        ) : null}
      </div>

      <button
        type="button"
        disabled={!canAdvance}
        onClick={() => (step === 3 ? finish() : setStep((s) => s + 1))}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
      >
        {step === 3 ? "Ver minha jornada" : "Continuar"} <ArrowRight className="size-4" />
      </button>
    </div>
  );
}

function Choices({
  title,
  subtitle,
  options,
  value,
  onSelect,
}: {
  title: string;
  subtitle: string;
  options: { id: string; label: string; emoji: string }[];
  value: string[];
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-6 space-y-2.5">
        {options.map((o) => {
          const active = value.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onSelect(o.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left text-[15px] font-medium transition-colors",
                active ? "border-primary bg-primary/8" : "border-border bg-card hover:bg-secondary",
              )}
            >
              <span className="text-xl">{o.emoji}</span>
              {o.label}
              {active ? <Check className="ml-auto size-4 text-primary" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
