import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/store/auth";
import { Presentation, BotMessageSquare, House } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const data = {
    user: {
      name: user?.name ?? "Usuário",
      email: user?.username ?? null,
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "dashboard",
        icon: House,
      },
      {
        title: "Suporte",
        url: "suport",
        icon: BotMessageSquare,
        items: [
          {
            title: "Clientes",
            url: "clients",
            matchUrls: ["clients", "clientDetails", "clientEdit"],
          },
          {
            title: "Envio de GAS",
            url: "sendgas",
          },
          {
            title: "Decodificar",
            url: "decode",
          },
          {
            title: "Reportes",
            url: "report",
          },
        ],
      },
      {
        title: "Marketing",
        url: "marketing",
        icon: Presentation,
        items: [
          {
            title: "Notificações",
            url: "notifications",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg">
                <img
                  src="/icon.png"
                  alt="Logo Truther"
                  className="w-full h-[80px] object-contain"
                />
              </div>
              <div className="grid flex-1 text-left text-lg leading-tight">
                <span className="truncate font-semibold">Truther</span>
                <span className="truncate text-xs">Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="border-b-gray-200 border-b-1">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
