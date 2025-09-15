import { AuditLog } from "@/interfaces/AuditLogData";
import { PaginateData } from "@/interfaces/PaginateData";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useAuditLog = (page: number, limit: number, search?: string) => {
  return useQuery<PaginateData<AuditLog>>({
    queryKey: ["audit-logs", page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) params.append("search", search);

      const { data } = await api.get<PaginateData<AuditLog>>(
        `/audit-logs/paginated?${params.toString()}`
      );
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
