import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export interface ServiceItem {
  id: string;
  name: string;
}

export const useGetServices = () => {
  return useQuery({
    queryKey: ["admin-get-services"],
    queryFn: async () => {
      const { data } = await api.get<ServiceItem[]>("/admin/get-services");
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
