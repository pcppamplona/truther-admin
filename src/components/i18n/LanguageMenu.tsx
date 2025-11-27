import React from "react";
import { Languages } from "lucide-react";
import { useI18n, LocaleKey } from "@/i18n";
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

export const LanguageMenu: React.FC = () => {
  const { lang, setLang, t } = useI18n();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex w-full cursor-pointer items-center justify-between px-2 py-1.5 text-sm">
        <div className="flex items-center gap-2">
          <Languages />
          <span>{t("common.language")}</span>
        </div>
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent className="w-40">
        <DropdownMenuRadioGroup
          value={lang}
          onValueChange={(v) => setLang(v as LocaleKey)}
        >
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="pt">Português</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="es">Español</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
