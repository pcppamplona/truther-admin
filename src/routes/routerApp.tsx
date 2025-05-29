import Dashboard from "@/views/dashboard";
import Login from "@/views/login";
import Notifications from "@/views/marketing/notifications";
import Suport from "@/views/suport";
import Clients from "@/views/suport/clients";
import ClientDetails from "@/views/suport/clients/ClientDetails";
import { Route, Routes } from "react-router";

export default function RoutesApp() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/suport" element={<Suport />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/clientDetails" element={<ClientDetails />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
}
