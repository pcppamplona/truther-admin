import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListAuditLog from "./ListAuditLog";

export default function AuditLog() {
  return (
    <SidebarLayout
      current="Auditoria"
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListAuditLog />
        </div>
      </div>
    </SidebarLayout>
  );
}
