import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CopyEntry {
  id: string;
  text: string;
  tool: string;
  at: number;
}

interface AppState {
  favorites: string[];
  recent: string[];
  copyHistory: CopyEntry[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  visitTool: (slug: string) => void;
  addCopy: (entry: Omit<CopyEntry, "id" | "at">) => void;
  clearCopyHistory: () => void;
}

const MAX_RECENT = 8;
const MAX_COPY = 20;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recent: [],
      copyHistory: [],
      toggleFavorite: (slug) =>
        set((s) => ({
          favorites: s.favorites.includes(slug)
            ? s.favorites.filter((f) => f !== slug)
            : [slug, ...s.favorites],
        })),
      isFavorite: (slug) => get().favorites.includes(slug),
      visitTool: (slug) =>
        set((s) => ({
          recent: [slug, ...s.recent.filter((r) => r !== slug)].slice(
            0,
            MAX_RECENT,
          ),
        })),
      addCopy: (entry) =>
        set((s) => {
          const at = Date.now();
          return {
            copyHistory: [
              { ...entry, id: `${entry.tool}-${at}`, at },
              ...s.copyHistory,
            ].slice(0, MAX_COPY),
          };
        }),
      clearCopyHistory: () => set({ copyHistory: [] }),
    }),
    {
      name: "seo-text-tools",
      partialize: (s) => ({
        favorites: s.favorites,
        recent: s.recent,
        copyHistory: s.copyHistory,
      }),
    },
  ),
);
