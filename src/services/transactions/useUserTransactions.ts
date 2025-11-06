import { PaginateData } from "@/interfaces/PaginateData";
import { UserTransaction } from "@/interfaces/UserTransaction";
import { api } from "../api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useUserTransactions = (
  document: string,
  page: number,
  limit: number,
  search?: string,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC"
) => {
  return useQuery<PaginateData<UserTransaction>, any>({
    queryKey: [
      "user-transactions",
      document,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (search) params.append("search", search);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortOrder) params.append("sortOrder", sortOrder);

        const { data } = await api.get<PaginateData<UserTransaction>>(
          `/transactions/by-document/${document}?${params.toString()}`
        );

        return data;
      } catch (err: any) {
        throw err.response?.data || err;
      }
    },
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
