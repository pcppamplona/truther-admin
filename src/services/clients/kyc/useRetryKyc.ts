import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";


interface RetryKycInput {
  document: string;
  ouccurenceuuid?: string;
  internalComent: string;
  tryKycType: string;
}

export const useRetryKyc = () => {
  return useMutation({
    mutationFn: async (payload: RetryKycInput) => {
      const { data } = await api.post("/kyc/retry-kyc", payload);
      return data;
    },
  });
};
