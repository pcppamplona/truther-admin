import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import RoutesApp from "./routes/routerApp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeInitializer } from "./lib/utils";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <ThemeInitializer />
        <RoutesApp />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
