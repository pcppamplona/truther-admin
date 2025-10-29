import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import RoutesApp from "./routes/routerApp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeInitializer } from "./lib/utils";
import { Toaster } from "sonner";
import { I18nProvider } from "@/i18n";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <I18nProvider>
          <ThemeInitializer />
          <RoutesApp />
          <Toaster richColors /> 
        </I18nProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
