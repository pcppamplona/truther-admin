import { FinalizationReply, Reason, ReplyAction } from "@/interfaces/ticket-data";
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
  const res = await api.get("ticket-reasons", {
    searchParams: { categoryId: categoryId.toString() },
  }).json<Reason[]>();
  return res;
}

export async function getReasonById(reasonId: number): Promise<Reason> {
  const res = await api.get("ticket-reasons", {
    searchParams: { reasonId: reasonId.toString() },
  }).json<Reason[]>();

  if (!res || res.length === 0) {
    throw new Error(`Nenhum motivo encontrado para ID ${reasonId}`);
  }

  return res[0];
}


export async function getReplyReason(reasonId: number): Promise<FinalizationReply[]> {
  const res = await api.get("reply-reasons", {
    searchParams: { reasonId: reasonId.toString() },
  }).json<FinalizationReply[]>();
  return res;
}

export async function getReplyActions(replyId: number): Promise<ReplyAction[]> {
  const res = await api.get("reply-actions", {
    searchParams: { reasonId: replyId.toString() },
  }).json<ReplyAction[]>();
  return res;
}


