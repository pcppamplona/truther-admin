import { FinalizationReply, Reason, ReplyAction } from "@/interfaces/TicketData";
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

export async function getReasonById(reasonId: number): Promise<Reason> {
  const res = await api.get("ticketReasons", {
    searchParams: { reasonId: reasonId.toString() },
  }).json<Reason[]>();

  if (!res || res.length === 0) {
    throw new Error(`Nenhum motivo encontrado para ID ${reasonId}`);
  }

  return res[0];
}


export async function getReplyReason(reasonId: number): Promise<FinalizationReply[]> {
  const res = await api.get("replyReasons", {
    searchParams: { reasonId: reasonId.toString() },
  }).json<FinalizationReply[]>();
  return res;
}


export async function getReplyActions(replyId: number): Promise<ReplyAction[]> {
  const res = await api.get("replyActions", {
    searchParams: { replyId: replyId.toString() },
  }).json<ReplyAction[]>();
  return res;
}