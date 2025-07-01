import { ClientsData } from "@/interfaces/clients-data";;
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async (): Promise<ClientsData[]> => {
      const response = await api.get("clients");
      return await response.json<ClientsData[]>();
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useClientByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["client", uuid],
    queryFn: async (): Promise<ClientsData> => {
      const response = await api.get(`clients/${uuid}`);
      return await response.json<ClientsData>();
    },
    enabled: !!uuid,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};