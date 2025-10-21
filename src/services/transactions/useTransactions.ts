import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { PaginateData } from "@/interfaces/PaginateData";
import { PixInTransaction, PixOutTransaction } from "@/interfaces/Transactions";

export interface PixOutQueryFilters {
  txid?: string;
  end2end?: string;
  pixKey?: string;
  receiverDocument?: string;
  receiverName?: string;
  wallet?: string;
  status_px?: string;
  status_bk?: string;
  min_amount?: string;
  max_amount?: string;
  created_after?: string;
  created_before?: string;
}

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

export interface PixInQueryFilters {
  txid?: string;
  status_bank?: string;
  status_blockchain?: string;
  payer_document?: string;
  payer_name?: string;
  created_after?: string;
  created_before?: string;
  min_amount?: string;
  max_amount?: string;
  wallet?: string;
  end2end?: string;
  destinationKey?: string;
  typeIn?: string;
}

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
