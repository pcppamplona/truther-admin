import React from "react";
import { useI18n, LocaleKey } from "@/i18n";

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { lang, setLang } = useI18n();

  return (
    <select
      className={className ?? "border border-border rounded-md px-2 py-2 text-sm bg-background"}
      value={lang}
      onChange={(e) => setLang(e.target.value as LocaleKey)}
      aria-label="Language selector"
    >
      <option value="en">English</option>
      <option value="pt">Português</option>
      <option value="es">Español</option>
    </select>
  );
};
