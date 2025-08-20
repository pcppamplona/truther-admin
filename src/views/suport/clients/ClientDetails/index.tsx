import { useLocation } from "react-router-dom";
import { useState } from "react";

import { CircleUserRound, FileUser, Wallet, FileText } from "lucide-react";
import { useClients } from "@/services/clients/useClients";
import { useUserInfo } from "@/services/clients/useUserinfo";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import UserInfo from "./renderViews/UserInfoView";
import { KYCView } from "./renderViews/KYCView";
import { WalletView } from "./renderViews/WalletView";
import { NFEView } from "./renderViews/NFEView";
import { ClientsData } from "@/interfaces/ClientsData";
import { UserInfoData } from "@/interfaces/UserInfoData";

export interface ClientInfoProps {
  client: ClientsData;
  userInfo: UserInfoData | undefined;
}

export default function ClientDetails() {
  const { state } = useLocation();
  const clientId = state?.clientId;

  const { data: clients } = useClients();
  const client = clients?.find((c) => c.id === clientId);

  const { data: userInfo } = useUserInfo(clientId);

  const [view, setView] = useState<"Perfil" | "KYC" | "Carteiras" | "NFE">(
    "Perfil"
  );

  if (!clientId) return <div>Cliente não especificado.</div>;
  if (!client) return <div>Cliente não encontrado.</div>;

  return (
    <SidebarLayout
      breadcrumb={[
        { label: "Suporte", href: "/clients" },
        { label: "Clientes", href: "/clients" },
      ]}
      current={
        <>
          Detalhes de <strong>{client.name}</strong>
        </>
      }
    >
      <div className="flex flex-col md:flex-row flex-wrap gap-2 w-full max-w-4xl border-b">
        {["Perfil", "KYC", "Carteiras", "NFE"].map((tab) => {
          const icon = {
            Perfil: <CircleUserRound size={18} />,
            KYC: <FileUser size={18} />,
            Carteiras: <Wallet size={18} />,
            NFE: <FileText size={18} />,
          }[tab];

          const isActive = view === tab;

          return (
            <button
              key={tab}
              onClick={() => setView(tab as typeof view)}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-3
                ${
                  isActive
                    ? "text-primary border-primary font-semibold"
                    : "border-transparent font-medium"
                }`}
            >
              {icon}
              {tab}
            </button>
          );
        })}
      </div>

      {view === "Perfil" && <UserInfo client={client} userInfo={userInfo} />}
      {view === "KYC" && <KYCView client={client} userInfo={userInfo} />}
      {view === "Carteiras" && <WalletView userinfo={userInfo} />}
      {view === "NFE" && <NFEView client={client} />}
    </SidebarLayout>
  );
}
