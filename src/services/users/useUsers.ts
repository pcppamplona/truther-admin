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
