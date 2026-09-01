import { createFileRoute } from "@tanstack/react-router";

import { bookCatalog, TOTAL_CHAPTERS } from "@/data/bible-books";

/**
 * Importação única do texto bíblico completo (Almeida, domínio público).
 * Protegida por segredo do servidor. Idempotente: pode rodar de novo por livro.
 *
 * POST /api/public/import-bible  { books?: string[] }  (header x-import-secret)
 * GET  /api/public/import-bible  -> relatório de integridade
 */
const SOURCE_URL = "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/pt_aa.json";

type SourceBook = { abbrev: string; name: string; chapters: string[][] };

function unauthorized() {
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

export const Route = createFileRoute("/api/public/import-bible")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const missing: { book: string; expected: number; found: number }[] = [];
        let verses = 0;

        for (const meta of bookCatalog) {
          const [countRes, lastRes] = await Promise.all([
            supabaseAdmin
              .from("bible_verses")
              .select("verse", { count: "exact", head: true })
              .eq("book_id", meta.id),
            supabaseAdmin
              .from("bible_verses")
              .select("chapter")
              .eq("book_id", meta.id)
              .order("chapter", { ascending: false })
              .limit(1)
              .maybeSingle(),
          ]);
          if (countRes.error) return json({ error: countRes.error.message }, 500);
          verses += countRes.count ?? 0;
          const found = lastRes.data?.chapter ?? 0;
          if (found !== meta.totalChapters) {
            missing.push({ book: meta.id, expected: meta.totalChapters, found });
          }
        }

        return json({
          books: bookCatalog.length,
          expectedChapters: TOTAL_CHAPTERS,
          verses,
          complete: missing.length === 0,
          incomplete: missing,
        });
      },


      POST: async ({ request }) => {
        const secret = process.env["LOVABLE_CRON_SECRET"];
        if (!secret || request.headers.get("x-import-secret") !== secret) return unauthorized();

        const body = (await request.json().catch(() => ({}))) as { books?: string[] };
        const wanted = new Set(body.books ?? bookCatalog.map((b) => b.id));

        const res = await fetch(SOURCE_URL);
        if (!res.ok) return json({ error: `fonte indisponível (${res.status})` }, 502);
        const source = JSON.parse((await res.text()).replace(/^\uFEFF/, "")) as SourceBook[];

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const report: { book: string; chapters: number; verses: number }[] = [];

        for (const meta of bookCatalog) {
          if (!wanted.has(meta.id)) continue;
          const src = source.find((s) => s.abbrev === meta.abbrev);
          if (!src) return json({ error: `livro ausente na fonte: ${meta.id}` }, 500);

          const bookUpsert = await supabaseAdmin.from("bible_books").upsert({
            id: meta.id,
            abbrev: meta.abbrev,
            name: meta.name,
            testament: meta.testament,
            book_group: meta.group,
            sort_order: meta.order,
            total_chapters: meta.totalChapters,
            summary: meta.summary ?? null,
          });
          if (bookUpsert.error) return json({ error: bookUpsert.error.message }, 500);

          const rows = src.chapters.flatMap((verses, ci) =>
            verses.map((text, vi) => ({
              book_id: meta.id,
              chapter: ci + 1,
              verse: vi + 1,
              text: text.trim(),
            })),
          );

          for (let i = 0; i < rows.length; i += 500) {
            const chunk = rows.slice(i, i + 500);
            const { error } = await supabaseAdmin.from("bible_verses").upsert(chunk);
            if (error) return json({ error: error.message, book: meta.id }, 500);
          }

          report.push({ book: meta.id, chapters: src.chapters.length, verses: rows.length });
        }

        return json({ imported: report.length, report });
      },
    },
  },
});
