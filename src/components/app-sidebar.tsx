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
import { useAuthStore } from "@/store/auth";
import {
  Presentation,
  BotMessageSquare,
  House,
  DollarSign,
  User,
  FlagTriangleRight,
  ArrowRightLeft,
} from "lucide-react";
import { useI18n } from "@/i18n";

export function AppSidebar() {
  const user = useAuthStore((state) => state.user);
  const { t } = useI18n();

  const data = {
    user: {
      name: user?.name ?? t("sidebar.anonymousUser"),
      email: user?.username ?? null,
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: t("sidebar.dashboard"),
        url: "dashboard",
        icon: House,
      },
      {
        title: t("sidebar.support.title"),
        url: "clients",
        icon: BotMessageSquare,
        isActive: true,
        items: [
          {
            title: t("sidebar.support.clients"),
            url: "clients",
            matchUrls: ["clients", "clientDetails", "clientEdit"],
          },
          {
            title: t("sidebar.support.occurrences.title"),
            url: "ocurrences",
            matchUrls: ["ocurrences", "ocurrenceDetails"],
            items: [
              {
                title: t("sidebar.support.occurrences.ticketReasons"),
                url: "ticketReasons",
              },
            ],
          },
          {
            title: t("sidebar.support.reports"),
            url: "report",
          },
          { title: t("sidebar.support.sendGas"), url: "sendgas" },
          { title: t("sidebar.support.decode"), url: "decode" },
        ],
      },
      {
        title: t("sidebar.marketing.title"),
        url: "notifications",
        icon: Presentation,
        items: [
          {
            title: t("sidebar.marketing.notifications"),
            url: "notifications",
          },
        ],
      },
      {
        title: t("sidebar.finance.title"),
        url: "refund",
        icon: DollarSign,
        items: [
          {
            title: t("sidebar.finance.refund"),
            url: "refund",
          },
          {
            title: t("sidebar.finance.cashout"),
            url: "cashout",
          },
        ],
      },
      {
        title: t("sidebar.transactions.title"),
        url: "transactions/pix-in",
        icon: ArrowRightLeft,
        items: [
          {
            title: t("transactions.pixIn.short"),
            url: "transactions/pix-in",
          },
          {
            title: t("transactions.pixOut.short"),
            url: "transactions/pix-out",
          },
          { title: "Boleto", url: "transactions/billet-cashout" },
          { title: "BRIDGES", url: "transactions/bridges" },
          { title: "ATM", url: "transactions/atm" }
        ],
      },
      {
        title: t("sidebar.users"),
        url: "users",
        icon: User,
      },
      {
        title: t("sidebar.audit"),
        url: "auditLog",
        icon: FlagTriangleRight,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ml-2"
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

      <SidebarContent className="border-b-border border-b-1 ml-2">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
