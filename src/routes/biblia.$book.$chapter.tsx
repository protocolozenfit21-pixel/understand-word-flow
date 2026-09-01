import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Headphones } from "lucide-react";
import { toast } from "sonner";
import { BibleReader, LayerSwitcher, type Layer } from "@/components/BibleReader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Quiz } from "@/components/Quiz";
import { Pill, ProgressBar, SectionCard } from "@/components/ui-bits";
import { quizFor } from "@/data/bible";
import { bookById } from "@/data/bible-books";
import { ensureChapterLayers, getChapter } from "@/lib/bible.functions";
import { actions, useAppState } from "@/lib/store";

const chapterQuery = (book: string, chapter: number) =>
  queryOptions({
    queryKey: ["chapter", book, chapter],
    queryFn: () => getChapter({ data: { book, chapter } }),
    staleTime: 5 * 60_000,
  });

export const Route = createFileRoute("/biblia/$book/$chapter")({
  loader: async ({ params, context }) => {
    const meta = bookById.get(params.book);
    const chapter = Number(params.chapter);
    if (!meta || !Number.isInteger(chapter) || chapter < 1 || chapter > meta.totalChapters) throw notFound();
    await context.queryClient.ensureQueryData(chapterQuery(params.book, chapter));
    return { bookName: meta.name, chapterNumber: chapter };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Passagem não encontrada — Elohim" }, { name: "robots", content: "noindex" }] };
    }
    const label = `${loaderData.bookName} ${loaderData.chapterNumber}`;
    return {
      meta: [
        { title: `${label} | Elohim` },
        {
          name: "description",
          content: `Leia ${label} com texto bíblico, linguagem atual e explicação com contexto histórico e aplicação para hoje.`,
        },
        { property: "og:title", content: `${label} — Bíblia em três camadas` },
        {
          property: "og:description",
          content: `Texto, linguagem simples e explicação de ${label}, com reflexão e diário espiritual.`,
        },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-lg rounded-3xl border border-border/70 bg-card p-6 text-center">
      <p className="font-semibold">Não conseguimos abrir esta passagem</p>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <Link to="/biblia" className="mt-4 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
        Voltar para a Bíblia
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-lg rounded-3xl border border-border/70 bg-card p-6 text-center">
      <p className="font-semibold">Capítulo não encontrado</p>
      <Link to="/biblia" className="mt-4 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
        Escolher outro livro
      </Link>
    </div>
  ),
  component: ChapterPage,
});

function ChapterPage() {
  const params = Route.useParams();
  const chapterNumber = Number(params.chapter);
  const options = chapterQuery(params.book, chapterNumber);
  const { data } = useSuspenseQuery(options);
  const queryClient = useQueryClient();
  const [layer, setLayer] = useState<Layer>("texto");
  const [reflection, setReflection] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const readChapters = useAppState((s) => s.readChapters);

  const generate = useMutation({
    mutationFn: () => ensureChapterLayers({ data: { book: params.book, chapter: chapterNumber } }),
    onSuccess: (result) => {
      if (result.ok) queryClient.invalidateQueries({ queryKey: options.queryKey });
      else toast.error(result.message ?? "Explicações indisponíveis agora.");
    },
    onError: () => toast.error("Explicações indisponíveis agora."),
  });

  useEffect(() => {
    actions.setLastRead({ book: data.book.id, bookName: data.book.name, chapter: data.chapter, verse: 1 });
  }, [data.book.id, data.book.name, data.chapter]);

  useEffect(() => {
    if (data.layersReady) return;
    if (layer === "texto") return;
    if (generate.isPending || generate.isSuccess || generate.isError) return;
    generate.mutate();
  }, [data.layersReady, layer, generate]);

  const key = `${data.book.id}-${data.chapter}`;
  const done = readChapters.includes(key);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center gap-3">
        <Link to="/biblia" aria-label="Voltar" className="grid size-9 place-items-center rounded-full bg-secondary">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">
            {data.book.name} {data.chapter}
          </h1>
          <p className="text-xs text-muted-foreground">{data.title}</p>
        </div>
        <Pill tone="gold">⏱️ {data.minutes} min</Pill>
      </div>

      <div className="mb-4">
        <ProgressBar value={data.verses.length} max={data.verses.length} tone="sage" />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {data.verses.length} versículos neste capítulo
        </p>
      </div>

      <LayerSwitcher value={layer} onChange={setLayer} />

      <div className="mt-5 rounded-3xl border border-border/70 bg-scripture p-4 md:p-6">
        <BibleReader
          book={data.book}
          chapter={{ number: data.chapter, verses: data.verses, insight: data.insight }}
          layer={layer}
        />
      </div>

      {!data.layersReady && layer !== "texto" && (generate.isError || (generate.isSuccess && !generate.data.ok)) ? (
        <button
          type="button"
          onClick={() => generate.mutate()}
          className="mx-auto mt-4 block rounded-full border border-border px-5 py-2.5 text-sm font-medium"
        >
          Tentar gerar novamente
        </button>
      ) : null}

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Toque em um versículo para favoritar, destacar, anotar ou ver a explicação.
      </p>

      <div className="mt-6 space-y-4">
        <SectionCard eyebrow="Ao terminar" title="Como foi essa leitura?">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                actions.completeReading(data.book.id, data.chapter, data.minutes);
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
              <Quiz questions={quizFor(data.book.id, data.chapter)} />
            </div>
          ) : null}
        </SectionCard>

        <SectionCard eyebrow="📝 Meu Diário" title="O que você refletiu sobre a leitura de hoje?">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!reflection.trim()) return;
              actions.addJournal({ reference: `${data.book.name} ${data.chapter}`, content: reflection.trim() });
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

        <AudioPlayer title={`${data.book.name} ${data.chapter}`} subtitle="Narração e reflexão em áudio (em breve)" />
      </div>
    </div>
  );
}
