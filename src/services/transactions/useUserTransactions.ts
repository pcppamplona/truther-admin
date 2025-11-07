import { PaginateData } from "@/interfaces/PaginateData";
import { UserTransaction } from "@/interfaces/UserTransaction";
import { UserTransactionsFiltersValues } from "@/views/transactions/components/UserTransactionsFilters";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useUserTransactions = (
  document: string,
  page: number,
  limit: number,
  filters?: UserTransactionsFiltersValues
) => {
  return useQuery<PaginateData<UserTransaction>>({
    queryKey: ["user-transactions", document, page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (filters?.status) params.append("status", filters.status);
      if (filters?.hash) params.append("hash", filters.hash);
      if (filters?.value) params.append("value", String(filters.value));
      if (filters?.created_after)
        params.append("created_after", filters.created_after);
      if (filters?.created_before)
        params.append("created_before", filters.created_before);

      const { data } = await api.get<PaginateData<UserTransaction>>(
        `/transactions/by-document/${document}?${params.toString()}`
      );

      return data;
    },
     refetchOnWindowFocus: false,
  });
};
