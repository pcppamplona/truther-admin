import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TicketData, FinalizationReply, TicketComment } from "@/interfaces/ticket-data";
import { useAuth } from "@/store/auth";
import {
  updateTicket,
  useCreateTicket,
  useCreateTicketAudit,
  useCreateTicketComment
} from "./useTickets";
import { getReasonById, getReplyActions } from "./useReasons";

interface FinalizeTicketFlowParams {
  ticket: TicketData;
  reply: FinalizationReply;
  commentText?: string;
  forceAssign?: boolean; // NOVO
}

export function useFinalizeTicketFlowV2() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticket, reply, commentText, forceAssign }: FinalizeTicketFlowParams) => {
      const now = new Date().toISOString();

      // Cria comentário se informado
      if (commentText && commentText.trim() !== "") {
        const commentPayload: TicketComment = {
          ticketId: ticket.id,
          author: user!.name,
          message: commentText,
          date: now,
        };
        await useCreateTicketComment(commentPayload);

        await useCreateTicketAudit({
          ticketId: ticket.id,
          action: "Adicionou",
          performedBy: {
            id: user!.id,
            name: user!.name,
            group: user!.groupLevel,
          },
          message: "um novo Comentário",
          description: `Comentário adicionado ao ticket ${ticket.id}`,
          date: now,
        });
      }

      // Executa ReplyActions
      const actions = await getReplyActions(reply.id);

      if (actions.length > 0) {
        for (const action of actions) {
          if (action.type === "new_event") {
            const reasonData = await getReasonById(action.data.reasonId!);
            await useCreateTicket({
              createdBy: {
                id: user!.id,
                name: user!.name,
                group: user!.groupLevel,
              },
              client: ticket.client,
              assignedTo: {
                id: user!.id,
                name: user!.name,
                group: action.data.groupId ?? user!.groupLevel,
              },
              reason: reasonData,
              status: "PENDENTE",
              createdAt: now,
            });

            await useCreateTicketAudit({
              ticketId: ticket.id!,
              action: "Atualizou",
              performedBy: {
                id: user!.id,
                name: user!.name,
                group: user!.groupLevel,
              },
              message: "Criou novo evento",
              description: `Criado novo evento vinculado à finalização de ${ticket.id}`,
              date: now,
            });
          }

          if (action.type === "send_email") {
            console.log(`Email enviado para: ${action.data.email} - ${action.data.title}`);
          }
        }
      }

      // Finaliza ticket com atribuição condicional
      await updateTicket(ticket.id!, {
        status: "FINALIZADO",
        assignedTo:
          ticket.assignedTo ??
          (forceAssign
            ? {
                id: user!.id,
                name: user!.name,
                group: user!.groupLevel,
              }
            : null),
      });

      await useCreateTicketAudit({
        ticketId: ticket.id,
        action: "Finalizou",
        performedBy: {
          id: user!.id,
          name: user!.name,
          group: user!.groupLevel,
        },
        message: "Finalizou o Ticket",
        description: `Ticket ${ticket.id} finalizado por ${user!.name}`,
        date: now,
      });

      await queryClient.invalidateQueries({ queryKey: ["tickets"] });
      await queryClient.invalidateQueries({ queryKey: ["ticket-id", ticket.id] });
    },
  });
}
