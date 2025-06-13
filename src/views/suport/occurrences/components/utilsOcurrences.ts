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

type Action = "Adicionou" | "Atribuiu" | "Atualizou" | "Finalizou";

export const auditActionColors: Record<Action, string> = {
  "Adicionou": "#22c55e",       
  "Atribuiu": "#3b82f6",    
  "Atualizou": "#eab308",    
  "Finalizou": "#ef4444", 
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

export function getTicketInfoByTitle(title: string): {
  description: string;
  expiredAt: number;
} {
  const mapping: Record<string, { description: string; expiredAt: number }> = {
    "Erro de KYC": {
      description: "Verificar se o usuário é novo\nVerificar motivo de reject do KYC",
      expiredAt: 4,
    },
    "N3 KYC ERROR": {
      description: "Verificar se o nível anterior não conseguiria resolver",
      expiredAt: 2,
    },
    "Retorno de KYC ERROR pro anterior": {
      description: "Entrar em contato com o cliente para avisar o procedimento",
      expiredAt: 1,
    },
    "Avaliação de tratativa de evento": {
      description: "Verificar atuação deste evento",
      expiredAt: 100,
    },
    "EMAIL AJUDA UNIVERSITARIOS": {
      description:
        "Querido Cliente sua demanda já está em análise com nosso grupo de pessoas qualificadas (ou não) do N3 aguarde atualizações",
      expiredAt: 0,
    },
  };

  return mapping[title] || { description: "", expiredAt: 0 };
}
