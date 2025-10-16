import { useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon?: React.ComponentType<any>;
  matchUrls?: string[];
  items?: NavItem[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const location = useLocation();
  const currentPath = location.pathname.replace(/^\//, "");

  const isMatch = (path: string, matchUrls?: string[]) => {
    if (currentPath === path) return true;
    if (matchUrls) return matchUrls.some((match) => currentPath.startsWith(match));
    return false;
  };

  const renderItems = (navItems: NavItem[], isSub = false) => {
    const Container = isSub ? SidebarMenuSub : SidebarMenu;
    const Item = isSub ? SidebarMenuSubItem : SidebarMenuItem;
    const Button = isSub ? SidebarMenuSubButton : SidebarMenuButton;

    return (
      <Container>
        {navItems.map((item) => {
          const isActive =
            isMatch(item.url, item.matchUrls) ||
            item.items?.some((sub) => isMatch(sub.url, sub.matchUrls));

          return (
            <Item key={item.title}>
              <Button
                asChild
                className={isActive ? "text-primary font-semibold" : ""}
              >
                <a href={`/${item.url}`} className="w-full block">
                  {item.icon && <item.icon />}
                  {item.title}
                </a>
              </Button>

              {item.items && renderItems(item.items, true)}
            </Item>
          );
        })}
      </Container>
    );
  };

  return <SidebarGroup>{renderItems(items)}</SidebarGroup>;
}
