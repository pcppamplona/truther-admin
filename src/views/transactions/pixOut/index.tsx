import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListPixOut from "./ListPixOut";
import { useI18n } from "@/i18n";

export default function PixOutPage() {
  const { t } = useI18n();
  return (
    <SidebarLayout  breadcrumb={[{ label: `${t("transactions.breadcrumb")}` }]} current={`${t("transactions.pixOut.short")}`}>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListPixOut />
        </div>
      </div>
    </SidebarLayout>
  );
}
