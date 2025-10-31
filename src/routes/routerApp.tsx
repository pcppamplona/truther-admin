import { Route, Routes } from "react-router";

import AuditLog from "@/views/audit";
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

import Ocurrences from "@/views/suport/occurrences";
import OcurrenceDetails from "@/views/suport/occurrences/OcurrenceDetails";
import TicketReasonsFlow from "@/views/suport/occurrences/TicketReasonsFlow";

import Users from "@/views/users";
import Transactions from "@/views/transactions";
import PixInPage from "@/views/transactions/pixIn";
import SendGas from "@/views/transactions/sendGas";
import Decode from "@/views/transactions/decode";
import PixOutPage from "@/views/transactions/pixOut";
import BilletCashout from "@/views/transactions/billetCashout";
import Bridges from "@/views/transactions/bridges";

export default function RoutesApp() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      <Route path="/suport" element={<Suport />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/clientDetails" element={<ClientDetails />} />
      <Route path="/ocurrences" element={<Ocurrences />} />
      <Route path="/ocurrenceDetails" element={<OcurrenceDetails />} />
      <Route path="/ticketReasons" element={<TicketReasonsFlow />} />


      <Route path="/marketing" element={<Marketing />} />
      <Route path="/notifications" element={<Notifications />} />

      <Route path="/financier" element={<Financier />} />
      <Route path="/refund" element={<Refund />} />
      <Route path="/cashout" element={<Cashout />} />

      <Route path="/users" element={<Users />} />

      <Route path="/transactions" element={<Transactions />} />
      <Route path="/transactions/pix-in" element={<PixInPage />} />
      <Route path="/transactions/pix-out" element={<PixOutPage />} />
      <Route path="/transactions/billet-cashout" element={<BilletCashout />} />
      <Route path="/transactions/bridges" element={<Bridges />} />
      <Route path="/transactions/sendgas" element={<SendGas />} />
      <Route path="/transactions/decode" element={<Decode />} />

      <Route path="/auditLog" element={<AuditLog />} />
    </Routes>
  );
}
