import { AuditLog, methodType } from "@/interfaces/AuditLogData";
import { PaginateData } from "@/interfaces/PaginateData";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useAuditLog = (
  page: number,
  limit: number,
  search?: string,
  descriptionSearch?: string,
  method?: methodType | "",
  action?: string,
  created_before?: string,
  created_after?: string
) => {
  return useQuery<PaginateData<AuditLog>, any>({
    queryKey: [
      "audit-logs",
      page,
      limit,
      search,
      descriptionSearch,
      method,
      action,
      created_before,
      created_after,
    ],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (search) params.append("search", search);
        if (descriptionSearch) params.append("description", descriptionSearch);
        if (method) params.append("method", method);
        if (action) params.append("action", action);
        if (created_before) params.append("created_before", created_before);
        if (created_after) params.append("created_after", created_after);

        const { data } = await api.get<PaginateData<AuditLog>>(
          `/audit-logs?${params.toString()}`
        );

        return data;
      } catch (err: any) {
        // lança o erro para o React Query tratar
        throw err.response?.data || err;
      }
    },
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
