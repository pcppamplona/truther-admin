export interface TicketData {
  id?: number;
  reason: string;
  description: string;
  expiredAt?: string;
  status: TicketStatus;
  groupSuport: GroupSuport; 
  createdAt: string;
  createdBy: UserSuport;               
  assignedTo?: UserSuport | null;        
  lastInteractedBy?: UserSuport;                       
  requester: Requester | null;
  startedAt?: string;                 
}

export type GroupSuport = "N1" | "N2" | "N3" | "PRODUTO" | "MKT" | "ADMIN" ;

export interface TicketStatus {
  title: string;
  status:
    | "PENDENTE"
    | "PENDENTE EXPIRADO"
    | "EM ANDAMENTO"
    | "EM ANDAMENTO EXPIRADO"
    | "FINALIZADO"
    | "FINALIZADO EXPIRADO"
    | "AGUARDANDO RESPOSTA DO CLIENTE";
  description: string;
}

export interface UserSuport {
  id: number;
  name: string;
  groupSuport: GroupSuport;
}

export interface Requester {
  id: number;
  name: string;
  document: string;
  phone: string;
}


export interface TicketComment {
  id?: string;
  ticketId: string;
  author: string;
  message: string;
  date: string;
}

export interface TicketAudit {
  id?: string | number;
  ticketId: number;
  action: "Adicionou" | "Atribuíu" | "Atualizou" | "Finalizou";
  performedBy: UserSuport;
  message: string;
  description: string;
  date: string;
}