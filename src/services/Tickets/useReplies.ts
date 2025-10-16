import { ReplyReason } from "@/interfaces/TicketData";
import { api } from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAllReplies = () => {
  return useQuery<ReplyReason[]>({
    queryKey: ["all-ticket-replys"],
    queryFn: async () => {
      const { data } = await api.get<ReplyReason[]>(`ticket-reasons/replies`);
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export function useCreateReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReplyReason): Promise<ReplyReason> => {
      if (!payload.reason_id) {
        throw new Error("reason_id é obrigatório para criar um reply.");
      }

      const { reason_id, reply, comment } = payload;

      const { data } = await api.post<ReplyReason>(
        `ticket-reasons/${reason_id}/replies`,
        { reply, comment }
      );

      return data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ticket-reason-replies", variables.reason_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-ticket-replies"],
      });
      queryClient.invalidateQueries({ queryKey: ["all-reply-actions"] });
    },
  });
}
