export interface TicketData {
  id: number;
  created_by: UserTicket;
  client: ClientTicket;
  assigned_group: string | null;
  assigned_user: UserTicket | null;
  reason: Reason;
  status: Status;
  created_at: string;
}

export type UserTicket = {
  id: number;
  name: string;
  group_level: string;
};

export type ClientTicket = {
  id: number;
  name: string;
  document: string;
  phone: string;
};


export type Reason = {
  id: number;
  category_id: string;
  type: string;
  reason: string;
  expired_at: number;
  description: string;
  type_recipient: TypeRecipient;
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

export interface TicketComment {
  id?: number;
  ticket_id: number; 
  author: string;
  message: string;
  date?: string;
}

export interface ReplyAction {
  id: number;
  reply_id: number;
  action_type_id: number;
  data_email: string | null;
  data_new_ticket_reason_id: number | null;
  data_new_ticket_assign_to_group: Group | null;
}

export type FinalizationReply = {
  id: number;
  reason_id: number;
  reply: string;
  comment: boolean;
};

export interface FinalizeTicketPayload {
  id: number;
  reply_id: number;
  comment?: string;
}

export interface FinalizeTicketInput {
  ticket_id: number;
  reply_id: number;
  comment?: string;
  user?: {
    id: number;
    name: string;
    group: string;
  };
}


export interface TicketTyped {
  id?: number;
  created_by: number;           
  client_id: number | null;     
  assigned_group: Group | null; 
  assigned_user: number | null;
  reason_id: number;          
  status: Status;
  created_at?: string;
  finalizate_reply?: number;
}

export interface UpdateTicketInput {
  id: number;
  data: Partial<TicketTyped>;
}