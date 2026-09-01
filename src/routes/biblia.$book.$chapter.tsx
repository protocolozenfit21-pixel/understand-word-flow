import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Headphones } from "lucide-react";
import { toast } from "sonner";
import { BibleReader, LayerSwitcher, type Layer } from "@/components/BibleReader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Quiz } from "@/components/Quiz";
import { Pill, ProgressBar, SectionCard } from "@/components/ui-bits";
import { getChapter, quizFor } from "@/data/bible";
import { actions, useAppState } from "@/lib/store";

export const Route = createFileRoute("/biblia/$book/$chapter")({
  loader: ({ params }) => {
    const found = getChapter(params.book, Number(params.chapter));
    if (!found) throw notFound();
    return { bookName: found.book.name, chapterNumber: found.chapter.number, title: found.chapter.title };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Passagem não encontrada — Lumen" }, { name: "robots", content: "noindex" }] };
    }
    const label = `${loaderData.bookName} ${loaderData.chapterNumber}`;
    return {
      meta: [
        { title: `${label} — ${loaderData.title} | Lumen` },
        {
          name: "description",
          content: `Leia ${label} com texto bíblico, linguagem atual e explicação com contexto histórico e aplicação para hoje.`,
        },
        { property: "og:title", content: `${label} — ${loaderData.title}` },
        {
          property: "og:description",
          content: `Texto, linguagem simples e explicação de ${label}, com reflexão e diário espiritual.`,
        },
      ],
    };
  },
  component: ChapterPage,
});

function ChapterPage() {
  const params = Route.useParams();
  const found = getChapter(params.book, Number(params.chapter));
  const [layer, setLayer] = useState<Layer>("texto");
  const [reflection, setReflection] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const readChapters = useAppState((s) => s.readChapters);

  const book = found?.book;
  const chapter = found?.chapter;

  useEffect(() => {
    if (!book || !chapter) return;
    actions.setLastRead({ book: book.id, bookName: book.name, chapter: chapter.number, verse: 1 });
  }, [book, chapter]);

  if (!book || !chapter) return null;

  const key = `${book.id}-${chapter.number}`;
  const done = readChapters.includes(key);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center gap-3">
        <Link to="/biblia" aria-label="Voltar" className="grid size-9 place-items-center rounded-full bg-secondary">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">
            {book.name} {chapter.number}
          </h1>
          <p className="text-xs text-muted-foreground">{chapter.title}</p>
        </div>
        <Pill tone="gold">⏱️ {chapter.minutes} min</Pill>
      </div>

      <div className="mb-4">
        <ProgressBar value={chapter.verses.length} max={chapter.verses.length} tone="sage" />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {chapter.verses.length} de {chapter.verses.length} versículos nesta seleção
        </p>
      </div>

      <LayerSwitcher value={layer} onChange={setLayer} />

      <div className="mt-5 rounded-3xl border border-border/70 bg-scripture p-4 md:p-6">
        <BibleReader book={book} chapter={chapter} layer={layer} />
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Toque em um versículo para favoritar, destacar, anotar ou ver a explicação.
      </p>

      <div className="mt-6 space-y-4">
        <SectionCard eyebrow="Ao terminar" title="Como foi essa leitura?">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                actions.completeReading(book.id, chapter.number, chapter.minutes);
                toast.success("Leitura concluída", { description: "Você está construindo um lindo hábito." });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {done ? <Check className="size-4" /> : null} ✅ Concluir leitura
            </button>
            <button
              type="button"
              onClick={() => setShowQuiz((v) => !v)}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium"
            >
              🧠 Você entendeu? (opcional)
            </button>
            <Link to="/ouvir" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium">
              <Headphones className="size-4" /> Ouvir
            </Link>
          </div>
          {showQuiz ? (
            <div className="mt-5">
              <Quiz questions={quizFor(book.id, chapter.number)} />
            </div>
          ) : null}
        </SectionCard>

        <SectionCard eyebrow="📝 Meu Diário" title="O que você refletiu sobre a leitura de hoje?">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!reflection.trim()) return;
              actions.addJournal({ reference: `${book.name} ${chapter.number}`, content: reflection.trim() });
              setReflection("");
              toast.success("Reflexão salva no seu diário");
            }}
          >
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
              placeholder="Escreva livremente. Ninguém além de você vê isso."
              className="w-full rounded-2xl border border-input bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="submit" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                Salvar reflexão
              </button>
              <Link to="/diario" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium">
                Ver meu diário
              </Link>
            </div>
          </form>
        </SectionCard>

        <AudioPlayer title={`${book.name} ${chapter.number}`} subtitle="Narração e reflexão em áudio (em breve)" />
      </div>
    </div>
  );
}
