import { ClientsData } from "@/interfaces/ClientsData";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { PaginateData } from "@/interfaces/PaginateData";

export const useClients = (
  page: number,
  limit: number,
  search?: string,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC"
) => {
  return useQuery<PaginateData<ClientsData>>({
    queryKey: ["clients", page, limit, search, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })

      if (search) params.append("search", search)
      if (sortBy) params.append("sortBy", sortBy)
      if (sortOrder) params.append("sortOrder", sortOrder)

      const { data } = await api.get<PaginateData<ClientsData>>(`/clients/paginated?${params.toString()}`)
      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
  })
}

export const useClientById = (id: string) => {
  return useQuery({
    queryKey: ["client-id", id],
    queryFn: async (): Promise<ClientsData> => {
      const { data } = await api.get<ClientsData>(`clients/by-id/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useClientByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["client-uuid", uuid],
    queryFn: async (): Promise<ClientsData> => {
      const { data } = await api.get<ClientsData>(`clients/by-uuid/${uuid}`);
      return data;
    },
    enabled: !!uuid,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};
