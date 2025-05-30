import { applyThemeToCSSVariables } from "@/lib/utils";
import { useThemeStore } from "@/store/theme";
import { Moon, Sun } from "lucide-react";

export function ToggleThemeButton() {
  const { mode, setMode } = useThemeStore();

  const toggleTheme = () => {
    const nextMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);

    const { theme } = useThemeStore.getState();
    applyThemeToCSSVariables(theme);
  };

  return (
    <div
      className="p-2 rounded-full bg-[var(--primaryColor)] text-[var(--bgPrimaryColor)] hover:opacity-80 transition sm:ml-4 cursor-pointer"
      onClick={toggleTheme}
    >
      {mode === "dark" ? <Moon size={18} /> : <Sun size={18}/>}
    </div>
  );
}