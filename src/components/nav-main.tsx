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

type SubItem = {
  title: string;
  url: string;
  matchUrls?: string[];
};

type NavItem = {
  title: string;
  url: string;
  icon?: React.ComponentType<any>;
  items?: SubItem[];
  matchUrls?: string[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const location = useLocation();
  const currentPath = location.pathname.replace(/^\//, "");

  const isMatch = (path: string, matchUrls?: string[]) => {
    if (currentPath === path) return true;
    if (matchUrls) {
      return matchUrls.some((match) => currentPath.startsWith(match));
    }
    return false;
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isItemActive =
            isMatch(item.url, item.matchUrls) ||
            item.items?.some((sub) => isMatch(sub.url, sub.matchUrls));

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={
                  isItemActive ? "text-primary font-semibold" : ""
                }
              >
                <a href={`/${item.url}`} className="w-full block">
                  {item.icon && <item.icon />}
                  {item.title}
                </a>
              </SidebarMenuButton>

              {item.items && (
                <SidebarMenuSub>
                  {item.items.map((subItem) => {
                    const isSubActive = isMatch(subItem.url, subItem.matchUrls);

                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={
                            isSubActive
                              ? "text-primary font-semibold"
                              : ""
                          }
                        >
                          <a
                            href={`/${subItem.url}`}
                            className="w-full block text-sm pl-4"
                          >
                            {subItem.title}
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
