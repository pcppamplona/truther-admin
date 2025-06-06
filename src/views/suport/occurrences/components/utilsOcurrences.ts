type Status =
  | "PENDENTE"
  | "PENDENTE EXPIRADO"
  | "EM ANDAMENTO"
  | "EM ANDAMENTO EXPIRADO"
  | "FINALIZADO"
  | "FINALIZADO EXPIRADO"
  | "AGUARDANDO RESPOSTA DO CLIENTE";

export const statusColors: Record<Status, string> = {
  "PENDENTE": "#FFA500",                 
  "PENDENTE EXPIRADO": "#F97316",        
  "EM ANDAMENTO": "#0000FF",            
  "EM ANDAMENTO EXPIRADO": "#2563EB",     
  "FINALIZADO": "#008000",                 
  "FINALIZADO EXPIRADO": "#E11D48",    
  "AGUARDANDO RESPOSTA DO CLIENTE": "#CCCC00",
};

export function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getStatusColorRGBA(status: Status, alpha: number): string {
  const hex = statusColors[status];
  return hexToRGBA(hex, alpha);
}