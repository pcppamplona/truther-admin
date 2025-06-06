import { TicketAudit, TicketData } from "@/interfaces/ocurrences-data";
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