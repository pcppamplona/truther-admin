import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { useI18n } from "@/i18n";
import ListAtm from "./ListAtm";

export default function Atm() {
  const { t } = useI18n();

  return (
    <SidebarLayout
      breadcrumb={[{ label: `${t("transactions.breadcrumb")}` }]}
      current="ATM"
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListAtm />
        </div>
      </div>
    </SidebarLayout>
  );
}
