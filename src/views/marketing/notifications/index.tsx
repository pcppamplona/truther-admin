import { SidebarLayout } from "@/components/layouts/SidebarLayout";
// import { UserCreationForm } from "./components/UserCreationForm";
import ListNotifications from "./components/ListNotifications";
import CalendarNotifications from "./components/CalendarNotifications";

export default function Notifications() {
  return (
    <SidebarLayout
      breadcrumb={[{ label: "Marketing", href: "" }]}
      current="Notificações"
    >
      <div className="flex flex-1 flex-col max-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          <ListNotifications />
          <CalendarNotifications />
        </div>
      </div>
    </SidebarLayout>
  );
}
