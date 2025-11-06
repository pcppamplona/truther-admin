"use client";

import { useLocation } from "react-router-dom";
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

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
  matchUrls?: string[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const location = useLocation();
  const isItemActive = (item: NavItem): boolean => {
    const currentPath = location.pathname;

    if (currentPath === `/${item.url}`) return true;
    if (item.matchUrls?.some((m) => currentPath.includes(m))) return true;
    if (item.items?.some(isItemActive)) return true;

    return false;
  };

  const renderNavItems = (navItems: NavItem[], depth = 0) => {
    const isSub = depth > 0;
    const Container = isSub ? SidebarMenuSub : SidebarMenu;
    const Item = isSub ? SidebarMenuSubItem : SidebarMenuItem;
    const Button = isSub ? SidebarMenuSubButton : SidebarMenuButton;

    return (
      <Container>
        {navItems.map((item) => {
          const hasChildren = item.items && item.items.length > 0;
          const active = isItemActive(item);
          const activeClass = active ? "text-primary font-semibold" : "";

          if (!isSub && hasChildren) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={active}
                className="group/collapsible"
              >
                <Item>
                  <CollapsibleTrigger asChild>
                    <Button tooltip={item.title} className={activeClass}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    {renderNavItems(item.items!, depth + 1)}
                  </CollapsibleContent>
                </Item>
              </Collapsible>
            );
          }

          if (isSub && hasChildren) {
            return (
              <Item key={item.title}>
                <Button asChild tooltip={item.title} className={activeClass}>
                  <a href={`/${item.url}`}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </Button>

                <SidebarMenuSub>
                  {(item.items ?? []).map((subItem) => {
                    const subActive = isItemActive(subItem);
                    const subClass = subActive ? "text-primary font-semibold" : "";
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild className={subClass}>
                          <a href={`/${subItem.url}`}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </Item>
            );
          }

          return (
            <Item key={item.title}>
              <Button asChild tooltip={item.title} className={activeClass}>
                <a href={`/${item.url}`}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </Button>
            </Item>
          );
        })}
      </Container>
    );
  };

  return <SidebarGroup>{renderNavItems(items)}</SidebarGroup>;
}
