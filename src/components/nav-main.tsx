import { useState } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type SubItem = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  url: string;
  icon?: React.ComponentType<any> | LucideIcon;
  items?: SubItem[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = Array.isArray(item.items) && item.items.length > 0;

          const isItemActive = activeUrl === item.url;
          const isSubItemActive = hasSubItems && item.items!.some((sub) => activeUrl === sub.url);
          const shouldStayOpen = isItemActive || isSubItemActive;

          if (hasSubItems) {
            return (
              <Collapsible
                key={item.title}
                asChild
                open={shouldStayOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => setActiveUrl(item.url)}
                      className={isItemActive ? "bg-gray-300" : undefined}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items!.map((subItem) => {
                        const isSubActive = activeUrl === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={isSubActive ? "bg-gray-300" : undefined}
                            >
                              <a
                                href={subItem.url}
                                onClick={() => setActiveUrl(subItem.url)}
                                className="w-full block"
                              >
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          const isActive = activeUrl === item.url;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={isActive ? "bg-gray-300" : undefined}
              >
                <a
                  href={item.url}
                  onClick={() => setActiveUrl(item.url)}
                  className="w-full flex items-center gap-2"
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
