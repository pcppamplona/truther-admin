import { UserInfoData } from "@/interfaces/UserInfoData";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useAllUserinfo = () => {
  return useQuery({
    queryKey: ["userinfo-all"],
    queryFn: async (): Promise<UserInfoData[]> => {
      const { data } = await api.get<UserInfoData[]>("userinfo");
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useUserInfoDocument = (document: string) => {
  return useQuery({
    queryKey: ["userinfo-document", document],
    queryFn: async (): Promise<UserInfoData[]> => {
      const { data } = await api.get<UserInfoData[]>("userinfo", {
        params: { document: String(document) },
      });
      return data;
    },
    enabled: !!document,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};


export const useUserInfoByUserId = (user_id: number) => {
  return useQuery({
    queryKey: ["userinfo", user_id],
    queryFn: async (): Promise<UserInfoData> => {
      const { data } = await api.get<UserInfoData>(`userinfo/by-user/${user_id}`);
      return data;
    },
    enabled: !!user_id,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};
