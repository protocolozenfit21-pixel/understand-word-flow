import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { AppState, Favorite, JournalEntry, NoteEntry } from "@/types";

/**
 * Camada única de acesso ao estado do usuário.
 * Hoje persiste em localStorage; para migrar para Lovable Cloud basta
 * trocar `read`/`persist` por chamadas ao banco, sem mexer na UI.
 */

const KEY = "biblia-app-state-v1";

export const initialState: AppState = {
  profile: null,
  lastRead: { book: "mateus", bookName: "Mateus", chapter: 5, verse: 12 },
  readChapters: ["salmos-23", "filipenses-4"],
  streak: 7,
  streakUpdatedAt: null,
  minutesRead: 240,
  favorites: [
    {
      id: "f1",
      collection: "Paz",
      reference: "Salmos 23:1",
      text: "O Senhor é o meu pastor; nada me faltará.",
      note: "Ler nos dias de correria.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "f2",
      collection: "Ansiedade",
      reference: "Filipenses 4:6",
      text: "Não estejais inquietos por coisa alguma...",
      createdAt: new Date().toISOString(),
    },
  ],
  highlights: ["salmos-23-4"],
  notes: [],
  journal: [
    {
      id: "j1",
      reference: "Salmos 23",
      content: "Hoje percebi que preciso confiar mais no processo e menos no controle.",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  challengeProgress: { "biblia-1-ano": 127 },
  journeyDone: ["conhecendo", "criacao"],
  completedDailyChallenges: [],
  notifications: { morning: true, reading: true, streak: false, night: false, hour: "07:00" },
  theme: "light",
};

let state: AppState = initialState;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignora quota */
  }
}

export function hydrateStore() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...initialState, ...(JSON.parse(raw) as Partial<AppState>) };
  } catch {
    /* estado padrão */
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setState(updater: (prev: AppState) => AppState) {
  state = updater(state);
  persist();
  emit();
}

export function useAppState<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(initialState),
  );
}

export function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    hydrateStore();
    setReady(true);
  }, []);
  return ready;
}

const id = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);

export const actions = {
  saveProfile(profile: AppState["profile"]) {
    setState((s) => ({ ...s, profile }));
  },
  setLastRead(lastRead: AppState["lastRead"]) {
    setState((s) => ({ ...s, lastRead }));
  },
  completeReading(bookId: string, chapter: number, minutes: number) {
    const key = `${bookId}-${chapter}`;
    setState((s) => {
      const alreadyToday = s.streakUpdatedAt === today();
      return {
        ...s,
        readChapters: s.readChapters.includes(key) ? s.readChapters : [...s.readChapters, key],
        minutesRead: s.minutesRead + minutes,
        streak: alreadyToday ? s.streak : s.streak + 1,
        streakUpdatedAt: today(),
      };
    });
  },
  toggleHighlight(key: string) {
    setState((s) => ({
      ...s,
      highlights: s.highlights.includes(key) ? s.highlights.filter((h) => h !== key) : [...s.highlights, key],
    }));
  },
  addFavorite(fav: Omit<Favorite, "id" | "createdAt">) {
    setState((s) => {
      if (s.favorites.some((f) => f.reference === fav.reference)) {
        return { ...s, favorites: s.favorites.filter((f) => f.reference !== fav.reference) };
      }
      return { ...s, favorites: [{ ...fav, id: id(), createdAt: new Date().toISOString() }, ...s.favorites] };
    });
  },
  removeFavorite(favId: string) {
    setState((s) => ({ ...s, favorites: s.favorites.filter((f) => f.id !== favId) }));
  },
  updateFavoriteNote(favId: string, note: string) {
    setState((s) => ({ ...s, favorites: s.favorites.map((f) => (f.id === favId ? { ...f, note } : f)) }));
  },
  addNote(note: Omit<NoteEntry, "id" | "createdAt">) {
    setState((s) => ({ ...s, notes: [{ ...note, id: id(), createdAt: new Date().toISOString() }, ...s.notes] }));
  },
  addJournal(entry: Omit<JournalEntry, "id" | "createdAt">) {
    setState((s) => ({ ...s, journal: [{ ...entry, id: id(), createdAt: new Date().toISOString() }, ...s.journal] }));
  },
  removeJournal(entryId: string) {
    setState((s) => ({ ...s, journal: s.journal.filter((j) => j.id !== entryId) }));
  },
  advanceChallenge(challengeId: string) {
    setState((s) => ({
      ...s,
      challengeProgress: { ...s.challengeProgress, [challengeId]: (s.challengeProgress[challengeId] ?? 0) + 1 },
    }));
  },
  joinChallenge(challengeId: string) {
    setState((s) =>
      s.challengeProgress[challengeId] !== undefined
        ? s
        : { ...s, challengeProgress: { ...s.challengeProgress, [challengeId]: 1 } },
    );
  },
  completeJourneyStep(stepId: string) {
    setState((s) => ({
      ...s,
      journeyDone: s.journeyDone.includes(stepId) ? s.journeyDone : [...s.journeyDone, stepId],
    }));
  },
  completeDailyChallenge() {
    setState((s) => ({
      ...s,
      completedDailyChallenges: s.completedDailyChallenges.includes(today())
        ? s.completedDailyChallenges
        : [...s.completedDailyChallenges, today()],
    }));
  },
  setNotifications(patch: Partial<AppState["notifications"]>) {
    setState((s) => ({ ...s, notifications: { ...s.notifications, ...patch } }));
  },
  setTheme(theme: "light" | "dark") {
    setState((s) => ({ ...s, theme }));
  },
  reset() {
    setState(() => initialState);
  },
};

export function useTheme() {
  const theme = useAppState((s) => s.theme);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  const toggle = useCallback(() => actions.setTheme(theme === "dark" ? "light" : "dark"), [theme]);
  return { theme, toggle };
}

export function useStats() {
  const s = useAppState((st) => st);
  const booksDone = new Set(s.readChapters.map((c) => c.split("-")[0])).size;
  return {
    chapters: s.readChapters.length,
    streak: s.streak,
    minutes: s.minutesRead,
    hours: Math.round((s.minutesRead / 60) * 10) / 10,
    books: booksDone,
    favorites: s.favorites.length,
    journal: s.journal.length,
    challenges: Object.keys(s.challengeProgress).length,
  };
}
