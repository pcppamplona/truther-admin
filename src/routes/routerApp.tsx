import Dashboard from "@/views/dashboard";
import Financier from "@/views/financier";
import Cashout from "@/views/financier/cashout";
import Refund from "@/views/financier/refund";
import Login from "@/views/login";
import Marketing from "@/views/marketing";
import Notifications from "@/views/marketing/notifications";
import Suport from "@/views/suport";
import Clients from "@/views/suport/clients";
import ClientDetails from "@/views/suport/clients/ClientDetails";
import Decode from "@/views/suport/decode";
import SendGas from "@/views/suport/sendGas";
import Users from "@/views/users";
import { Route, Routes } from "react-router";

export default function RoutesApp() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      <Route path="/suport" element={<Suport />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/clientDetails" element={<ClientDetails />} />
      <Route path="/sendgas" element={<SendGas />} />
      <Route path="/decode" element={<Decode />} />/

      <Route path="/marketing" element={<Marketing />} />
      <Route path="/notifications" element={<Notifications />} />

      <Route path="/financier" element={<Financier />} />
      <Route path="/refund" element={<Refund />} />
      <Route path="/cashout" element={<Cashout />} />

      <Route path="/users" element={<Users />} />

    </Routes>
  );
}
