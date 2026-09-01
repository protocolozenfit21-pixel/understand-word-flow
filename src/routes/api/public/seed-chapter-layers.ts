import { createFileRoute } from "@tanstack/react-router";

import { books as curatedBooks } from "@/data/bible";

/**
 * Preserva as camadas escritas à mão (capítulos curados) na tabela de cache,
 * para que continuem aparecendo depois da migração para o banco.
 * POST /api/public/seed-chapter-layers com header x-import-secret.
 */
export const Route = createFileRoute("/api/public/seed-chapter-layers")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["LOVABLE_CRON_SECRET"];
        if (!secret || request.headers.get("x-import-secret") !== secret) {
          return new Response(JSON.stringify({ error: "unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const rows = curatedBooks.flatMap((book) =>
          book.chapters.map((chapter) => ({
            book_id: book.id,
            chapter: chapter.number,
            title: chapter.title,
            minutes: chapter.minutes,
            simple: Object.fromEntries(
              chapter.verses.filter((v) => v.simple).map((v) => [String(v.n), v.simple as string]),
            ),
            insight: chapter.insight ?? null,
            model: "curado",
          })),
        );

        const { error } = await supabaseAdmin.from("bible_chapter_layers").upsert(rows as never);
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ seeded: rows.length }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
