import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/store/auth";
import { AudioWaveform, Presentation, BotMessageSquare, Command, GalleryVerticalEnd, House,  } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const data = {
  user: {
    name: user?.name ?? "Usuário",
    email: user?.username ?? null,
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: House,
      isActive: true,
    },
    {
      title: "Suporte",
      url: "suport",
      icon: BotMessageSquare,
      items: [
        {
          title: "Clientes",
          url: "clients",
          isActive: true
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
        }
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
           isActive: true
        },
      ]
    },

  ],
};
  

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
