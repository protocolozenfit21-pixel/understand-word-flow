# Bíblia Interativa — PWA gamificado (MVP)

Aplicativo de leitura da Bíblia com foco em entendimento, hábito e progresso. Primeira versão com dados fictícios, visual de produto pronto para lançamento, e código estruturado para receber banco de dados e conteúdo real depois.

## Escopo do MVP

1. **Onboarding** — perguntas sobre experiência ("Nunca li", "Li algumas partes"...), objetivo e forma preferida de aprender; ao final mostra uma jornada recomendada.
2. **Home** — saudação personalizada, sequência ("7 dias caminhando na Palavra"), card "Continue sua jornada", Mensagem do dia (versículo, reflexão, oração, desafio) e botão destacado "Não sei por onde começar".
3. **Bíblia / Leitura** — seleção de livro e capítulo, leitor com progresso de versículos e alternância entre as 3 camadas: 📜 Texto Bíblico, 🗣️ Linguagem Atual, 💡 Entenda (contexto histórico, quem fala, o que significa, aplicação hoje, reflexão). Controles por versículo: favoritar, destacar, anotar, compartilhar, explicar. Placeholder de áudio.
4. **Desafios** — desafio principal "Bíblia em 1 ano" (dia X de 365, leitura do dia, barra de progresso) + desafios curtos (Novo Testamento 90 dias, Evangelhos 30, Salmos 30, Provérbios 31, Amor 14, Orar 21, Perdão 7, Fé 21, Hábito 30) com duração, nº de leituras, tempo médio e progresso.
5. **Jornada** — mapa vertical de etapas (Criação → Adão e Eva → Noé → Abraão → Moisés → Reis → Profetas → Jesus → Igreja → Apocalipse) com estados bloqueado/atual/concluído e detalhe de cada etapa.
6. **Perfil / Minha Jornada** — estatísticas (capítulos, dias consecutivos, tempo, livros, favoritos, reflexões, desafios), conquistas, preferências de notificação e tema.
7. **Favoritos** — coleções (Paz, Ansiedade, Fé, Amor, Oração, Força) com versículos e notas.
8. **Diário** — reflexão após a leitura e timeline de reflexões anteriores.
9. **Extras leves** — busca por tema ("ansiedade", "medo", "fé") com versículos/leituras/reflexões sugeridas; "Tenho apenas 5 minutos" (5/10/20 min); quiz opcional pós-leitura; linha do tempo bíblica.

Navegação inferior fixa no mobile: Início · Bíblia · Desafios · Jornada · Perfil. No desktop vira barra lateral/superior.

## Diretrizes de conteúdo

- Texto bíblico sempre visualmente separado (tipografia serifada, fundo próprio) das explicações e reflexões, que ficam em cards distintos.
- Apenas texto de domínio público no MVP (ex.: tradução clássica em português livre de direitos), com estrutura de dados que permite adicionar outras versões depois.
- Linguagem acolhedora: "Continue sua caminhada", nunca ameaças de perda de sequência.
- Onde couber, nota neutra: "Existem diferentes interpretações cristãs sobre esta passagem."

## Design

Moderno, calmo e premium: azul profundo, dourado suave, brancos e tons naturais; modo claro e escuro; espaçamento generoso, cantos suaves, microanimações discretas. Nada infantil, nada de excesso de iconografia religiosa.

## Detalhes técnicos

- TanStack Start + React + TypeScript + Tailwind, tokens semânticos em `src/styles.css` (nada de cores fixas nos componentes).
- Rotas: `/` (home), `/onboarding`, `/biblia`, `/biblia/$livro/$capitulo`, `/desafios`, `/desafios/$id`, `/jornada`, `/jornada/$etapa`, `/perfil`, `/favoritos`, `/diario`, `/buscar`, `/timeline`. Cada rota com `head()` próprio (title/description/og).
- Dados fictícios em `src/data/` (livros e capítulos com as 3 camadas, desafios, jornada, mensagem diária, conquistas, temas) tipados em `src/types/`, para troca direta por consultas reais depois.
- Estado local (leitura atual, sequência, favoritos, anotações, diário, progresso de desafios) num store em `localStorage` com uma camada de acesso única, para virar Lovable Cloud sem mexer na UI.
- Componentes reutilizáveis: BibleReader, BibleVerse, LayerSwitcher, ReadingProgress, DailyMessage, ChallengeCard, JourneyMap, Quiz, ReflectionCard, AudioPlayer (visual), UserProgress, AchievementCard, FavoriteVerse, JournalEntry, BottomNav.
- PWA: manifest, ícones e meta tags de instalação.

## Fora deste MVP (estrutura preparada)

Comunidade e leitura em grupo, assistente de IA bíblico, áudio real, mapa geográfico interativo, login e banco de dados.
