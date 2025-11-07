import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListBilletCashout from "./ListBilletCashout";
import { useI18n } from "@/i18n";

export default function BilletCashout() {
  const { t } = useI18n();

  return (
    <SidebarLayout
      breadcrumb={[{ label: `${t("transactions.breadcrumb")}` }]}
      current="Boleto"
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListBilletCashout />
        </div>
      </div>
    </SidebarLayout>
  );
}
