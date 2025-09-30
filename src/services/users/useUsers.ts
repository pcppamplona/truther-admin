import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { UserData } from "@/interfaces/UserData";
import { PaginateData } from "@/interfaces/PaginateData";

export const useUsers = (
  page: number,
  limit: number,
  search?: string,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC"
) => {
  return useQuery<PaginateData<UserData>>({
    queryKey: ["users", page, limit, search, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })

      if (search) params.append("search", search)
      if (sortBy) params.append("sortBy", sortBy)
      if (sortOrder) params.append("sortOrder", sortOrder)

      const { data } = await api.get<PaginateData<UserData>>(`/users/paginated?${params.toString()}`)
      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
  })
}

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["all-users"],
    queryFn: async (): Promise<UserData[]> => {
      const { data } = await api.get<UserData[]>(`users`);
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};