import { AuditLog, methodType } from "@/interfaces/AuditLogData";
import { PaginateData } from "@/interfaces/PaginateData";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useAuditLog = (
  page: number, 
  limit: number, 
  search?: string, 
  method?: methodType | "",
  created_before?: string,
  created_after?: string
) => {
  return useQuery<PaginateData<AuditLog>>({
    queryKey: ["audit-logs", page, limit, search, method, created_before, created_after],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) params.append("search", search);
      if (method) params.append("method", method);
      if (created_before) params.append("created_before", created_before);
      if (created_after) params.append("created_after", created_after);

      const { data } = await api.get<PaginateData<AuditLog>>(
        `/audit-logs?${params.toString()}`
      );
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
