export type Verse = {
  n: number;
  /** Texto bíblico (tradução de domínio público / livre). */
  text: string;
  /** Mesma passagem em linguagem atual e acessível (camada gerada). */
  simple?: string;
};

export type Insight = {
  summary: string;
  speaker: string;
  audience: string;
  place: string;
  period: string;
  context: string;
  meaning: string;
  today: string;
  reflection: string;
  /** Nota de neutralidade quando há interpretações diferentes. */
  interpretations?: string;
};

export type Chapter = {
  number: number;
  title: string;
  verses: Verse[];
  insight?: Insight;
  minutes: number;
};

export type BibleBook = {
  id: string;
  name: string;
  testament: "antigo" | "novo";
  group: string;
  summary: string;
  chapters: Chapter[];
  totalChapters: number;
};

/** Metadado canônico de um dos 66 livros. */
export type BookMeta = {
  id: string;
  abbrev: string;
  name: string;
  testament: "antigo" | "novo";
  group: string;
  order: number;
  totalChapters: number;
  summary?: string;
};

/** Capítulo vindo do banco: texto sempre presente, camadas quando já geradas. */
export type ChapterPayload = {
  book: BookMeta;
  chapter: number;
  title: string;
  minutes: number;
  verses: Verse[];
  insight: Insight | null;
  layersReady: boolean;
};


export type QuizQuestion = {
  id: string;
  kind: "multipla" | "verdadeiro-falso" | "completar";
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Challenge = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  days: number;
  readings: number;
  minutesPerDay: number;
  featured?: boolean;
  plan: { day: number; title: string; reference: string; route?: ChapterRef }[];
};

export type ChapterRef = { book: string; chapter: number };

export type JourneyStep = {
  id: string;
  emoji: string;
  title: string;
  era: string;
  summary: string;
  reading: string;
  route?: ChapterRef;
  context: string;
  characters: string[];
  reflection: string;
  questions: string[];
};

export type TimelineEvent = {
  id: string;
  emoji: string;
  title: string;
  period: string;
  place: string;
  characters: string[];
  passages: string[];
  description: string;
};

export type Achievement = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  goal: number;
  metric: "readings" | "streak" | "books" | "favorites" | "journal" | "challenges";
};

export type Theme = {
  id: string;
  emoji: string;
  name: string;
  verses: { reference: string; text: string; route?: ChapterRef }[];
  readings: { title: string; reference: string; route?: ChapterRef }[];
  reflection: string;
  challengeId?: string;
};

export type DailyMessage = {
  reference: string;
  verse: string;
  reflection: string;
  prayer: string;
  challenge: string;
  route?: ChapterRef;
};

export type ShortReading = {
  id: string;
  minutes: 5 | 10 | 20;
  title: string;
  reference: string;
  route: ChapterRef;
  why: string;
};

export type Favorite = {
  id: string;
  collection: string;
  reference: string;
  text: string;
  note?: string;
  createdAt: string;
};

export type JournalEntry = {
  id: string;
  reference: string;
  content: string;
  createdAt: string;
};

export type NoteEntry = {
  id: string;
  reference: string;
  content: string;
  createdAt: string;
};

export type OnboardingProfile = {
  name: string;
  experience: string;
  goal: string;
  styles: string[];
  completedAt: string;
};

export type AppState = {
  profile: OnboardingProfile | null;
  lastRead: { book: string; bookName: string; chapter: number; verse: number } | null;
  readChapters: string[];
  streak: number;
  streakUpdatedAt: string | null;
  minutesRead: number;
  favorites: Favorite[];
  highlights: string[];
  notes: NoteEntry[];
  journal: JournalEntry[];
  challengeProgress: Record<string, number>;
  journeyDone: string[];
  completedDailyChallenges: string[];
  notifications: { morning: boolean; reading: boolean; streak: boolean; night: boolean; hour: string };
  theme: "light" | "dark";
};
