import { FinalizationReply, Reason, ReplyAction, TicketReasonResponse } from "@/interfaces/TicketData";
import { api } from "../api";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useTicketReasonsByCategory = (category_id: number) => {
  return useQuery<Reason[]>({
    queryKey: ["tickets-reasons-by-category", category_id],
    queryFn: async () => {
      const { data } = await api.get<Reason[]>(`tickets/reasons/category/${category_id}`);
      return data;
    },
    enabled: !!category_id,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useTicketReasonsById = (id: number) => {
  return useQuery<Reason>({
    queryKey: ["tickets-reasons-by-id", id],
    queryFn: async () => {
      const { data } = await api.get<Reason>(`tickets/reasons/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useTicketReasonsReply = (reason_id: number) => {
  return useQuery<FinalizationReply>({
    queryKey: ["tickets-reasons-reply-reason_id", reason_id],
    queryFn: async () => {
      const { data } = await api.get<FinalizationReply>(`tickets/reasons/reply/${reason_id}`);
      return data;
    },
    enabled: !!reason_id,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useAllTicketReasons = () => {
   return useQuery<Reason[]>({
    queryKey: ["all-ticket-reasons"],
    queryFn: async () => {
      const { data } = await api.get<Reason[]>(`ticket-reasons`);
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
}

export const useTicketReasonsByIdFlow = (id: number) => {
  return useQuery<TicketReasonResponse>({
    queryKey: ["tickets-reasons-by-id-flow", id],
    queryFn: async () => {
      const { data } = await api.get<TicketReasonResponse>(`/ticket-reasons/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};



type ReplyPayload = {
  reply: string;
  comment: boolean;
  actions: ReplyAction[];
};
interface CreateTicketReasonPayload extends Omit<Reason, "id"> {
  replies: ReplyPayload[];
}

export const useTicketReason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTicketReasonPayload) => {
      const { data } = await api.post("/ticket-reasons", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-reasons"] });
      queryClient.invalidateQueries({ queryKey: ["all-ticket-reasons"] });
      queryClient.invalidateQueries({ queryKey: ["all-reply-actions"] });
      queryClient.invalidateQueries({ queryKey: ["all-ticket-replys"] });
    },
  });
};