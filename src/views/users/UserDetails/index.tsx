import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { UserData } from "@/interfaces/UserData";
import { useLocation } from "react-router";
import { Activity, CircleUserRound, ShieldCloseIcon } from "lucide-react";
import { useState } from "react";
import { UserProfile } from "./renderViews/UserProfile";
import { UserPermissions } from "./renderViews/UserPermissions";
import { UserAudit } from "./renderViews/UserAudit";

export default function UserDetails() {
  const { state } = useLocation();
  const user = state?.user as UserData | undefined;

  if (!user) {
    return <p>Usuário não encontrado.</p>;
  }

  const [view, setView] = useState<"Perfil" | "Permissões" | "Auditoria">(
    "Perfil"
  );

  const tabs = [
    { name: "Perfil", icon: <CircleUserRound size={18} /> },
    { name: "Permissões", icon: <ShieldCloseIcon size={18} /> },
    { name: "Auditoria", icon: <Activity size={18} /> },
  ];
  return (
    <SidebarLayout
      breadcrumb={[{ label: "Usuários", href: "/users" }]}
      current={
        <>
          Detalhes de <strong>{user?.name ?? "..."}</strong>
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

      {view === "Perfil" && <UserProfile user={user} />}
      {view === "Permissões" && <UserPermissions user={user} />}
      {view === "Auditoria" && <UserAudit user={user} />}
   
    </SidebarLayout>
  );
}
