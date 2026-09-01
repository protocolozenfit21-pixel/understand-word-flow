import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { Pill } from "@/components/ui-bits";
import { books } from "@/data/bible";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/biblia/")({
  head: () => ({
    meta: [
      { title: "Bíblia — leitura em três camadas | Lumen" },
      {
        name: "description",
        content:
          "Escolha um livro e leia com texto bíblico, linguagem atual e explicação com contexto histórico lado a lado.",
      },
      { property: "og:title", content: "Bíblia em três camadas" },
      { property: "og:description", content: "Texto tradicional, linguagem simples e explicação em cada capítulo." },
    ],
  }),
  component: BibleIndex,
});

function BibleIndex() {
  const [testament, setTestament] = useState<"todos" | "antigo" | "novo">("todos");
  const read = useAppState((s) => s.readChapters);
  const list = books.filter((b) => testament === "todos" || b.testament === testament);

  return (
    <div>
      <PageHeader
        eyebrow="📖 Bíblia"
        title="O que você quer ler hoje?"
        description="Cada capítulo tem três camadas: o texto bíblico, a mesma passagem em linguagem atual e uma explicação com contexto histórico."
      />

      <div className="mb-5 flex gap-1.5 rounded-full border border-border/70 bg-card p-1.5">
        {(
          [
            { id: "todos", label: "Todos" },
            { id: "antigo", label: "Antigo Testamento" },
            { id: "novo", label: "Novo Testamento" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTestament(t.id)}
            className={cn(
              "flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
              testament === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {list.map((book) => {
          const available = book.chapters.map((c) => c.number);
          return (
            <div key={book.id} className="rounded-3xl border border-border/70 bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{book.name}</h2>
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{book.group}</p>
                </div>
                <Pill>{book.totalChapters} cap.</Pill>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{book.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {available.map((n) => (
                  <Link
                    key={n}
                    to="/biblia/$book/$chapter"
                    params={{ book: book.id, chapter: String(n) }}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
                      read.includes(`${book.id}-${n}`)
                        ? "bg-sage/25 text-sage-foreground dark:text-sage"
                        : "bg-secondary hover:bg-accent",
                    )}
                  >
                    {n}
                  </Link>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Capítulos disponíveis nesta versão do app. Novos capítulos e traduções entram progressivamente.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
