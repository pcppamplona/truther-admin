import { useMutation } from "@tanstack/react-query";
import { api } from "../api";

export interface SendGasPayload {
  ticket: string;
  address: string;
  network: "polygon" | "liquid" | "bitcoin";
}

export const useSendGas = () => {
  return useMutation({
    mutationFn: async (payload: SendGasPayload) => {
      const { data } = await api.post("support/send-gas", payload);
      return data;
    },
  });
};

export interface DecodePayload {
  data: string;
}

export const useDecode = () => {
  return useMutation({
    mutationFn: async (payload: DecodePayload) => {
      const { data } = await api.post("support/decode", payload);
      return data;
    },
  });
};
