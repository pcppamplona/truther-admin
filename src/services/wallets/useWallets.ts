import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { AclwalletData } from "@/interfaces/AclwalletData";

export const useWalletClientDocument = (document: string) => {
  return useQuery({
    queryKey: ["aclWallets", document],
    queryFn: async (): Promise<AclwalletData> => {
      const { data } = await api.get<AclwalletData>(`client/wallet/${document}`);
      return data;
    },
    enabled: !!document,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};
