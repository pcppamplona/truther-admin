import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListOcurrences from "./ListOcurrences";

export default function Ocurrences() {
  return (
    <SidebarLayout
      breadcrumb={[{ label: "Suporte", href: "ocurrences" }]}
      current="Ocorrências"
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListOcurrences />
        </div>
      </div>
    </SidebarLayout>
  );
}
