import { AuditLog, methodType } from "@/interfaces/AuditLogData";
import { PaginateData } from "@/interfaces/PaginateData";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useAuditLog = (page: number, limit: number, search?: string, method?: methodType | "") => {
  return useQuery<PaginateData<AuditLog>>({
    queryKey: ["audit-logs", page, limit, search, method],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) params.append("search", search);
      if (method) params.append("method", method);

      const { data } = await api.get<PaginateData<AuditLog>>(
        `/audit-logs?${params.toString()}`
      );
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
