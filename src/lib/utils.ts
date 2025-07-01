import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { useThemeStore } from "@/store/theme";
import { useEffect } from "react";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ThemeInitializer() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme)

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  return null 
}