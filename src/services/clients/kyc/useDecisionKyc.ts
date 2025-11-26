import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";

interface DecisionKycInput {
  document: string;
  decision: boolean;
  internalComent: string | null;
  levelKyc: string;
}

export const useDecisionKyc = () => {
  return useMutation({
    mutationFn: async (payload: DecisionKycInput) => {
      const { data } = await api.post("/kyc/decision-kyc", payload);
      return data;
    },
  });
};
