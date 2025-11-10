import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { PaginateData } from "@/interfaces/PaginateData";
import { AtmQueryFilters, AtmTransaction, BilletCashoutQueryFilters, BilletCashoutTransaction, BridgeQueryFilters, BridgeTransaction, PixInQueryFilters, PixInTransaction, PixOutQueryFilters, PixOutTransaction } from "@/interfaces/Transactions";

export const usePixOutTransactions = (
  page: number,
  limit: number,
  filters: PixOutQueryFilters = {}
) => {
  return useQuery<PaginateData<PixOutTransaction>>({
    queryKey: [
      "transactions",
      "pix-out",
      page,
      limit,
      filters.txid || "",
      filters.end2end || "",
      filters.pixKey || "",
      filters.receiverDocument || "",
      filters.receiverName || "",
      filters.wallet || "",
      filters.status_px || "",
      filters.status_bk || "",
      filters.min_amount || "",
      filters.max_amount || "",
      filters.created_after || "",
      filters.created_before || "",
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (filters.txid) params.append("txid", filters.txid);
      if (filters.end2end) params.append("end2end", filters.end2end);
      if (filters.pixKey) params.append("pixKey", filters.pixKey);
      if (filters.receiverDocument) params.append("receiverDocument", filters.receiverDocument);
      if (filters.receiverName) params.append("receiverName", filters.receiverName);
      if (filters.wallet) params.append("wallet", filters.wallet);
      if (filters.status_px) params.append("status_px", filters.status_px);
      if (filters.status_bk) params.append("status_bk", filters.status_bk);
      if (filters.min_amount) params.append("min_amount", filters.min_amount);
      if (filters.max_amount) params.append("max_amount", filters.max_amount);
      if (filters.created_after) params.append("created_after", filters.created_after);
      if (filters.created_before) params.append("created_before", filters.created_before);

      const { data } = await api.get<PaginateData<PixOutTransaction>>(
        `/transactions/pix-out?${params.toString()}`
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });
};


export const usePixInTransactions = (
  page: number,
  limit: number,
  filters: PixInQueryFilters = {}
) => {
  return useQuery<PaginateData<PixInTransaction>>({
    queryKey: [
      "transactions",
      "pix-in",
      page,
      limit,
      filters.txid || "",
      filters.status_bank || "",
      filters.status_blockchain || "",
      filters.payer_document || "",
      filters.payer_name || "",
      filters.created_after || "",
      filters.created_before || "",
      filters.min_amount || "",
      filters.max_amount || "",
      filters.wallet || "",
      filters.end2end || "",
      filters.destinationKey || "",
      filters.typeIn || "",
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (filters.txid) params.append("txid", filters.txid);
      if (filters.status_bank) params.append("status_bank", filters.status_bank);
      if (filters.status_blockchain) params.append("status_blockchain", filters.status_blockchain);
      if (filters.payer_document) params.append("payer_document", filters.payer_document);
      if (filters.payer_name) params.append("payer_name", filters.payer_name);
      if (filters.created_after) params.append("created_after", filters.created_after);
      if (filters.created_before) params.append("created_before", filters.created_before);
      if (filters.min_amount) params.append("min_amount", filters.min_amount);
      if (filters.max_amount) params.append("max_amount", filters.max_amount);
      if (filters.wallet) params.append("wallet", filters.wallet);
      if (filters.end2end) params.append("end2end", filters.end2end);
      if (filters.destinationKey) params.append("destinationKey", filters.destinationKey);
      if (filters.typeIn) params.append("typeIn", filters.typeIn);

      const { data } = await api.get<PaginateData<PixInTransaction>>(
        `/transactions/pix-in?${params.toString()}`
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });
};


export const useBilletCashoutTransactions = (
  page: number,
  limit: number,
  filters: BilletCashoutQueryFilters = {}
) => {
  return useQuery<PaginateData<BilletCashoutTransaction>>({
    queryKey: [
      "transactions",
      "billet-cashout",
      page,
      limit,
      filters.status || "",
      filters.receiverName || "",
      filters.receiverDocument || "",
      filters.min_amount ?? "",
      filters.max_amount ?? "",
      filters.banksId ?? "",
      filters.orderId ?? "",
      filters.created_after || "",
      filters.created_before || "",
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (filters.status) params.append("status", filters.status);
      if (filters.receiverName) params.append("receiverName", filters.receiverName);
      if (filters.receiverDocument) params.append("receiverDocument", filters.receiverDocument);
      if (filters.min_amount !== undefined) params.append("min_amount", String(filters.min_amount));
      if (filters.max_amount !== undefined) params.append("max_amount", String(filters.max_amount));
      if (filters.banksId !== undefined) params.append("banksId", String(filters.banksId));
      if (filters.orderId !== undefined) params.append("orderId", String(filters.orderId));
      if (filters.created_after) params.append("created_after", filters.created_after);
      if (filters.created_before) params.append("created_before", filters.created_before);

      const { data } = await api.get<PaginateData<BilletCashoutTransaction>>(
        `/transactions/billet-cashout?${params.toString()}`
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });
};


export const useBridgeTransactions = (
  page: number,
  limit: number,
  filters: BridgeQueryFilters = {}
) => {
  return useQuery<PaginateData<BridgeTransaction>>({
    queryKey: [
      "transactions",
      "bridges",
      page,
      limit,
      filters.user_id ?? "",
      filters.wallet_id ?? "",
      filters.status ?? "",
      filters.created_after ?? "",
      filters.created_before ?? "",
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (filters.user_id) params.append("user_id", String(filters.user_id));
      if (filters.wallet_id) params.append("wallet_id", String(filters.wallet_id));
      if (filters.status) params.append("status", filters.status);
      if (filters.created_after) params.append("created_after", filters.created_after);
      if (filters.created_before) params.append("created_before", filters.created_before);

      const { data } = await api.get<PaginateData<BridgeTransaction>>(
        `/transactions/bridges?${params.toString()}`
      );

      return data;
    },
    refetchOnWindowFocus: false,
  });
};


export const useAtmTransactions = (
  page: number,
  limit: number,
  filters: AtmQueryFilters = {}
) => {
  return useQuery<PaginateData<AtmTransaction>>({
    queryKey: [
      "transactions",
      "atm",
      page,
      limit,
      filters.txid ?? "",
      filters.sender ?? "",
      filters.receiverName ?? "",
      filters.receiverDocument ?? "",
      filters.status_bk ?? "",
      filters.status_px ?? "",
      filters.min_amount ?? "",
      filters.max_amount ?? "",
      filters.created_after ?? "",
      filters.created_before ?? "",
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (filters.txid) params.append("txid", filters.txid);
      if (filters.sender) params.append("sender", filters.sender);
      if (filters.receiverName) params.append("receiverName", filters.receiverName);
      if (filters.receiverDocument)
        params.append("receiverDocument", filters.receiverDocument);
      if (filters.status_bk) params.append("status_bk", filters.status_bk);
      if (filters.status_px) params.append("status_px", filters.status_px);
      if (filters.min_amount !== undefined)
        params.append("min_amount", String(filters.min_amount));
      if (filters.max_amount !== undefined)
        params.append("max_amount", String(filters.max_amount));
      if (filters.created_after)
        params.append("created_after", filters.created_after);
      if (filters.created_before)
        params.append("created_before", filters.created_before);

      const { data } = await api.get<PaginateData<AtmTransaction>>(
        `/transactions/atm?${params.toString()}`
      );

      return data;
    },
    refetchOnWindowFocus: false,
  });
};
