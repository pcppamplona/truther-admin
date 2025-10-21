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

import { Status } from "@/interfaces/TicketData";
import { ActionType, methodType } from "@/interfaces/AuditLogData";

export const statusColors: Record<Status, string> = {
  "PENDENTE": "#FFA500",
  "PENDENTE EXPIRADO": "#F97316",
  "EM ANDAMENTO": "#1c51dc",
  "EM ANDAMENTO EXPIRADO": "#2563EB",
  "FINALIZADO": "#008000",
  "FINALIZADO EXPIRADO": "#E11D48",
  "AGUARDANDO RESPOSTA DO CLIENTE": "#CCCC00",
};

export const methodColors: Record<methodType, string> = {
    POST: "text-[#f4da7a]",
    DELETE: "text-[#d18785]",
    GET: "text-[#5aaa7a]",
    UPDATE: "text-[#73acf3]",
    PATCH: "text-[#ad98ca]",
  };

export const actionColors: Record<ActionType, string> = {
    alter: "border-[#3319c7]",
    listing: "border-[#9e3790]",
    crm: "border-[#a57b2c]",
    security: "border-[#1a6b80]",
  };

export function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getColorRGBA<T extends string>(
  key: T,
  colorMap: Record<T, string>,
  alpha: number
): string {
  const hex = colorMap[key];
  return hexToRGBA(hex, alpha);
}
