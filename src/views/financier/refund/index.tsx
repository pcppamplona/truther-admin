import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListTransactions from "./ListTransactions";

export default function Refund() {
  return (
    <SidebarLayout
      breadcrumb={[{ label: "Financeiro", href: "" }]}
      current="Reembolso"
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListTransactions />
        </div>
      </div>
    </SidebarLayout>
  );
}
