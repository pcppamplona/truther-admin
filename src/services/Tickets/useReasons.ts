import { Reason } from "@/interfaces/TicketData";
import { api } from "../api";
import {
  useQuery,
} from "@tanstack/react-query";

export async function getTicketCategories() {
  return [
    { id: 1, type: "KYC" },
    { id: 2, type: "PIX IN" },
    { id: 3, type: "PIX OUT" },
    { id: 4, type: "ATM" },
    { id: 5, type: "BOLETO" },
  ];
}

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

// export async function getReplyReason(reasonId: number): Promise<FinalizationReply[]> {
//   const res = await api.get("replyReasons", {
//     searchParams: { reasonId: reasonId.toString() },
//   }).json<FinalizationReply[]>();
//   return res;
// }


// export async function getReplyActions(replyId: number): Promise<ReplyAction[]> {
//   const res = await api.get("replyActions", {
//     searchParams: { replyId: replyId.toString() },
//   }).json<ReplyAction[]>();
//   return res;
// }