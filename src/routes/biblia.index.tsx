import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Pill } from "@/components/ui-bits";
import { bookCatalog, TOTAL_CHAPTERS } from "@/data/bible-books";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/biblia/")({
  head: () => ({
    meta: [
      { title: "Bíblia completa — 66 livros em três camadas | Lumen" },
      {
        name: "description",
        content:
          "Todos os 66 livros e 1.189 capítulos da Bíblia para ler com texto bíblico, linguagem atual e explicação com contexto histórico.",
      },
      { property: "og:title", content: "Bíblia completa em três camadas" },
      { property: "og:description", content: "1.189 capítulos com texto tradicional, linguagem simples e explicação." },
    ],
  }),
  component: BibleIndex,
});

function BibleIndex() {
  const [testament, setTestament] = useState<"todos" | "antigo" | "novo">("todos");
  const [query, setQuery] = useState("");
  const [openBook, setOpenBook] = useState<string | null>(null);
  const read = useAppState((s) => s.readChapters);

  const term = query.trim().toLowerCase();
  const list = useMemo(
    () =>
      bookCatalog.filter(
        (b) =>
          (testament === "todos" || b.testament === testament) && (!term || b.name.toLowerCase().includes(term)),
      ),
    [testament, term],
  );

  return (
    <div>
      <PageHeader
        eyebrow="📖 Bíblia"
        title="O que você quer ler hoje?"
        description={`Bíblia completa: 66 livros e ${TOTAL_CHAPTERS.toLocaleString("pt-BR")} capítulos. Cada capítulo tem três camadas — o texto bíblico, a mesma passagem em linguagem atual e uma explicação com contexto histórico.`}
      />

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar livro: Gênesis, Salmos, João..."
          className="w-full rounded-2xl border border-input bg-card py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>

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
          const expanded = openBook === book.id;
          const readCount = read.filter((c) => c.startsWith(`${book.id}-`)).length;
          return (
            <div key={book.id} className="rounded-3xl border border-border/70 bg-card p-5">
              <button
                type="button"
                onClick={() => setOpenBook(expanded ? null : book.id)}
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div>
                  <h2 className="font-semibold">{book.name}</h2>
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{book.group}</p>
                </div>
                <Pill>{book.totalChapters} cap.</Pill>
              </button>

              {book.summary ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{book.summary}</p>
              ) : null}

              {readCount > 0 ? (
                <p className="mt-2 text-xs text-sage-foreground dark:text-sage">
                  {readCount} de {book.totalChapters} capítulos lidos
                </p>
              ) : null}

              {expanded ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {Array.from({ length: book.totalChapters }, (_, i) => i + 1).map((n) => (
                    <Link
                      key={n}
                      to="/biblia/$book/$chapter"
                      params={{ book: book.id, chapter: String(n) }}
                      className={cn(
                        "min-w-9 rounded-xl px-2.5 py-1.5 text-center text-sm font-medium transition-colors",
                        read.includes(`${book.id}-${n}`)
                          ? "bg-sage/25 text-sage-foreground dark:text-sage"
                          : "bg-secondary hover:bg-accent",
                      )}
                    >
                      {n}
                    </Link>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpenBook(book.id)}
                  className="mt-4 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  Ver capítulos
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
