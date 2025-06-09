import { UserInfoData } from "@/interfaces/userinfo-data";
import { api } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";


export const getUserInfoByUserId = async (user_id: number) => {
  const response = await api.get('userinfo', {
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
      const response = await api.get("userinfo");
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
      const response = await api.get("userinfo", {
        searchParams: { document: String(document) },
      });
      return await response.json<UserInfoData[]>();
    },
    enabled: !!document,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};