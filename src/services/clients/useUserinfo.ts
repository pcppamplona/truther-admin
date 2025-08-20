import { UserInfoData } from "@/interfaces/UserInfoData";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const getUserInfoByUserId = async (user_id: number) => {
  const { data } = await api.get<UserInfoData[]>("userinfo", {
    params: { user_id: user_id.toString() },
  });
  return data;
};

export const useUserInfo = (user_id: number | undefined) => {
  return useQuery({
    queryKey: ["userInfo", user_id],
    queryFn: () => getUserInfoByUserId(user_id!),
    enabled: !!user_id,
    select: (data) => data[0],
  });
};

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
