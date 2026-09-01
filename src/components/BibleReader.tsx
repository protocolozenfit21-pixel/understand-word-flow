import { useState } from "react";
import { Bookmark, Highlighter, Share2, StickyNote, Sparkles, Map } from "lucide-react";
import { toast } from "sonner";
import type { Insight, Verse } from "@/types";
import { actions, useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Pill } from "./ui-bits";

export type Layer = "texto" | "atual" | "entenda";

type ReaderBook = { id: string; name: string };
type ReaderChapter = {
  number: number;
  verses: Verse[];
  insight?: Insight | null;
};

const layers: { id: Layer; label: string; short: string; icon: string; hint: string }[] = [
  {
    id: "texto",
    label: "Texto Bíblico",
    short: "Texto",
    icon: "📜",
    hint: "Tradução tradicional, sem alterações.",
  },
  {
    id: "atual",
    label: "Linguagem Atual",
    short: "Atual",
    icon: "🗣️",
    hint: "A mesma passagem em palavras do dia a dia.",
  },
  {
    id: "entenda",
    label: "Entenda",
    short: "Entenda",
    icon: "💡",
    hint: "Contexto, significado e aplicação — conteúdo explicativo.",
  },
];

export function LayerSwitcher({ value, onChange }: { value: Layer; onChange: (l: Layer) => void }) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-1 rounded-full border border-border/70 bg-card p-1.5">
        {layers.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => onChange(l.id)}
            className={cn(
              "flex min-w-0 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-[13px] font-medium transition-colors sm:px-4 sm:text-sm",
              value === l.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary",
            )}
          >
            <span aria-hidden className="shrink-0 text-[13px] leading-none">
              {l.icon}
            </span>
            <span className="truncate sm:hidden">{l.short}</span>
            <span className="hidden truncate sm:inline">{l.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 px-1 text-xs text-muted-foreground">{layers.find((l) => l.id === value)?.hint}</p>
    </div>
  );
}

export function LayerLoading({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/70 p-6 text-center">
      <p className="text-sm font-medium">Preparando {label} deste capítulo…</p>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Isso acontece uma única vez por capítulo e depois fica salvo para todos os leitores.
      </p>
    </div>
  );
}

