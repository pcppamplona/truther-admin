import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TicketData,
  FinalizationReply,
  TicketComment,
} from "@/interfaces/TicketData";
import { useAuthStore } from "@/store/auth";
import {
  updateTicket,
  useCreateTicket,
  useCreateTicketAudit,
  useCreateTicketComment,
} from "./useTickets";
import { getReasonById, getReplyActions } from "./useReasons";

interface FinalizeTicketParams {
  ticket: TicketData;
  reply: FinalizationReply;
  commentText?: string;
  forceAssign?: boolean;
}

export function useFinalizeTicket() {
  const { user } = useAuthStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticket,
      reply,
      commentText,
      forceAssign,
    }: FinalizeTicketParams) => {
      const now = new Date().toISOString();

      console.log("[FinalizeTicket] Início do fluxo", {
        ticket,
        reply,
        commentText,
        forceAssign,
      });

      // 1️⃣ Comentário se necessário
      if (commentText && commentText.trim() !== "") {
        console.log("[FinalizeTicket] Criando comentário...");
        const commentPayload: TicketComment = {
          ticketId: ticket.id!,
          author: user!.name,
          message: commentText,
          date: now,
        };
        await useCreateTicketComment(commentPayload);
        console.log("[FinalizeTicket] Comentário criado com sucesso");

        await useCreateTicketAudit({
          ticketId: ticket.id!,
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
        console.log("[FinalizeTicket] Audit de comentário criado");
      } else {
        console.log(
          "[FinalizeTicket] Nenhum comentário necessário ou informado"
        );
      }

      // 2️⃣ Executa ReplyActions
      console.log("===========================");
      console.log(
        "[FinalizeTicket] Buscando ReplyActions | ID do reply:",
        reply.id
      );

      const actions = await getReplyActions(reply.id);
      console.log("[FinalizeTicket] ReplyActions encontrados:", actions);
      console.log("===========================");

      for (const action of actions) {
        if (action.type === "new_event") {
          console.log(
            "[FinalizeTicket] Processando action new_event...",
            action
          );
          const reasonData = await getReasonById(action.data.reasonId!);
          console.log("[FinalizeTicket] Reason recuperado:", reasonData);

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
          console.log(
            "[FinalizeTicket] Novo ticket criado pelo action new_event"
          );

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
          console.log(
            "[FinalizeTicket] Audit de criação de novo evento criado"
          );
        }

        if (action.type === "send_email") {
          console.log(
            `[FinalizeTicket] Email simulado enviado para: ${action.data.email} - ${action.data.title}`
          );
          // Caso tenha integração de envio real, disparar aqui
        }
      }

      // 3️⃣ Finaliza ticket com atribuição se necessário
      const willAssign =
        ticket.assignedTo ??
        (forceAssign
          ? {
              id: user!.id,
              name: user!.name,
              group: user!.groupLevel,
            }
          : null);

      console.log("[FinalizeTicket] Finalizando ticket...", {
        status: "FINALIZADO",
        assignedTo: willAssign,
      });

      await updateTicket(ticket.id!, {
        status: "FINALIZADO",
        assignedTo: willAssign,
      });
      console.log(
        "[FinalizeTicket] Ticket atualizado para FINALIZADO com sucesso"
      );

      await useCreateTicketAudit({
        ticketId: ticket.id!,
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
      console.log("[FinalizeTicket] Audit de finalização criada com sucesso");

      // 4️⃣ Invalida queries para atualizar o cache
      await queryClient.invalidateQueries({ queryKey: ["tickets"] });
      await queryClient.invalidateQueries({
        queryKey: ["ticket-id", ticket.id],
      });
      console.log("[FinalizeTicket] Cache invalidado, fluxo finalizado");
    },
  });
}
