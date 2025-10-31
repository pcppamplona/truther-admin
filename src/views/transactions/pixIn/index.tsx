import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListPixIn from "./ListPixIn";
import { useI18n } from "@/i18n";

export default function PixInPage() {
  const { t } = useI18n();
  return (
    <SidebarLayout current={`${t("transactions.breadcrumb")} - ${t("transactions.pixIn.short")}`}>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListPixIn />
        </div>
      </div>
    </SidebarLayout>
  );
}
