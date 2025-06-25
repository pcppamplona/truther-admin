import { FinalizationReply, Reason } from "@/interfaces/ticket-data";
import { api } from "../api";

export async function getTicketCategories() {
  return [
    { id: 1, type: "KYC" },
    { id: 2, type: "PIX IN" },
    { id: 3, type: "PIX OUT" },
    { id: 4, type: "ATM" },
    { id: 5, type: "BOLETO" },
  ];
}

export async function getReasonsByCategory(categoryId: number): Promise<Reason[]> {
  const res = await api.get("ticketReasons", {
    searchParams: { categoryId: categoryId.toString() },
  }).json<Reason[]>();
  return res;
}

export async function getReplayTicketReasons(reasonId: number): Promise<FinalizationReply[]> {
  const res = await api.get("replayTicketReasons", {
    searchParams: { reasonId: reasonId.toString() },
  }).json<FinalizationReply[]>();
  return res;
}