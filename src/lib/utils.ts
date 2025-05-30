import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import ky from "ky";
import { Theme } from "@/store/theme";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const api = ky.create({
  prefixUrl: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const applyThemeToCSSVariables = (theme: Theme) => {
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
};