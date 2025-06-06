export interface TicketData {
  id?: number;
  title: string;
  description: string;
  status: TicketStatus;
  assignedTo: UserSuport;           
  
  // Identificações de usuários
  createdBy: UserSuport;               
  lastInteractedBy?: UserSuport;                       
  client: Client;               
  
  // Datas
  createdAt: string;
  startedAt?: string;                 
  expiredAt?: string;                 
  
  // Comentários e respostas
  comments?: Comment[];
  replies?: Reply[];
  
  groupSuport: GroupSuport; 
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

export interface Client {
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