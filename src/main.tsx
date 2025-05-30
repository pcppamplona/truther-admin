import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import RoutesApp from "./routes/routerApp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useThemeStore } from "./store/theme";
import { applyThemeToCSSVariables } from "./lib/utils";

const { theme } = useThemeStore.getState();
applyThemeToCSSVariables(theme);

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <RoutesApp />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
