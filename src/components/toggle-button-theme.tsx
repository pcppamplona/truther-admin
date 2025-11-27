import { useThemeStore } from "@/store/theme";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/i18n";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function ToggleThemeButton() {
  const { theme, setTheme } = useThemeStore();
  const { t } = useI18n();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={toggleTheme}
    >
      <div className="flex w-full items-center gap-2">
        {isDark ? <Moon /> : <Sun />}
        <span className="flex-1 text-left">
          {t("common.theme.label")}:{" "}
          {isDark ? t("common.theme.dark") : t("common.theme.light")}
        </span>
      </div>
    </DropdownMenuItem>
  );
}
