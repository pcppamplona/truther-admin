import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";

interface ResetLabelInput {
  document: string;
  labels: string;
}

export const useResetLabel = () => {
  return useMutation({
    mutationFn: async (payload: ResetLabelInput) => {
      const { data } = await api.post("/kyc/reset-label", payload);
      return data;
    },
  });
};
