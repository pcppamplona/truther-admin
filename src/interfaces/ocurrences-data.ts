export interface TicketData {
  id?: number;
  title: string;
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
  
  // Comentários
  comments?: Comment[];
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

export interface Comment {
  id: string;
  author: string;
  message: string;
  date: string;
}

export interface Reply {
  id: string;
  author: string;
  message: string;
  date: string;
  visibleToCustomer: boolean;
}

export interface TicketAudit {
  id?: number;
  ticketId: number;
  action: "CRIADO" | "ATRIBUÍDO" | "ATUALIZADO" | "FINALIZADO";
  performedBy: UserSuport;
  message: string;
  date: string;
}