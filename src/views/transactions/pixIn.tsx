import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import ListPixIn from "./ListPixIn";

export default function PixInPage() {
  return (
    <SidebarLayout current="Transações - PIX IN">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <ListPixIn />
        </div>
      </div>
    </SidebarLayout>
  );
}
