import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";


interface DisinterestInput {
  document: string;
  internalComent: string;
  externalComent?: string;
  reason: string;
}

export const useDisinterest = () => {
  return useMutation({
    mutationFn: async (payload: DisinterestInput) => {
      const { data } = await api.post("/kyc/disinterest", payload);
      return data;
    },
  });
};
