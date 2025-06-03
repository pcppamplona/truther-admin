import { create } from "zustand"

export type Theme = "light" | "dark" | "system"

type ThemeStore = {
  theme: Theme
  setTheme: (theme: Theme) => void
  initializeTheme: () => void
}

const storageKey = "vite-ui-theme"

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: (localStorage.getItem(storageKey) as Theme) || "system",

  setTheme: (theme) => {
    localStorage.setItem(storageKey, theme)
    set({ theme })
    applyTheme(theme)
  },

  initializeTheme: () => {
    const stored = (localStorage.getItem(storageKey) as Theme) || "system"
    set({ theme: stored })
    applyTheme(stored)
  },
}))

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove("light", "dark")

  if (theme === "system") {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    root.classList.add(systemPrefersDark ? "dark" : "light")
  } else {
    root.classList.add(theme)
  }
}
