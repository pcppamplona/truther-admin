import { UserInfoData } from "@/interfaces/userinfo-data";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";


export const getUserInfoByUserId = async (user_id: number) => {
  const response = await api.get('user-info', {
    searchParams: { user_id: user_id.toString() },
  });
  return await response.json();
};

export const useUserInfo = (user_id: number | undefined) => {
  return useQuery({
    queryKey: ['userInfo', user_id],
    queryFn: () => getUserInfoByUserId(user_id!),
    enabled: !!user_id,
    select: (data) => data[0],
  });
};

export const useAllUserinfo = () => {
  return useQuery({
    queryKey: ["userinfo-all"],
    queryFn: async (): Promise<UserInfoData[]> => {
      const response = await api.get("user-info");
      return await response.json<UserInfoData[]>();
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useUserInfoDocument = (document: string) => {
  return useQuery({
    queryKey: ["userinfo-document", document],
    queryFn: async (): Promise<UserInfoData[]> => {
      const response = await api.get("user-info/document", {
        searchParams: { document: String(document) },
      });
      return await response.json<UserInfoData[]>();
    },
    enabled: !!document,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};