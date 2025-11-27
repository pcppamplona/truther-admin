import { api } from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";


// GET: /admin/block-levels
export interface BlockLevelData {
  tag: string;
  serviceIdList: number[];
}

export const useGetBlockLevels = () => {
  return useQuery({
    queryKey: ["admin-block-levels"],
    queryFn: async () => {
      const { data } = await api.get<BlockLevelData[]>("/admin/block-levels");
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};


// PUT: /admin/service-block-levels/users/:user_id/tag/:tag
export interface SetBlockLevelInput {
  user_id: string;
  tag: string;
  payload: Record<string, any>;
}

export const useSetUserBlockLevel = () => {
  return useMutation({
    mutationFn: async ({ user_id, tag, payload }: SetBlockLevelInput) => {
      const { data } = await api.put(
        `/admin/service-block-levels/users/${user_id}/tag/${tag}`,
        payload || {},
      );
      return data;
    },
  });
};


// DELETE: /admin/service-block-levels/users/:user_id
export interface DeleteBlockLevelInput {
  user_id: string;
}
export const useDeleteUserBlockLevel = () => {
  return useMutation({
    mutationFn: async ({ user_id }: DeleteBlockLevelInput) => {
      const { data } = await api.delete(
        `/admin/service-block-levels/users/${user_id}`,
      );
      return data;
    },
  });
};
