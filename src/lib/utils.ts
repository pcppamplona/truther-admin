import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useThemeStore } from "@/store/theme";
import { useEffect } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ThemeInitializer() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return null;
}

import { RoleId, Status } from "@/interfaces/TicketData";
import { ActionType, methodType } from "@/interfaces/AuditLogData";
import { BcStatusBillet, poStatusBlockchain, TxStatusBridge } from "@/interfaces/Transactions";

export const statusColors: Record<Status, string> = {
  PENDENTE: "#FFA500",
  "PENDENTE EXPIRADO": "#F97316",
  "EM ANDAMENTO": "#1c51dc",
  "EM ANDAMENTO EXPIRADO": "#2563EB",
  FINALIZADO: "#22C55E",
  "FINALIZADO EXPIRADO": "#E11D48",
  "AGUARDANDO RESPOSTA DO CLIENTE": "#CCCC00",
};


export const txStatusColors: Record<TxStatusBridge, string> = {
  SUCCESS: "#22C55E",
  COMPLETED: "#10B981", 
  FAILED: "#EF4444",
  FAILED_BRIDGE: "#DC2626", 
  DUPLICATED: "#F59E0B",
  NEEDCHECK: "#FBBF24", 
  WAITING_CONFIRM: "#FACC15", 
  WAITING_REFUND: "#FACC15",
  PROCESSING: "#3B82F6",
  PROCESSING_2GO: "#60A5FA", 
  REFUND: "#0EA5E9",
  REFUNDED: "#3B82F6", 
  CHECKING: "#94A3B8",
  CANCELED: "#9CA3AF", 
  PENDING_WITHDRAWAL: "#1E40AF", 
  EME: "#000000",
  NEW: "#3B82F6",
  EXECUTING: "#a855f7"
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

export const bcStatusBilletColors: Record<BcStatusBillet, string> = {
  CONFIRMED: "#22C55E", 
  REFUNDED: "#3B82F6", 
  QUEUED: "#FACC15",    
  DROP: "#EF4444",       
};

export const poColors: Record<poStatusBlockchain, string> = {
  CONFIRMED: "#22C55E",
  REFUNDED: "#3B82F6",
  NEW: "#3B82F6",
  DROP: "#EF4444",
  CANCEL: "#d18785",      
  PROCESSING: "#FACC15",
};


export function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getColorRGBA(
  key: string,
  colorMap: Record<string, string>,
  alpha: number
): string {
  const hex = colorMap[key];
  if (!hex) return "rgba(128,128,128,0.3)"; 
  return hexToRGBA(hex, alpha);
}

export function getRoleNameById(id?: number | null): string {
  const role = RoleId.find((r) => r.id === id);
  return role ? role.name : "-";
}