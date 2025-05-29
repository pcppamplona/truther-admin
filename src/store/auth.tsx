import { AuthData } from "@/interfaces/auth-data";
import { api } from "@/lib/utils";
import { useState } from "react";
import { create } from "zustand";

const getStoredUser = (): AuthData | null => {
  const storedUser = localStorage.getItem("authUser");
  return storedUser ? JSON.parse(storedUser) : null;
};

const useAuthStore = create<{
  user: AuthData | null;
  login: (userData: AuthData) => void;
  logout: () => void;
}>((set) => ({
  user: getStoredUser(),
  login: (userData) => {
    localStorage.setItem("authUser", JSON.stringify(userData));
    set({ user: userData });
  },
  logout: () => {
    localStorage.removeItem("authUser");
    set({ user: null });
  },
}));

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, login, logout } = useAuthStore();

  const authenticate = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Puxa todos os dados da rota /authentication
      const response = await api.get("authentication");
      const data: AuthData[] = await response.json();

      // Busca um usuário com username e password que batem exatamente
      const foundUser = data.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        login(foundUser);
      } else {
        setError("Usuário ou senha inválidos");
      }
    } catch (err) {
      setError("Erro ao autenticar usuário");
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, authenticate, logout };
}
