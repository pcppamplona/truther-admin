import { ClientsData } from "@/interfaces/ClientsData";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async (): Promise<ClientsData[]> => {
      const { data } = await api.get<ClientsData[]>("clients");
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useClientByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["client", uuid],
    queryFn: async (): Promise<ClientsData> => {
      const { data } = await api.get<ClientsData>(`clients/${uuid}`);
      return data;
    },
    enabled: !!uuid,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};
