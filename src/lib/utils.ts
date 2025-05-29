import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import ky from "ky";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const api = ky.create({
  prefixUrl: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});
