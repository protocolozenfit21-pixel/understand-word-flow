# Bíblia completa (66 livros) no modo Bíblia

Hoje o app tem só alguns capítulos escritos à mão em `src/data/bible.ts`. O objetivo é ter a Bíblia inteira — 66 livros, 1.189 capítulos, ~31.100 versículos — sem faltar nada, mantendo as três camadas (Texto Bíblico · Linguagem Atual · Entenda) e todo o resto do app funcionando como está.

## Como fica

1. O texto bíblico completo (Almeida 1911, domínio público) passa a viver no Lovable Cloud. O app carrega apenas o capítulo aberto — rápido no celular e sem inflar o aplicativo.
2. A tela `/biblia` mostra os 66 livros agrupados (Pentateuco, Históricos, Poéticos, Profetas, Evangelhos, Cartas, Apocalipse) com todos os capítulos clicáveis — nenhum capítulo "indisponível".
3. Ao abrir um capítulo, a camada **Texto Bíblico** aparece imediatamente. As camadas **Linguagem Atual** e **Entenda** são geradas por IA na primeira vez que aquele capítulo é aberto (com indicador "preparando explicação...") e ficam salvas para sempre, para todos os leitores. A segunda visita é instantânea.
4. Favoritos, destaques, anotações, diário, sequência, desafios e jornada continuam iguais, agora podendo apontar para qualquer capítulo da Bíblia.
5. Busca por tema passa a procurar no texto real de toda a Bíblia, além dos temas curados.

## Garantia de integridade

Antes de considerar pronto, uma verificação automática confere: 66 livros, contagem de capítulos por livro igual à tabela canônica (Gênesis 50, Salmos 150, Apocalipse 22 etc.) e total de versículos por capítulo conforme a referência. Se algo faltar, a importação daquele livro é repetida. A tela de perfil ganha uma linha discreta com o status ("Bíblia completa: 66 livros · 1.189 capítulos").

## Detalhes técnicos

- **Cloud**: habilitar Lovable Cloud. Tabelas:
  - `bible_books` (id slug, nome, testamento, grupo, ordem, total_chapters, resumo)
  - `bible_verses` (book_id, chapter, verse, text) com índice em (book_id, chapter) e unique (book_id, chapter, verse)
  - `bible_chapter_layers` (book_id, chapter, simple_json, insight_json, model, generated_at) — cache das camadas 2 e 3
  - Leitura pública: `GRANT SELECT ... TO anon, authenticated`, RLS com política `SELECT` para `anon`; escrita só via `service_role`.
- **Importação**: rota `src/routes/api/public/import-bible.ts` protegida por segredo, que baixa o texto Almeida 1911 (domínio público, fonte JSON aberta), normaliza e insere em lote com `supabaseAdmin`, idempotente por livro; endpoint irmão `verify-bible` devolve o relatório de integridade. Rodada uma vez após habilitar o Cloud.
- **Leitura**: `src/lib/bible.functions.ts` com `getBooks()`, `getChapter({ book, chapter })` via server function pública (cliente publishable, sem admin). Rotas `/biblia` e `/biblia/$book/$chapter` passam a usar `queryOptions` + `ensureQueryData` no loader e `useSuspenseQuery` no componente. `src/data/bible.ts` deixa de ser fonte de texto; os capítulos curados existentes viram seed inicial da tabela de camadas, para não perder o conteúdo já escrito.
- **Camadas por IA**: server function `ensureChapterLayers` — se não houver cache, chama o Lovable AI Gateway (`google/gemini-3.6-flash`) com o texto do capítulo e um schema estrito (por versículo: `simple`; por capítulo: `summary`, `speaker`, `audience`, `place`, `period`, `context`, `meaning`, `today`, `reflection`, `interpretations`), grava o resultado e retorna. Prompt em português, tom acolhedor, neutro entre denominações, sempre marcando que é conteúdo explicativo e não texto bíblico. Erros 429/5xx com backoff; 402/403 mostram aviso e o leitor continua com a camada de texto.
- **Tipos**: `Chapter`/`Verse` passam a ter `simple` opcional (chega com a camada) e `insight` opcional; ajustes pontuais em `BibleReader`, `biblia.index.tsx`, `buscar.tsx` e `perfil.tsx` onde hoje se assume conteúdo local.
- **Navegação**: seletor de livro com busca por nome e grade de capítulos paginada, para lidar com Salmos 150 sem travar no mobile.

## Fora deste passo

Outras traduções, áudio real e leitura offline completa (o cache do capítulo aberto continua funcionando).
