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
  date: string;
}

export interface ReplyAction {
  id: number;
  reply_id: number;
  type: "new_event" | "send_email";
  data: {
    reason_id?: number;
    group_id?: string;
    user_id?: number;
    email?: string;
    title?: string;
    body?: string;
  };
}

export type FinalizationReply = {
  id: number;
  reasonId: number;
  reply: string;
  comment: Boolean
};

export interface FinalizeTicketInput {
  ticketId: number;
  replyId: number;
  commentText?: string;
  forceAssign?: boolean;
  user: {
    id: string;
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
  created_at: string;
}

export interface UpdateTicketInput {
  id: number;
  data: Partial<TicketTyped>;
}