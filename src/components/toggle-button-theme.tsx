import { useThemeStore } from "@/store/theme";
import { Moon, Sun } from "lucide-react";

export function ToggleThemeButton() {
  const { theme, setTheme } = useThemeStore();

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
      {isDark ? "Escuro" : "Claro"}
    </div>
  );
}
