import { TicketAudit, TicketComment, TicketData } from "@/interfaces/ocurrences-data";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async (): Promise<TicketData[]> => {
      const response = await api.get("tickets");
      return await response.json<TicketData[]>();
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useTicketId = (id: number) => {
  return useQuery({
    queryKey: ["ticket-id", id],
    queryFn: async (): Promise<TicketData[]> => {
      const response = await api.get("tickets", {
        searchParams: { id: String(id) },
      });
      return await response.json<TicketData[]>();
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const updateTicket = async (
  id: number,
  data: Partial<TicketData>
): Promise<TicketData> => {
  const response = await api.patch(`tickets/${id}`, {
    json: data,
  });

  return await response.json<TicketData>();
};

export async function useCreateTicketComment(
  CreateTicketComment: TicketComment
): Promise<TicketComment | null> {
  console.log("Chamo o hook do useCreateTicketComment ")
  try {
    const newTicketComment: TicketComment = await api
      .post("ticketComments", { json: CreateTicketComment })
      .json<TicketComment>();
    return newTicketComment;
  } catch (error) {
    console.error("Erro ao criar comentário do ticket:", error);
    return null;
  }
}

export function useTicketComments(ticketId: string) {
  return useQuery({
    queryKey: ["ticketComments", ticketId],
    queryFn: async () => {
      const comments = await api
        .get(`ticketComments?ticketId=${ticketId}`)
        .json<TicketComment[]>();
      return comments;
    },
    enabled: !!ticketId,
  });
}

export async function useCreateTicket(
  CreateTicket: TicketData
): Promise<TicketData | null> {
  try {
    const newTicket: TicketData = await api
      .post("tickets", { json: CreateTicket })
      .json();
    return newTicket;
  } catch (error) {
    console.error("Erro ao criar ticket:", error);
    return null;
  }
}

export const useTicketAudit = () => {
  return useQuery({
    queryKey: ["ticket-audit"],
    queryFn: async (): Promise<TicketAudit[]> => {
      const response = await api.get("ticketAudit");
      return await response.json<TicketAudit[]>();
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useTicketAuditId = (ticketId: number) => {
  return useQuery({
    queryKey: ["ticket-audit-id", ticketId],
    queryFn: async (): Promise<TicketAudit[]> => {
      const response = await api.get("ticketAudit", {
        searchParams: { ticketId: String(ticketId) },
      });
      return await response.json<TicketAudit[]>();
    },
    enabled: !!ticketId,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export async function useCreateTicketAudit(
  CreateTicketAuditData: TicketAudit
): Promise<TicketAudit | null> {
  console.log("Chamo pra cria a audit>>", CreateTicketAuditData)
  try {
    const newTicketAudit: TicketAudit = await api
      .post("ticketAudit", { json: CreateTicketAuditData })
      .json();
    return newTicketAudit;
  } catch (error) {
    console.error("Erro ao criar ticket Audit:", error);
    return null;
  }
}
