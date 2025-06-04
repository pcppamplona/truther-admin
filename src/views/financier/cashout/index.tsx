import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListCashout from "./ListCashout";

export default function Cashout() {
  return (
    <SidebarLayout
      breadcrumb={[{ label: "Financeiro", href: "" }]}
      current="Saques"
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListCashout />
        </div>
      </div>
    </SidebarLayout>
  );
}
