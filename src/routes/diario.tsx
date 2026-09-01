import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { EmptyState, SectionCard } from "@/components/ui-bits";
import { actions, useAppState } from "@/lib/store";

export const Route = createFileRoute("/diario")({
  head: () => ({
    meta: [
      { title: "Meu Diário espiritual — reflexões pessoais | Lumen" },
      {
        name: "description",
        content: "Escreva o que você refletiu em cada leitura e acompanhe sua timeline pessoal de crescimento.",
      },
      { property: "og:title", content: "Meu Diário espiritual" },
      { property: "og:description", content: "Uma timeline com suas reflexões, leitura por leitura." },
    ],
  }),
  component: Diario,
});

const formatter = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" });

function Diario() {
  const journal = useAppState((s) => s.journal);
  const notes = useAppState((s) => s.notes);
  const [reference, setReference] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="📝 Meu Diário"
        title="O que ficou de cada leitura"
        description="Escrever ajuda a lembrar. Estas reflexões ficam só com você."
      />

      <SectionCard title="Nova reflexão" className="mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!content.trim()) return;
            actions.addJournal({ reference: reference.trim() || "Reflexão livre", content: content.trim() });
            setContent("");
            setReference("");
            toast.success("Reflexão salva");
          }}
        >
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Referência (ex.: Mateus 5)"
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Hoje percebi que preciso..."
            className="mt-2 w-full rounded-2xl border border-input bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
          <button type="submit" className="mt-3 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Salvar no diário
          </button>
        </form>
      </SectionCard>

      <h2 className="mb-3 text-lg font-semibold">Sua timeline</h2>
      {journal.length === 0 ? (
        <EmptyState
          emoji="📖"
          title="Seu diário está começando"
          description="Depois de cada leitura, o app pergunta o que você refletiu. Suas respostas aparecem aqui."
        />
      ) : (
        <ol className="relative space-y-3 border-l border-border pl-5">
          {journal.map((entry) => (
            <li key={entry.id} className="relative rounded-3xl border border-border/70 bg-card p-5">
              <span aria-hidden className="absolute -left-[26px] top-6 size-2.5 rounded-full bg-gold" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    📅 {formatter.format(new Date(entry.createdAt))}
                  </p>
                  <p className="mt-1 text-sm font-medium">📖 {entry.reference}</p>
                </div>
                <button
                  type="button"
                  aria-label="Excluir reflexão"
                  onClick={() => actions.removeJournal(entry.id)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed">{entry.content}</p>
            </li>
          ))}
        </ol>
      )}

      {notes.length > 0 ? (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Anotações em versículos</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {notes.map((n) => (
              <div key={n.id} className="rounded-2xl border border-border/70 bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">{n.reference}</p>
                <p className="mt-2 text-sm leading-relaxed">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
