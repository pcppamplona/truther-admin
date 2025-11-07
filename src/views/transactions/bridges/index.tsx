import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListBridges from "./ListBridges";
import { useI18n } from "@/i18n";

export default function Bridges() {
  const { t } = useI18n();

  return (
    <SidebarLayout
      breadcrumb={[{ label: `${t("transactions.breadcrumb")}` }]}
      current="BRIDGES"
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListBridges />
        </div>
      </div>
    </SidebarLayout>
  );
}
