import { useThemeStore } from "@/store/theme";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/i18n";

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
    <div className="flex items-center cursor-pointer gap-2" onClick={toggleTheme}>
      {isDark ? <Moon /> : <Sun />}
      {isDark ? t("common.theme.dark") : t("common.theme.light")}
    </div>
  );
}
