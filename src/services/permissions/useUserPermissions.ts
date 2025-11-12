import {
  PermissionData,
  UserPermissionPayload,
} from "@/interfaces/PermissionData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

export const useUserPermissions = (user_id: number) => {
  return useQuery({
    queryKey: ["user-permissions", user_id],
    queryFn: async (): Promise<PermissionData[]> => {
      const { data } = await api.get(`/permissions/users/${user_id}`);
      return data;
    },
    enabled: !!user_id,
    staleTime: Number.POSITIVE_INFINITY,
  });
};

export const useCreateUserPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UserPermissionPayload) => {
      const { data } = await api.post(`/permissions/users`, payload);
      return data;
    },
    onSuccess: async(_data, payload) => {
     await queryClient.invalidateQueries({
        queryKey: ["user-permissions", payload.user_id],
        exact: true,
        refetchType: "active",
      });
    },
  });
};

export const useDeleteUserPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user_id, permission_id }: UserPermissionPayload) => {
      const { data } = await api.delete(
        `/permissions/users/${user_id}/${permission_id}`
      );
      return data;
    },
     onSuccess: async (_data, payload) => {
      // Mesmo comportamento — garante sincronização imediata
      await queryClient.invalidateQueries({
        queryKey: ["user-permissions", payload.user_id],
        exact: true,
        refetchType: "active",
      });
    },
  });
};
