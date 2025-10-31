import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListBridges from "./ListBridges";

export default function Bridges() {
  return (
    <SidebarLayout current="Transações - BRIDGES">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListBridges />
        </div>
      </div>
    </SidebarLayout>
  );
}
