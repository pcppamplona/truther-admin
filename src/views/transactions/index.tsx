import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { useI18n } from "@/i18n";

export default function Transactions() {
  const { t } = useI18n();
  return (
    <SidebarLayout current={t("transactions.breadcrumb")}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">

        </div>
      </div>
    </SidebarLayout>
  );
}
