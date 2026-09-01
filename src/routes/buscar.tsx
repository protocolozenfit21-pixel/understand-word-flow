import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { EmptyState, Pill, SectionCard } from "@/components/ui-bits";
import { bookCatalog } from "@/data/bible-books";
import { searchVerses } from "@/lib/bible.functions";
import { challenges, themes } from "@/data/content";

export const Route = createFileRoute("/buscar")({
  validateSearch: (search: Record<string, unknown>): { q: string } => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Pesquisa inteligente — temas, livros e versículos | Elohim" },
      {
        name: "description",
        content:
          "Pesquise por temas como ansiedade, medo, fé e perdão e receba versículos, leituras recomendadas, reflexões e desafios relacionados.",
      },
      { property: "og:title", content: "Pesquisa por temas na Bíblia" },
      { property: "og:description", content: "Encontre passagens para o que você está vivendo agora." },
    ],
  }),
  component: Buscar,
});

function Buscar() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q ?? "");
  const term = query.trim().toLowerCase();

  const matchedThemes = term
    ? themes.filter((t) => t.name.toLowerCase().includes(term) || t.id.includes(term))
    : themes.slice(0, 4);
  const matchedBooks = term ? bookCatalog.filter((b) => b.name.toLowerCase().includes(term)) : [];
  const verseSearch = useQuery({
    queryKey: ["verse-search", term],
    queryFn: () => searchVerses({ data: { term } }),
    enabled: term.length >= 3,
    staleTime: 60_000,
  });
  const verseHits = verseSearch.data?.results ?? [];
  const matchedChallenges = term
    ? challenges.filter((c) => c.title.toLowerCase().includes(term) || c.description.toLowerCase().includes(term))
    : [];

  const nothing =
    term && !matchedThemes.length && !matchedBooks.length && !matchedChallenges.length && !verseHits.length;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="🔎 Pesquisa"
        title="O que você está vivendo hoje?"
        description="Busque por um tema, livro, personagem ou sentimento."
      />

      <div className="relative mb-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ansiedade, medo, fé, perdão, Mateus..."
          className="w-full rounded-2xl border border-input bg-card py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setQuery(t.name)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            {t.emoji} {t.name}
          </button>
        ))}
      </div>

      {nothing ? (
        <EmptyState
          emoji="🔍"
          title="Nada encontrado por aqui"
          description="Tente um tema como ansiedade, medo, fé, perdão ou esperança."
        />
      ) : null}

      <div className="space-y-4">
        {matchedThemes.map((t) => (
          <SectionCard key={t.id} eyebrow={`${t.emoji} Tema`} title={t.name}>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">📖 Versículos relacionados</p>
            <ul className="mt-2 space-y-2">
              {t.verses.map((v) => (
                <li key={v.reference} className="rounded-2xl bg-scripture p-4">
                  <p className="font-scripture text-[16px] leading-relaxed text-scripture-foreground">“{v.text}”</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{v.reference}</span>
                    {v.route ? (
                      <Link
                        to="/biblia/$book/$chapter"
                        params={{ book: v.route.book, chapter: String(v.route.chapter) }}
                        className="text-xs font-semibold text-primary"
                      >
                        Ler capítulo →
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">📚 Leituras recomendadas</p>
            <ul className="mt-2 space-y-2">
              {t.readings.map((r) => (
                <li key={r.reference} className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 p-3">
                  <div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.reference}</p>
                  </div>
                  {r.route ? (
                    <Link
                      to="/biblia/$book/$chapter"
                      params={{ book: r.route.book, chapter: String(r.route.chapter) }}
                      className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      Ler
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-2xl bg-insight p-4 text-insight-foreground">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">💡 Reflexão</p>
              <p className="mt-1.5 text-sm leading-relaxed">{t.reflection}</p>
            </div>

            {t.challengeId ? (
              <Link
                to="/desafios/$challengeId"
                params={{ challengeId: t.challengeId }}
                className="mt-4 inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium"
              >
                🎯 Desafio relacionado
              </Link>
            ) : null}
          </SectionCard>
        ))}

        {matchedBooks.length ? (
          <SectionCard eyebrow="📖 Livros" title="Resultados na Bíblia">
            <div className="flex flex-wrap gap-2">
              {matchedBooks.map((b) => (
                <Link
                  key={b.id}
                  to="/biblia/$book/$chapter"
                  params={{ book: b.id, chapter: "1" }}
                  className="rounded-full bg-secondary px-4 py-2 text-sm font-medium"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {term.length >= 3 ? (
          <SectionCard eyebrow="📜 Texto bíblico" title={`Versículos com “${query.trim()}”`}>
            {verseSearch.isFetching ? (
              <p className="text-sm text-muted-foreground">Procurando na Bíblia completa…</p>
            ) : verseHits.length ? (
              <ul className="space-y-2">
                {verseHits.map((v) => (
                  <li key={`${v.book}-${v.chapter}-${v.verse}`} className="rounded-2xl bg-scripture p-4">
                    <p className="font-scripture text-[16px] leading-relaxed text-scripture-foreground">“{v.text}”</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        {v.bookName} {v.chapter}:{v.verse}
                      </span>
                      <Link
                        to="/biblia/$book/$chapter"
                        params={{ book: v.book, chapter: String(v.chapter) }}
                        className="text-xs font-semibold text-primary"
                      >
                        Ler capítulo →
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum versículo com esse termo exato.</p>
            )}
          </SectionCard>
        ) : null}

        {matchedChallenges.length ? (
          <SectionCard eyebrow="🎯 Desafios" title="Planos relacionados">
            <div className="flex flex-wrap gap-2">
              {matchedChallenges.map((c) => (
                <Link
                  key={c.id}
                  to="/desafios/$challengeId"
                  params={{ challengeId: c.id }}
                  className="rounded-full bg-secondary px-4 py-2 text-sm font-medium"
                >
                  {c.emoji} {c.title}
                </Link>
              ))}
            </div>
          </SectionCard>
        ) : null}

        <SectionCard eyebrow="💬 Em breve" title="Pergunte sobre a Bíblia">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Um assistente para perguntas como “Por que Jó sofreu?” ou “Quem foi Paulo?”, sempre com referências bíblicas,
            contexto e a lembrança de que existem diferentes interpretações cristãs.
          </p>
          <div className="mt-3">
            <Pill>Estrutura preparada</Pill>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
