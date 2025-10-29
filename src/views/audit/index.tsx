import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListAuditLog from "./ListAuditLog";
import { useI18n } from "@/i18n";

export default function AuditLog() {
  return <AuditPageContent />;
}

function AuditPageContent() {
  const { t } = useI18n();
  return (
    <SidebarLayout current={t("audit.breadcrumb")}> 
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListAuditLog />
        </div>
      </div>
    </SidebarLayout>
  );
}
