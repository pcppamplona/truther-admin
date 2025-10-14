import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { ActionsType } from "@/interfaces/TicketData";

export const useActionTypes = () => {
  return useQuery<ActionsType[]>({
    queryKey: ["all-actions-type"],
    queryFn: async () => {
      const { data } = await api.get<ActionsType[]>(`ticket-reasons/actions-type`)
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};
