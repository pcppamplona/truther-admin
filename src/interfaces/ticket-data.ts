export interface TicketData {
  id?: number;
  createdBy: User;
  client: Client | null;
  assignedTo: Group | User | null;
  reason: Reason;
  status: Status;
  createdAt: string;
}

export type User = {
  id: number;
  name: string;
  group: string;
};

export type Client = {
  id: number;
  name: string;
  document: string;
  phone: string;
};


export type Reason = {
  id: number;
  categoryId: string;
  type: string;
  reason: string;
  expiredAt: string;
  description: string;
  typeRecipient: TypeRecipient;
  recipient: string; 
};

export type TypeRecipient = "GROUP" | "USER" | "ALL";
export type Group = "N1" | "N2" | "N3" | "PRODUTO" | "MKT" | "ADMIN";
export const groupHierarchy: Record<Group, number> = {
  N1: 1,
  N2: 2,
  N3: 3,
  PRODUTO: 4,
  MKT: 5,
  ADMIN: 6,
};

export type Status =
  | "PENDENTE"
  | "PENDENTE EXPIRADO"
  | "EM ANDAMENTO"
  | "EM ANDAMENTO EXPIRADO"
  | "FINALIZADO"
  | "FINALIZADO EXPIRADO"
  | "AGUARDANDO RESPOSTA DO CLIENTE";

  
//commentário
export interface TicketComment {
  id?: string | number;
  ticketId: string | number;
  author: string;
  message: string;
  date: string;
}

//auditorias
export interface TicketAudit {
  id?: string | number;
  ticketId: string | number;
  action: "Adicionou" | "Atribuiu" | "Atualizou" | "Finalizou";
  performedBy: User;
  message: string;
  description: string;
  date: string;
}

//parte de finalização do reason
export type FinalizationReply = {
  id: number;
  reasonId: number;
  reply: string;
  actionType: "none" | "new_event";
};