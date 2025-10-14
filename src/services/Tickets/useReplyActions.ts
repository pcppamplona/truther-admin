import { ReplyAction } from "@/interfaces/TicketData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

export const useAllReplyActions = () => {
   return useQuery<ReplyAction[]>({
    queryKey: ["all-reply-actions"],
    queryFn: async () => {
      const { data } = await api.get<ReplyAction[]>(`ticket-reasons/replies/actions`);
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
}

export const useCreateReplyAction = (reply_id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReplyAction) => {
      const { data } = await api.post(
        `ticket-reasons/${reply_id}/replies/actions`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-reply-action-create"] });
    },
  });
};
