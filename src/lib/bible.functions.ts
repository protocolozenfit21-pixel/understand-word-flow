import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import { bookCatalog, bookById } from "@/data/bible-books";
import type { BookMeta, ChapterPayload, Insight, Verse } from "@/types";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

function metaFor(bookId: string): BookMeta {
  const meta = bookById.get(bookId);
  if (!meta) throw new Error(`Livro desconhecido: ${bookId}`);
  return meta;
}

function estimateMinutes(verses: Verse[]) {
  const words = verses.reduce((n, v) => n + v.text.split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 180));
}

type ChapterInput = { book: string; chapter: number };

function validateChapter(input: ChapterInput): ChapterInput {
  const meta = metaFor(String(input.book));
  const chapter = Number(input.chapter);
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > meta.totalChapters) {
    throw new Error(`Capítulo inválido para ${meta.name}: ${input.chapter}`);
  }
  return { book: meta.id, chapter };
}

/** Lista dos 66 livros com o total de capítulos já importados. */
export const getBooks = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase.from("bible_books").select("id, summary").order("sort_order");
  if (error) throw new Error(error.message);
  const summaries = new Map((data ?? []).map((b) => [b.id, b.summary]));
  const importedIds = new Set((data ?? []).map((b) => b.id));

  return {
    books: bookCatalog.map((b) => ({
      ...b,
      summary: summaries.get(b.id) ?? b.summary ?? null,
      imported: importedIds.has(b.id),
    })),
    importedCount: importedIds.size,
  };
});

/** Texto do capítulo + camadas (linguagem atual / entenda) quando já geradas. */
export const getChapter = createServerFn({ method: "GET" })
  .inputValidator((input: ChapterInput) => validateChapter(input))
  .handler(async ({ data }): Promise<ChapterPayload> => {
    const supabase = publicClient();
    const meta = metaFor(data.book);

    const [versesRes, layersRes] = await Promise.all([
      supabase
        .from("bible_verses")
        .select("verse, text")
        .eq("book_id", data.book)
        .eq("chapter", data.chapter)
        .order("verse"),
      supabase
        .from("bible_chapter_layers")
        .select("title, minutes, simple, insight")
        .eq("book_id", data.book)
        .eq("chapter", data.chapter)
        .maybeSingle(),
    ]);

    if (versesRes.error) throw new Error(versesRes.error.message);
    const rows = versesRes.data ?? [];
    if (rows.length === 0) throw new Error("Capítulo ainda não disponível");

    const layers = layersRes.data ?? null;
    const simpleMap = new Map<number, string>(
      Object.entries((layers?.simple as Record<string, string> | null) ?? {}).map(([k, v]) => [Number(k), v]),
    );

    const verses: Verse[] = rows.map((r) => ({
      n: r.verse,
      text: r.text,
      ...(simpleMap.get(r.verse) ? { simple: simpleMap.get(r.verse)! } : {}),
    }));

    return {
      book: meta,
      chapter: data.chapter,
      title: layers?.title ?? `${meta.name} ${data.chapter}`,
      minutes: layers?.minutes ?? estimateMinutes(verses),
      verses,
      insight: (layers?.insight as Insight | null) ?? null,
      layersReady: simpleMap.size > 0 && Boolean(layers?.insight),
    };
  });

const layerSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "verses", "insight"],
  properties: {
    title: { type: "string" },
    verses: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["n", "simple"],
        properties: { n: { type: "integer" }, simple: { type: "string" } },
      },
    },
    insight: {
      type: "object",
      additionalProperties: false,
      required: [
        "summary",
        "speaker",
        "audience",
        "place",
        "period",
        "context",
        "meaning",
        "today",
        "reflection",
        "interpretations",
      ],
      properties: {
        summary: { type: "string" },
        speaker: { type: "string" },
        audience: { type: "string" },
        place: { type: "string" },
        period: { type: "string" },
        context: { type: "string" },
        meaning: { type: "string" },
        today: { type: "string" },
        reflection: { type: "string" },
        interpretations: { type: "string" },
      },
    },
  },
} as const;

