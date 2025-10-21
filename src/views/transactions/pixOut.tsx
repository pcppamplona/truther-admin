import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListPixOut from "./ListPixOut";

export default function PixOutPage() {
  return (
    <SidebarLayout current="Transações - PIX OUT">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListPixOut />
        </div>
      </div>
    </SidebarLayout>
  );
}
