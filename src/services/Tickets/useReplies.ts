import { ReplyAction, ReplyReason } from "@/interfaces/TicketData";
import { api } from "../api";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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
}


type CreateReplyPayload = {
  reason_id: number;
  reply: string;
  comment: boolean;
  actions?: ReplyAction[];
};

export function useCreateReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReplyPayload): Promise<ReplyReason> => {
      const { reason_id, ...body } = payload;
      const { data } = await api.post(`/ticket-reasons/${reason_id}/replies`, body);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket-reason-replies", variables.reason_id] });
      queryClient.invalidateQueries({ queryKey: ["all-ticket-replys"] });
    
    },
  });
}