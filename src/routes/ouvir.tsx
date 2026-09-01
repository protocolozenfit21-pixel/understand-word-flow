import { createFileRoute, Link } from "@tanstack/react-router";
import { AudioPlayer } from "@/components/AudioPlayer";
import { PageHeader } from "@/components/AppShell";
import { Pill, SectionCard } from "@/components/ui-bits";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/ouvir")({
  head: () => ({
    meta: [
      { title: "Ouvir a Bíblia e reflexões em áudio — Lumen" },
      {
        name: "description",
        content: "Continue de onde parou, controle a velocidade e ouça reflexões curtas de 3, 5 ou 10 minutos.",
      },
      { property: "og:title", content: "Ouvir a Bíblia" },
      { property: "og:description", content: "Leitura e reflexões em áudio para o trânsito, a caminhada ou o descanso." },
    ],
  }),
  component: Ouvir,
});

const reflections = [
  { minutes: 3, title: "Confiar quando não há clareza", ref: "Baseada em Salmos 23" },
  { minutes: 5, title: "O que fazer com a ansiedade", ref: "Baseada em Filipenses 4" },
  { minutes: 10, title: "Uma vida com outra régua", ref: "Baseada em Mateus 5" },
];

function Ouvir() {
  const lastRead = useAppState((s) => s.lastRead);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="🎧 Ouvir"
        title="Continue ouvindo"
        description="Ideal para o deslocamento, a caminhada ou o fim do dia."
      />

      <div className="space-y-4">
        <AudioPlayer
          title={lastRead ? `${lastRead.bookName} ${lastRead.chapter}` : "Salmos 23"}
          subtitle={lastRead ? `Você parou em ${lastRead.bookName} ${lastRead.chapter}:${lastRead.verse}` : "Comece por aqui"}
        />

        <SectionCard eyebrow="🎙️ Reflexão do dia" title="Áudios curtos relacionados à sua leitura">
          <ul className="space-y-2">
            {reflections.map((r) => (
              <li key={r.title} className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 p-4">
                <div>
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.ref}</p>
                </div>
                <Pill tone="gold">{r.minutes} min</Pill>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Os áudios entram nas próximas atualizações. A estrutura de player e reprodução já está pronta.
          </p>
        </SectionCard>

        <Link to="/biblia" className="inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-medium">
          📖 Prefiro ler agora
        </Link>
      </div>
    </div>
  );
}
