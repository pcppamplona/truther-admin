import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { ReasonCategory } from "@/interfaces/TicketData";

export const useAllReasonCategories = () => {
  return useQuery<ReasonCategory[]>({
    queryKey: ["reason-categories"],
    queryFn: async () => {
      const { data } = await api.get<ReasonCategory[]>(
        "ticket-reasons/categories"
      );
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useReasonCategoryById = (id: number) => {
  return useQuery<ReasonCategory>({
    queryKey: ["reason-category", id],
    queryFn: async () => {
      const { data } = await api.get<ReasonCategory>(
        `ticket-reasons/categories/${id}`
      );
      return data;
    },
    enabled: !!id,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useCreateReasonCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ReasonCategory>) => {
      const { data } = await api.post("ticket-reasons/categories", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reason-categories"] });
    },
  });
};

export const useUpdateReasonCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<Omit<ReasonCategory, "id">>;
    }) => {
      const { data } = await api.patch<ReasonCategory>(
        `ticket-reasons/categories/${id}`,
        payload
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reason-categories"] });
      queryClient.invalidateQueries({
        queryKey: ["reason-category", variables.id],
      });
    },
  });
};

export const useDeleteReasonCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`ticket-reasons/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reason-categories"] });
    },
  });
};
