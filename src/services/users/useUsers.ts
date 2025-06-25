import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { AuthData } from "@/interfaces/auth-data";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<AuthData[]> => {
      const response = await api.get("authentication");
      return await response.json<AuthData[]>();
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};


export const useUserName = (userName: string) => {
  return useQuery({
    queryKey: ["users-username", userName],
    queryFn: async (): Promise<AuthData> => {
      const response = await api.get(`authentication/${userName}`);
      return await response.json<AuthData>();
    },
    enabled: !!userName,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};