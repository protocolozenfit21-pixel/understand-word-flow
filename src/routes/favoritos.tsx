import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { EmptyState, Pill } from "@/components/ui-bits";
import { actions, useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Meus Versículos — coleções e anotações | Lumen" },
      {
        name: "description",
        content: "Salve versículos em coleções como Paz, Ansiedade, Fé e Oração, e adicione suas próprias anotações.",
      },
      { property: "og:title", content: "Meus Versículos" },
      { property: "og:description", content: "Suas passagens favoritas organizadas por tema." },
    ],
  }),
  component: Favoritos;
});

const collections = ["Todos", "Paz", "Ansiedade", "Fé", "Amor", "Oração", "Força", "Versículos favoritos"];

function Favoritos() {
  const favorites = useAppState((s) => s.favorites);
  const [collection, setCollection] = useState("Todos");
  const [editing, setEditing] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const list = collection === "Todos" ? favorites : favorites.filter((f) => f.collection === collection);

  return (
    <div>
      <PageHeader
        eyebrow="❤️ Meus Versículos"
        title="As passagens que ficaram com você"
        description="Organize por tema e volte a elas quando precisar."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {collections.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCollection(c)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              collection === c ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-secondary",
            )}
          >
            📁 {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          emoji="🔖"
          title="Nada salvo nesta coleção ainda"
          description="Durante a leitura, toque em um versículo e escolha Favoritar para guardá-lo aqui."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((f) => (
            <article key={f.id} className="rounded-3xl border border-border/70 bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <Pill tone="gold">{f.collection}</Pill>
                <button
                  type="button"
                  aria-label="Remover"
                  onClick={() => actions.removeFavorite(f.id)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <blockquote className="mt-3 font-scripture text-[17px] leading-relaxed text-scripture-foreground">
                “{f.text}”
              </blockquote>
              <p className="mt-2 text-xs font-medium text-muted-foreground">{f.reference}</p>

              {editing === f.id ? (
                <form
                  className="mt-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    actions.updateFavoriteNote(f.id, note);
                    setEditing(null);
                  }}
                >
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                  />
                  <button type="submit" className="mt-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                    Salvar nota
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(f.id);
                    setNote(f.note ?? "");
                  }}
                  className="mt-3 w-full rounded-xl bg-secondary/70 p-3 text-left text-sm text-muted-foreground"
                >
                  {f.note ? `📝 ${f.note}` : "📝 Adicionar uma nota"}
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
