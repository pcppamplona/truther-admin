import { DataUser } from "@/interfaces/DataUser";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useDataUser = (document: string) => {
  return useQuery({
    queryKey: ["data-user", document],
    queryFn: async (): Promise<DataUser> => {
      const { data } = await api.post<DataUser>("/kyc/data-user", {
        document: document,
      });
      return data;
    },
    enabled: !!document,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};