export function BibleReader({
  book,
  chapter,
  layer,
}: {
  book: ReaderBook;
  chapter: ReaderChapter;
  layer: Layer;
}) {
  const highlights = useAppState((s) => s.highlights);
  const favorites = useAppState((s) => s.favorites);
  const [open, setOpen] = useState<number | null>(null);
  const [noteFor, setNoteFor] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  if (layer === "entenda") {
    if (!chapter.insight) return <LayerLoading label="a explicação" />;
    return <InsightPanel book={book} chapter={{ ...chapter, insight: chapter.insight }} />;
  }
  if (layer === "atual" && !chapter.verses.some((v) => v.simple)) {
    return <LayerLoading label="a linguagem atual" />;
  }


  return (
    <div className="space-y-1">
      {chapter.verses.map((v) => {
        const key = `${book.id}-${chapter.number}-${v.n}`;
        const reference = `${book.name} ${chapter.number}:${v.n}`;
        const highlighted = highlights.includes(key);
        const favorite = favorites.some((f) => f.reference === reference);
        return (
          <div key={v.n} className="rounded-2xl px-1 py-1">
            <button
              type="button"
              onClick={() => setOpen(open === v.n ? null : v.n)}
              className={cn(
                "block w-full rounded-2xl px-3 py-3 text-left transition-colors hover:bg-secondary/60",
                highlighted && "bg-highlight/35 hover:bg-highlight/45",
              )}
            >
              <span className="mr-2 align-super text-[11px] font-semibold text-muted-foreground tabular-nums">{v.n}</span>
              <span
                className={cn(
                  layer === "texto"
                    ? "font-scripture text-[19px] leading-[1.85] text-scripture-foreground"
                    : "text-[17px] leading-[1.8]",
                )}
              >
                {layer === "texto" ? v.text : (v.simple ?? v.text)}
              </span>
            </button>

            {open === v.n ? (
              <div className="mx-1 mb-2 mt-1 rounded-2xl border border-border/70 bg-card p-3">
                <div className="flex flex-wrap gap-1.5">
                  <VerseAction
                    icon={Bookmark}
                    label={favorite ? "Salvo" : "Favoritar"}
                    active={favorite}
                    onClick={() => {
                      actions.addFavorite({ collection: "Versículos favoritos", reference, text: v.text });
                      toast.success(favorite ? "Removido dos favoritos" : "Versículo salvo em Meus Versículos");
                    }}
                  />
                  <VerseAction
                    icon={Highlighter}
                    label="Destacar"
                    active={highlighted}
                    onClick={() => actions.toggleHighlight(key)}
                  />
                  <VerseAction
                    icon={StickyNote}
                    label="Anotar"
                    onClick={() => {
                      setNoteFor(noteFor === v.n ? null : v.n);
                      setNoteText("");
                    }}
                  />
                  <VerseAction
                    icon={Share2}
                    label="Compartilhar"
                    onClick={async () => {
                      const payload = `“${v.text}” — ${reference}`;
                      try {
                        if (typeof navigator !== "undefined" && navigator.share) {
                          await navigator.share({ text: payload });
                        } else {
                          await navigator.clipboard.writeText(payload);
                          toast.success("Versículo copiado");
                        }
                      } catch {
                        toast.error("Não foi possível compartilhar agora");
                      }
                    }}
                  />
                  <VerseAction icon={Sparkles} label="Não entendi" onClick={() => setOpen(v.n)} />
                  <VerseAction
                    icon={Map}
                    label="Ver no mapa"
                    onClick={() => toast("🗺️ Mapa bíblico chega em breve", { description: chapter.insight?.place ?? "Localização em breve" })}
                  />
                </div>

                {noteFor === v.n ? (
                  <form
                    className="mt-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!noteText.trim()) return;
                      actions.addNote({ reference, content: noteText.trim() });
                      setNoteText("");
                      setNoteFor(null);
                      toast.success("Anotação salva");
                    }}
                  >
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={3}
                      placeholder={`Sua anotação sobre ${reference}...`}
                      className="w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                    />
                    <button
                      type="submit"
                      className="mt-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                      Salvar anotação
                    </button>
                  </form>
                ) : null}

                <div className="mt-3 rounded-xl bg-insight p-3 text-insight-foreground">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
                    💡 Explicação (conteúdo do app, não é texto bíblico)
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed">{v.simple ?? v.text}</p>
                  {chapter.insight ? <p className="mt-2 text-sm leading-relaxed">{chapter.insight.meaning}</p> : null}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}

      <p className="px-3 pt-4 text-xs text-muted-foreground">
        Texto bíblico em tradução de domínio público. Explicações e reflexões são conteúdo do aplicativo e aparecem
        sempre separadas do texto.
      </p>
    </div>
  );
}

function VerseAction({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Bookmark;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary",
        active && "border-transparent bg-gold/25 text-gold-foreground dark:text-gold",
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}

export function InsightPanel({
  book,
  chapter,
}: {
  book: ReaderBook;
  chapter: { number: number; insight: Insight };
}) {
  const i = chapter.insight;
  const blocks = [
    { label: "📚 Contexto histórico", value: i.context },
    { label: "👤 Quem está falando?", value: i.speaker },
    { label: "👥 Para quem foi escrito?", value: i.audience },
    { label: "🌎 Onde aconteceu?", value: i.place },
    { label: "📅 Em qual época?", value: i.period },
    { label: "🧠 O que significa?", value: i.meaning },
    { label: "🌎 Como isso se aplica hoje?", value: i.today },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-insight p-5 text-insight-foreground">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">
          💡 Entenda · {book.name} {chapter.number}
        </p>
        <p className="mt-2 text-[17px] leading-relaxed">{i.summary}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {blocks.map((b) => (
          <div key={b.label} className="rounded-2xl border border-border/70 bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{b.label}</p>
            <p className="mt-2 text-sm leading-relaxed">{b.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gold/40 bg-gold/12 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">🤔 Reflexão</p>
        <p className="mt-2 text-[17px] leading-relaxed">{i.reflection}</p>
      </div>

      {i.interpretations ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/60 p-4 text-sm leading-relaxed text-muted-foreground">
          {i.interpretations}
        </p>
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-card/60 p-4 text-sm leading-relaxed text-muted-foreground">
          Existem diferentes interpretações cristãs sobre alguns detalhes deste texto. O app busca neutralidade entre
          denominações.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Pill tone="primary">Conteúdo explicativo</Pill>
        <Pill>Não substitui o texto bíblico</Pill>
      </div>
    </div>
  );
}