/**
 * Gera (uma única vez por capítulo) as camadas "Linguagem Atual" e "Entenda"
 * e guarda no banco para todos os leitores.
 */
export const ensureChapterLayers = createServerFn({ method: "POST" })
  .inputValidator((input: ChapterInput) => validateChapter(input))
  .handler(async ({ data }): Promise<{ ok: boolean; message?: string; payload?: ChapterPayload }> => {
    const existing = await getChapter({ data });
    if (existing.layersReady) return { ok: true, payload: existing };

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false, message: "Explicações indisponíveis agora." };

    const meta = metaFor(data.book);
    const reference = `${meta.name} ${data.chapter}`;
    const passage = existing.verses.map((v) => `${v.n}. ${v.text}`).join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: [
          {
            role: "system",
            content: [
              "Você escreve conteúdo explicativo para um aplicativo de leitura da Bíblia em português do Brasil.",
              "Tom acolhedor, simples e respeitoso. Nunca ameace o leitor nem julgue.",
              "Seja neutro entre denominações cristãs; quando houver divergência, diga isso no campo interpretations.",
              "A camada 'simple' é uma reescrita em linguagem atual do MESMO versículo, uma frase clara, sem adicionar doutrina.",
              "Nunca apresente o conteúdo explicativo como se fosse o texto bíblico.",
            ].join(" "),
          },
          {
            role: "user",
            content: `Passagem: ${reference}\n\n${passage}\n\nEscreva: um título curto para o capítulo, a versão em linguagem atual de CADA versículo (mesma numeração) e o bloco explicativo.`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "chapter_layers", strict: true, schema: layerSchema },
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("AI gateway error", res.status, detail);
      if (res.status === 429) return { ok: false, message: "Muitas explicações sendo geradas. Tente em instantes." };
      if (res.status === 402 || res.status === 403) {
        return { ok: false, message: "As explicações estão temporariamente indisponíveis." };
      }
      return { ok: false, message: "Não foi possível gerar a explicação agora." };
    }

    const completion = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = completion.choices?.[0]?.message?.content;
    if (!content) return { ok: false, message: "Não foi possível gerar a explicação agora." };

    const parsed = JSON.parse(content) as {
      title: string;
      verses: { n: number; simple: string }[];
      insight: Insight;
    };

    const simple: Record<string, string> = {};
    for (const v of parsed.verses) if (v.simple?.trim()) simple[String(v.n)] = v.simple.trim();

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("bible_chapter_layers").upsert({
      book_id: data.book,
      chapter: data.chapter,
      title: parsed.title?.trim() || reference,
      minutes: existing.minutes,
      simple,
      insight: parsed.insight as unknown as Record<string, string>,
      model: "google/gemini-3.7-flash",
      generated_at: new Date().toISOString(),
    });
    if (error) console.error("layer save error", error.message);

    return { ok: true, payload: await getChapter({ data }) };
  });

/** Busca no texto completo da Bíblia. */
export const searchVerses = createServerFn({ method: "GET" })
  .inputValidator((input: { term: string }) => ({ term: String(input.term ?? "").slice(0, 80) }))
  .handler(async ({ data }) => {
    if (data.term.trim().length < 3) return { results: [] };
    const supabase = publicClient();
    const { data: rows, error } = await supabase
      .from("bible_verses")
      .select("book_id, chapter, verse, text")
      .ilike("text", `%${data.term.trim()}%`)
      .limit(30);
    if (error) throw new Error(error.message);
    return {
      results: (rows ?? []).map((r) => ({
        book: r.book_id,
        bookName: bookById.get(r.book_id)?.name ?? r.book_id,
        chapter: r.chapter,
        verse: r.verse,
        text: r.text,
      })),
    };
  });
