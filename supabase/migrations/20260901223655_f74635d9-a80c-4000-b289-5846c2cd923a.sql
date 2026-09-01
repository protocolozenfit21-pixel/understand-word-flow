CREATE TABLE public.bible_books (
  id text PRIMARY KEY,
  abbrev text NOT NULL,
  name text NOT NULL,
  testament text NOT NULL,
  book_group text NOT NULL,
  sort_order int NOT NULL,
  total_chapters int NOT NULL,
  summary text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.bible_books TO anon, authenticated;
GRANT ALL ON public.bible_books TO service_role;
ALTER TABLE public.bible_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bible books are public" ON public.bible_books FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.bible_verses (
  book_id text NOT NULL REFERENCES public.bible_books(id) ON DELETE CASCADE,
  chapter int NOT NULL,
  verse int NOT NULL,
  text text NOT NULL,
  PRIMARY KEY (book_id, chapter, verse)
);
GRANT SELECT ON public.bible_verses TO anon, authenticated;
GRANT ALL ON public.bible_verses TO service_role;
ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bible verses are public" ON public.bible_verses FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX bible_verses_chapter_idx ON public.bible_verses (book_id, chapter, verse);

CREATE TABLE public.bible_chapter_layers (
  book_id text NOT NULL REFERENCES public.bible_books(id) ON DELETE CASCADE,
  chapter int NOT NULL,
  title text,
  minutes int,
  simple jsonb,
  insight jsonb,
  model text,
  generated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (book_id, chapter)
);
GRANT SELECT ON public.bible_chapter_layers TO anon, authenticated;
GRANT ALL ON public.bible_chapter_layers TO service_role;
ALTER TABLE public.bible_chapter_layers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chapter layers are public" ON public.bible_chapter_layers FOR SELECT TO anon, authenticated USING (true);