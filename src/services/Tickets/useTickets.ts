import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import {
  FinalizationReply,
  TicketAudit,
  TicketComment,
  TicketData,
} from "@/interfaces/TicketData";
import { useAuthStore } from "@/store/auth";

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
  console.log(">>>>updateTicket:", data);
  const response = await api.patch(`tickets/${id}`, {
    json: data,
  });

  return await response.json<TicketData>();
};

export async function useCreateTicketComment(
  CreateTicketComment: TicketComment
): Promise<TicketComment | null> {
  console.log(">>> hook useCreateTicketComment ");
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
  console.log(">>>useCreateTicketAudit:", CreateTicketAuditData);
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

interface FinalizeTicketFlowParams {
  ticket: TicketData;
  reply: FinalizationReply | null;
  commentText?: string;
}

export function useFinalizeTicketFlow() {
  const { user } = useAuthStore();
  
  const queryClient = useQueryClient();

  const finalize = useMutation({
    mutationFn: async ({
      ticket,
      reply,
      commentText,
    }: FinalizeTicketFlowParams) => {

      const now = new Date().toISOString();

      // 1️⃣ Adiciona comentário se necessário
      if (reply?.comment && commentText) {
        const commentPayload: TicketComment = {
          ticketId: ticket.id!,
          author: user?.name!!,
          message: commentText,
          date: now,
        };
        await useCreateTicketComment(commentPayload);

        await useCreateTicketAudit({
          ticketId: ticket.id!,
          action: "Adicionou",
          performedBy: {
            id: user?.id!!,
            name: user?.name!!,
            group: user?.groupLevel,
          },
          message: "um novo Comentário",
          description: `Comentário adicionado por ${user?.name}, ao ticket: ${ticket.id}`,
          date: now,
        });
      }

      // 2️⃣ Prepara payload de atualização do ticket
      const updatePayload: Partial<TicketData> = {
        status: "FINALIZADO",
      };

      const needsAssignment = !ticket.assignedTo;

      if (needsAssignment) {
        updatePayload.assignedTo = {
          id: user?.id!!,
          name: user?.name!!,
          group: user?.groupLevel,
        };
      }

      // 3️⃣ Atualiza ticket com todos os dados necessários
      await updateTicket(ticket.id!, updatePayload);

      // 4️⃣ Auditorias de atribuição (se aplicável)
      if (needsAssignment) {
        await useCreateTicketAudit({
          ticketId: ticket.id!,
          action: "Atribuiu",
          performedBy: {
            id: user?.id!!,
            name: user?.name!!,
            group: user?.groupLevel,
          },
          message: "um Ticket",
          description: `Ocorrência ${ticket.id} atribuída a ${user?.name}.`,
          date: now,
        });
      }

      // 5️⃣ Auditoria de finalização
      await useCreateTicketAudit({
        ticketId: ticket.id!,
        action: "Atualizou",
        performedBy: {
          id: user?.id!!,
          name: user?.name!!,
          group: user?.groupLevel,
        },
        message: "um Ticket",
        description: `Ocorrência ${ticket.id} marcada como FINALIZADO por ${user?.name}.`,
        date: now,
      });

      // 6️⃣ Refetch dos dados
      await queryClient.invalidateQueries({ queryKey: ["tickets"] });
      await queryClient.invalidateQueries({ queryKey: ["ticket-id", ticket.id] });
    },
  });

  return finalize;
}
