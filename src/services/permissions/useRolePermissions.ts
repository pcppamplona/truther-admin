import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import {
  PermissionData,
  RolePermissionPayload,
} from "@/interfaces/PermissionData";

export const useRolePermissions = (roleId: number) => {
  return useQuery({
    queryKey: ["role-permissions", roleId],
    queryFn: async (): Promise<PermissionData[]> => {
      const { data } = await api.get(`/permissions/roles/${roleId}`);
      return data;
    },
    enabled: !!roleId,
    staleTime: Number.POSITIVE_INFINITY,
  });
};

export const useCreateRolePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RolePermissionPayload) => {
      const { data } = await api.post(`/permissions/roles`, payload);
      return data;
    },
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({
        queryKey: ["role-permissions", payload.role_id],
      });
    },
  });
};

export const useDeleteRolePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ role_id, permission_id }: RolePermissionPayload) => {
      const { data } = await api.delete(
        `/permissions/roles/${role_id}/${permission_id}`
      );
      return data;
    },
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({
        queryKey: ["role-permissions", payload.role_id],
      });
    },
  });
};
