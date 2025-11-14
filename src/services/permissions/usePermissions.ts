import { PermissionData } from "@/interfaces/PermissionData";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const usePermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async (): Promise<PermissionData[]> => {
      const { data } = await api.get<{ permissions: PermissionData[] }>("/permissions");
      return data.permissions;
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
};
