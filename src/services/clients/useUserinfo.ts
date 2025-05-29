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