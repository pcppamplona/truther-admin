import { create } from "zustand";
import { api } from "@/services/api";

interface User {
  id: number;
  uuid: string;
  name: string;
  username: string;
  active: boolean;
  typeAuth: string;
  groupLevel: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  
  user: null,
  token: localStorage.getItem("authToken"),
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });

    try {
      const { data } = await api.post("/authenticate", { username, password });
      
      localStorage.setItem("authToken", data.token);
      set({ token: data.token });

      await useAuthStore.getState().fetchMe();

      return data; 
    } catch (error: any) {
      const message = error?.response?.data?.message || "Usuário ou senha inválidos";
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ loading: false });
    }
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get("/me");
      set({ user: data });
    } catch {
      set({ error: "Falha ao carregar usuário", user: null, token: null });
      localStorage.removeItem("authToken");
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    set({ user: null, token: null });
  },
}));