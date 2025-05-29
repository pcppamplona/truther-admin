import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListClients from "./ListClients";

export default function Clients() {
  return (
    <SidebarLayout
      breadcrumb={[{ label: "Suporte", href: "#" }]}
      current="Clientes"
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListClients />
        </div>
      </div>
    </SidebarLayout>
  );
}
