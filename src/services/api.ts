import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333",
  timeout: 6000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para incluir o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRoute = error.config?.url?.includes("/authenticate");

    if (error.response?.status === 401 && !isLoginRoute) {
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 403) {
      throw {
        code: error.response.data?.code || "PERMISSION_DENIED",
        message: error.response.data?.message || "Acesso negado",
        requiredPermission: error.response.data?.requiredPermission,
      };
    }

    throw error;
  }
);


// interceptor for simulantion latency
// api.interceptors.request.use((config) => {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(config), 5000); // 1 s delay
//   });
// });