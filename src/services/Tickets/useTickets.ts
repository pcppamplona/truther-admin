import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../api";
import {
  TicketComment,
  TicketData,
  TicketTyped,
  UpdateTicketInput,
} from "@/interfaces/TicketData";
import { PaginateData } from "@/interfaces/PaginateData";
import { AuditLog } from "@/interfaces/AuditLogData";

export const useTickets = (
  page: number,
  limit: number,
  search?: string,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC"
) => {
  return useQuery<PaginateData<TicketData>>({
    queryKey: ["tickets", page, limit, search, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) params.append("search", search);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);

      const { data } = await api.get<PaginateData<TicketData>>(
        `tickets/paginated?${params.toString()}`
      );
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
  });
};

export const useTicketId = (id: number) => {
  return useQuery({
    queryKey: ["tickets-id", id],
    queryFn: async (): Promise<TicketData> => {
      const { data } = await api.get<TicketData>(`tickets/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<TicketTyped>) => {
      const { data } = await api.post("tickets", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useTicketComments = (ticket_id: number) => {
  return useQuery({
    queryKey: ["tickets-comments", ticket_id],
    queryFn: async (): Promise<TicketComment[]> => {
      const { data } = await api.get<TicketComment[]>(
        `tickets/comments/${ticket_id}`
      );
      return data;
    },
    enabled: !!ticket_id,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  const updateTicket = async ({ id, data }: UpdateTicketInput): Promise<TicketTyped> => {
    const response = await api.patch<TicketTyped>(`/tickets/${id}`, data);
    console.log("response:", response.data);
    return response.data;
  };

  return useMutation({
    mutationFn: updateTicket,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-id", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tickets-audit", variables.id] }); 
    },
  });
}

export const useCreateTicketComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TicketComment) => {
      const { data } = await api.post("tickets/comments", payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-id", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tickets-comments", variables.ticket_id]});
      queryClient.invalidateQueries({ queryKey: ["tickets-audit", variables.ticket_id]});
    },
  });
};

export const useTicketAudit = (ticket_id: number) => {
  return useQuery({
    queryKey: ["tickets-audit", ticket_id],
    queryFn: async (): Promise<AuditLog[]> => {
      const { data } = await api.get<AuditLog[]>(
        `audit-logs/ticket/${ticket_id}`
      );
      return data;
    },
    enabled: !!ticket_id,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

// interface FinalizeTicketFlowParams {
//   ticket: TicketData;
//   reply: FinalizationReply | null;
//   commentText?: string;
// }

// export function useFinalizeTicketFlow() {
//   const { user } = useAuthStore();

//   const queryClient = useQueryClient();

//   const finalize = useMutation({
//     mutationFn: async ({
//       ticket,
//       reply,
//       commentText,
//     }: FinalizeTicketFlowParams) => {

//       const now = new Date().toISOString();

//       // 1️⃣ Adiciona comentário se necessário
//       if (reply?.comment && commentText) {
//         const commentPayload: TicketComment = {
//           ticketId: ticket.id!,
//           author: user?.name!!,
//           message: commentText,
//           date: now,
//         };
//         await useCreateTicketComment(commentPayload);

//         await useCreateTicketAudit({
//           ticketId: ticket.id!,
//           action: "Adicionou",
//           performedBy: {
//             id: user?.id!!,
//             name: user?.name!!,
//             group: user?.groupLevel,
//           },
//           message: "um novo Comentário",
//           description: `Comentário adicionado por ${user?.name}, ao ticket: ${ticket.id}`,
//           date: now,
//         });
//       }

//       // 2️⃣ Prepara payload de atualização do ticket
//       const updatePayload: Partial<TicketData> = {
//         status: "FINALIZADO",
//       };

//       const needsAssignment = !ticket.assignedTo;

//       if (needsAssignment) {
//         updatePayload.assignedTo = {
//           id: user?.id!!,
//           name: user?.name!!,
//           group: user?.groupLevel,
//         };
//       }

//       // 3️⃣ Atualiza ticket com todos os dados necessários
//       await updateTicket(ticket.id!, updatePayload);

//       // 4️⃣ Auditorias de atribuição (se aplicável)
//       if (needsAssignment) {
//         await useCreateTicketAudit({
//           ticketId: ticket.id!,
//           action: "Atribuiu",
//           performedBy: {
//             id: user?.id!!,
//             name: user?.name!!,
//             group: user?.groupLevel,
//           },
//           message: "um Ticket",
//           description: `Ocorrência ${ticket.id} atribuída a ${user?.name}.`,
//           date: now,
//         });
//       }

//       // 5️⃣ Auditoria de finalização
//       await useCreateTicketAudit({
//         ticketId: ticket.id!,
//         action: "Atualizou",
//         performedBy: {
//           id: user?.id!!,
//           name: user?.name!!,
//           group: user?.groupLevel,
//         },
//         message: "um Ticket",
//         description: `Ocorrência ${ticket.id} marcada como FINALIZADO por ${user?.name}.`,
//         date: now,
//       });

//       // 6️⃣ Refetch dos dados
//       await queryClient.invalidateQueries({ queryKey: ["tickets"] });
//       await queryClient.invalidateQueries({ queryKey: ["ticket-id", ticket.id] });
//     },
//   });

//   return finalize;
// }
