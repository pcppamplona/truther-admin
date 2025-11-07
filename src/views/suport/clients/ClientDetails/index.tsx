import { useLocation } from "react-router-dom";
import { useState } from "react";
import { CircleUserRound, FileUser, Wallet, FileText, ArrowLeftRight } from "lucide-react";
import { useClientById } from "@/services/clients/useClients";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import UserInfo from "./renderViews/UserInfoView";
import { KYCView } from "./renderViews/KYCView";
import { WalletView } from "./renderViews/WalletView";
import { NFEView } from "./renderViews/NFEView";
import { ClientsData } from "@/interfaces/ClientsData";
import { UserInfoData } from "@/interfaces/UserInfoData";
import { useUserInfoByUserId } from "@/services/clients/useUserinfo";
import { UserTransactionsView } from "./renderViews/UserTransactionsView";

export interface ClientInfoProps {
  client: ClientsData;
  userInfo: UserInfoData | undefined;
}

export default function ClientDetails() {
  const { state } = useLocation();
  const clientId = state?.clientId;
  const { data: client, isLoading: loadingClient } = useClientById(clientId);

  const { data: userInfo } = useUserInfoByUserId(clientId)

  const [view, setView] = useState<"Perfil" | "KYC" | "Carteiras" | "Transações" | "NFE">("Perfil");

  if (!clientId) return <div>Cliente não especificado.</div>;
  if (!client && !loadingClient) return <div>Cliente não encontrado.</div>;

  const tabs = [
    { name: "Perfil", icon: <CircleUserRound size={18} /> },
    { name: "KYC", icon: <FileUser size={18} /> },
    { name: "Carteiras", icon: <Wallet size={18} /> },
    { name: "Transações", icon: <ArrowLeftRight size={18} /> },
    { name: "NFE", icon: <FileText size={18} /> },
  ];

  return (
    <SidebarLayout
      breadcrumb={[
        { label: "Suporte", href: "/clients" },
        { label: "Clientes", href: "/clients" },
      ]}
      current={
        <>
          Detalhes de <strong>{client?.name ?? "..."}</strong>
        </>
      }
    >
      <div className="flex flex-col md:flex-row flex-wrap gap-2 w-full max-w-4xl border-b">
        {tabs.map(({ name, icon }) => {
          const isActive = view === name;
          return (
            <button
              key={name}
              onClick={() => setView(name as typeof view)}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-3
                ${
                  isActive
                    ? "text-primary border-primary font-semibold"
                    : "border-transparent font-medium"
                }`}
            >
              {icon}
              {name}
            </button>
          );
        })}
      </div>

      {view === "Perfil" && client && (<UserInfo client={client} userInfo={userInfo} />)}
      {view === "KYC" && client && (<KYCView client={client} userInfo={userInfo} />)}
      {view === "Carteiras" && userInfo && <WalletView userinfo={userInfo} />}
      {view === "Transações" && userInfo?.document && <UserTransactionsView document={userInfo.document} />}
      {view === "NFE" && client && <NFEView client={client} />}
    </SidebarLayout>
  );
}
