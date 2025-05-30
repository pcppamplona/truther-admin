import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { AclwalletData } from "@/interfaces/aclwallets-data";

export const useWallets = () => {
  return useQuery({
    queryKey: ["aclWallets "],
    queryFn: async (): Promise<AclwalletData[]> => {
      const response = await api.get("aclWallets ");
      return await response.json<AclwalletData[]>();
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};


export const getWalletDoc = async (document: string): Promise<AclwalletData[]> => {
  const response = await api.get('aclWallets', {
    searchParams: { document }
  });
  return await response.json();
};

export const useWalletDoc = (doc: string | undefined) => {
  return useQuery({
    queryKey: ['aclWallets-doc', doc],
    queryFn: () => getWalletDoc(doc!),
    enabled: !!doc,
    staleTime: Infinity,
  });
};
