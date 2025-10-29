import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListBilletCashout from "./ListBilletCashout";

export default function BilletCashout() {
  return (
    <SidebarLayout current="Transações - Boleto">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListBilletCashout />
        </div>
      </div>
    </SidebarLayout>
  );
}
