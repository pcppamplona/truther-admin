import * as React from "react";
import {
  ChevronDown,
  FileText,
  Funnel,
  MessageSquareText,
  Search,
  Calendar as CalendarIcon,
  X,
  Shield,
  ScrollText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { methodType } from "@/interfaces/AuditLogData";
import { useRef, useState } from "react";
import { useI18n } from "@/i18n";
import { Badge } from "../ui/badge";

type actionType = "security" | "listing" | "alter" | "crm" | "export";

interface AuditLogFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  descriptionSearch: string;
  setDescriptionSearch: (value: string) => void;
  selectedMethod: methodType | "";
  setSelectedMethod: (value: methodType | "") => void;
  selectedAction: actionType | "";
  setSelectedAction: (value: actionType | "") => void;
  selectedSeverity: "" | "low" | "medium" | "high";
  setSelectedSeverity: (value: "" | "low" | "medium" | "high") => void;
  createdBefore: string | undefined;
  setCreatedBefore: (value: string | undefined) => void;
  createdAfter: string | undefined;
  setCreatedAfter: (value: string | undefined) => void;
  setPage: (value: number) => void;
  methodColors: Record<methodType, string>;
}

export function AuditLogFilters({
  search,
  setSearch,
  descriptionSearch,
  setDescriptionSearch,
  selectedMethod,
  setSelectedMethod,
  selectedAction,
  setSelectedAction,
  selectedSeverity,
  setSelectedSeverity,
  createdBefore,
  setCreatedBefore,
  createdAfter,
  setCreatedAfter,
  setPage,
  methodColors,
}: AuditLogFiltersProps) {
  const { t } = useI18n();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState("");
  const [drawerDescriptionSearch, setDrawerDescriptionSearch] = useState("");
  const [drawerSelectedMethod, setDrawerSelectedMethod] = useState<
    methodType | ""
  >(selectedMethod);
  const [drawerSelectedAction, setDrawerSelectedAction] = useState<
    actionType | ""
  >(selectedAction);
  const [drawerSelectedSeverity, setDrawerSelectedSeverity] = useState<
    "" | "low" | "medium" | "high"
  >(selectedSeverity);
  const [drawerCreatedBefore, setDrawerCreatedBefore] = useState<
    Date | undefined
  >(createdBefore ? new Date(createdBefore) : undefined);
  const [drawerCreatedAfter, setDrawerCreatedAfter] = useState<
    Date | undefined
  >(createdAfter ? new Date(createdAfter) : undefined);
  const [openBeforeCalendar, setOpenBeforeCalendar] = useState(false);
  const [openAfterCalendar, setOpenAfterCalendar] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);

  const handleDrawerOpenChange = (open: boolean) => {
    if (open) {
      setDrawerSearch(search);
      setDrawerDescriptionSearch(descriptionSearch);
      setDrawerSelectedMethod(selectedMethod);
      setDrawerSelectedAction(selectedAction);
      setDrawerSelectedSeverity(selectedSeverity);

      if (createdBefore) {
        const [year, month, day] = createdBefore.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        setDrawerCreatedBefore(date);
      } else {
        setDrawerCreatedBefore(undefined);
      }

      if (createdAfter) {
        const [year, month, day] = createdAfter.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        setDrawerCreatedAfter(date);
      } else {
        setDrawerCreatedAfter(undefined);
      }
    }
    setIsDrawerOpen(open);
  };

  const handleClear = () => {
    setDrawerSearch("");
    setDrawerDescriptionSearch("");
    setDrawerSelectedMethod("");
    setDrawerSelectedAction("");
    setDrawerSelectedSeverity("");
    setDrawerCreatedBefore(undefined);
    setDrawerCreatedAfter(undefined);
    setSearch("");
    setDescriptionSearch("");
    setSelectedMethod("");
    setSelectedAction("");
    setSelectedSeverity("");
    setCreatedBefore(undefined);
    setCreatedAfter(undefined);
    setIsDrawerOpen(false);
  };

  const handleApply = () => {
    setSearch(drawerSearch);
    setDescriptionSearch(drawerDescriptionSearch);
    setSelectedMethod(drawerSelectedMethod);
    setSelectedAction(drawerSelectedAction);
    setSelectedSeverity(drawerSelectedSeverity);

    const formattedBeforeDate = drawerCreatedBefore
      ? formatDateToYYYYMMDD(drawerCreatedBefore)
      : undefined;

    const formattedAfterDate = drawerCreatedAfter
      ? formatDateToYYYYMMDD(drawerCreatedAfter)
      : undefined;

    setCreatedBefore(formattedBeforeDate);
    setCreatedAfter(formattedAfterDate);

    setPage(1);
    setIsDrawerOpen(false);
  };

  const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleClearBeforeClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDrawerCreatedBefore(undefined);
  };

  const handleClearAfterClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDrawerCreatedAfter(undefined);
  };

  const clearAll = () => {
    setPage(1);
    setSearch("");
    setDescriptionSearch("");
    setSelectedMethod("");
    setSelectedAction("");
    setSelectedSeverity("");
    setCreatedBefore(undefined);
    setCreatedAfter(undefined);
  };

  const activeFilters = Object.entries({
    search,
    descriptionSearch,
    selectedMethod,
    selectedAction,
    selectedSeverity,
    createdBefore,
    createdAfter,
  })
    .filter(([_, value]) => value && value !== "")
    .map(([key, value]) => ({
      key,
      label: formatFilterLabel(key, value),
    }));

  function formatFilterLabel(key: string, value: any): string {
    switch (key) {
      case "search":
        return `${t("audit.filters.message.label")}: ${value}`;
      case "descriptionSearch":
        return `${t("audit.filters.descriptionField.label")}: ${value}`;
      case "selectedMethod":
        return `${t("audit.filters.method.label")}: ${value}`;
      case "selectedAction":
        return `${t("audit.filters.action.label")}: ${value}`;
      case "selectedSeverity":
        return `${t("audit.filters.severity.labelShort")}: ${t(`audit.filters.severity.options.${value}`)}`;
      case "createdBefore":
        return `${t("audit.filters.createdAt.createdBefore")}: ${value}`;
      case "createdAfter":
        return `${t("audit.filters.createdAt.createdAfter")}: ${value}`;
      default:
        return `${key}: ${value}`;
    }
  }

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex flex-wrap gap-2 mb-4">
        {activeFilters.map(({ key, label }) => (
          <Badge
            key={key}
            variant="secondary"
            className="text-xs font-medium cursor-pointer"
            onClick={() => {
              switch (key) {
                case "search":
                  setSearch("");
                  break;
                case "descriptionSearch":
                  setDescriptionSearch("");
                  break;
                case "selectedMethod":
                  setSelectedMethod("");
                  break;
                case "selectedAction":
                  setSelectedAction("");
                  break;
                case "selectedSeverity":
                  setSelectedSeverity("");
                  break;
                case "createdBefore":
                  setCreatedBefore(undefined);
                  break;
                case "createdAfter":
                  setCreatedAfter(undefined);
                  break;
              }
              setPage(1);
            }}
          >
            {label} ✕
          </Badge>
        ))}

        {activeFilters.length > 0 && (
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
            onClick={clearAll}
          >
            Limpar tudo
          </Badge>
        )}
      </div>
      
      <Drawer
        open={isDrawerOpen}
        onOpenChange={handleDrawerOpenChange}
        direction="right"
      >
        <DrawerTrigger asChild>
          <Button className="w-12 h-10" variant="outline">
            <Funnel size={16}  />
          </Button>
        </DrawerTrigger>
        <DrawerContent
          ref={drawerRef}
          className="
          p-4
          data-[vaul-drawer-direction=right]:w-[500px]
          data-[vaul-drawer-direction=right]:max-w-[70vw]
          data-[vaul-drawer-direction=right]:sm:max-w-[70vw]
        "
        >
          <DrawerHeader>
            <DrawerTitle>{t("audit.filters.title")}</DrawerTitle>
            <DrawerDescription>
              {t("audit.filters.description")}
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-row gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquareText size={18} />
                  <strong>{t("audit.filters.message.label")}</strong>
                </div>
                <div className="flex items-center border border-border rounded-lg px-3 py-3 w-full">
                  <Search size={16} className="mr-2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t("audit.filters.message.placeholder")}
                    className="outline-none text-sm w-full"
                    value={drawerSearch}
                    onChange={(e) => setDrawerSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ScrollText size={18} />
                  <strong>{t("audit.filters.descriptionField.label")}</strong>
                </div>
                <div className="flex items-center border border-border rounded-lg px-3 py-3 w-full">
                  <Search size={16} className="mr-2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t(
                      "audit.filters.descriptionField.placeholder"
                    )}
                    className="outline-none text-sm w-full"
                    value={drawerDescriptionSearch}
                    onChange={(e) => setDrawerDescriptionSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={18} />
                  <strong>{t("audit.filters.method.label")}</strong>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {drawerSelectedMethod ||
                        t("audit.filters.method.placeholder")}
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                      onClick={() => setDrawerSelectedMethod("")}
                      className="cursor-pointer"
                    >
                      {t("common.actions.all")}
                    </DropdownMenuItem>
                    {["POST", "DELETE", "GET", "PUT", "PATCH"].map((method) => (
                      <DropdownMenuItem
                        key={method}
                        onClick={() =>
                          setDrawerSelectedMethod(method as methodType)
                        }
                        className={`cursor-pointer ${
                          drawerSelectedMethod === method ? "bg-muted" : ""
                        }`}
                      >
                        <span className={methodColors[method as methodType]}>
                          {method}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={18} />
                  <strong>{t("audit.filters.action.label")}</strong>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {drawerSelectedAction ||
                        t("audit.filters.action.placeholder")}
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                      onClick={() => setDrawerSelectedAction("")}
                      className="cursor-pointer"
                    >
                      {t("common.actions.all")}
                    </DropdownMenuItem>
                    {["security", "listing", "alter", "crm", "export"].map((action) => (
                      <DropdownMenuItem
                        key={action}
                        onClick={() =>
                          setDrawerSelectedAction(action as actionType)
                        }
                        className={`cursor-pointer ${
                          drawerSelectedAction === action ? "bg-muted" : ""
                        }`}
                      >
                        {action}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>

          <div className="flex flex-row gap-4">

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={18} />
                  <strong>{t("audit.filters.severity.label")}</strong>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {drawerSelectedSeverity
                        ? t(`audit.filters.severity.options.${drawerSelectedSeverity}`)
                        : t("audit.filters.severity.placeholder")}
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                      onClick={() => setDrawerSelectedSeverity("")}
                      className="cursor-pointer"
                    >
                      {t("common.actions.all")}
                    </DropdownMenuItem>
                    {["low", "medium", "high"].map((sev) => (
                      <DropdownMenuItem
                        key={sev}
                        onClick={() => setDrawerSelectedSeverity(sev as any)}
                        className={`cursor-pointer ${
                          drawerSelectedSeverity === sev ? "bg-muted" : ""
                        }`}
                      >
                        {t(`audit.filters.severity.options.${sev}`)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
          </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <CalendarIcon size={18} />
                <strong>{t("audit.filters.createdAt.label")}</strong>
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-3 flex-1">
                  <Label htmlFor="created_after" className="px-1">
                    {t("audit.filters.createdAt.createdAfter")}
                  </Label>
                  <Popover
                    open={openAfterCalendar}
                    onOpenChange={setOpenAfterCalendar}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="created_after"
                        className="w-full justify-between font-normal"
                        type="button"
                        aria-label={t("audit.filters.createdAt.ariaAfter")}
                      >
                        <span>
                          {drawerCreatedAfter
                            ? formatDateToYYYYMMDD(drawerCreatedAfter)
                            : t("common.actions.selectDate")}
                        </span>

                        <span className="flex items-center gap-1">
                          {drawerCreatedAfter && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              aria-label={t("audit.filters.calendar.clear")}
                              onClick={handleClearAfterClick}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          <CalendarIcon className="h-4 w-4 opacity-60" />
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      container={drawerRef.current}
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={drawerCreatedAfter}
                        captionLayout="dropdown"
                        onSelect={setDrawerCreatedAfter}
                        initialFocus
                      />
                      <div className="flex justify-end gap-2 p-2">
                        {drawerCreatedAfter && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDrawerCreatedAfter(undefined);
                              setOpenAfterCalendar(false);
                            }}
                          >
                            {t("audit.filters.calendar.clear")}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => setOpenAfterCalendar(false)}
                        >
                          {t("audit.filters.calendar.ok")}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  <Label htmlFor="created_before" className="px-1">
                    {t("audit.filters.createdAt.createdBefore")}
                  </Label>
                  <Popover
                    open={openBeforeCalendar}
                    onOpenChange={setOpenBeforeCalendar}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="created_before"
                        className="w-full justify-between font-normal"
                        type="button"
                        aria-label={t("audit.filters.createdAt.ariaBefore")}
                      >
                        <span>
                          {drawerCreatedBefore
                            ? formatDateToYYYYMMDD(drawerCreatedBefore)
                            : t("common.actions.selectDate")}
                        </span>

                        <span className="flex items-center gap-1">
                          {drawerCreatedBefore && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              aria-label={t("audit.filters.calendar.clear")}
                              onClick={handleClearBeforeClick}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          <CalendarIcon className="h-4 w-4 opacity-60" />
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      container={drawerRef.current}
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={drawerCreatedBefore}
                        captionLayout="dropdown"
                        onSelect={setDrawerCreatedBefore}
                        initialFocus
                      />
                      <div className="flex justify-end gap-2 p-2">
                        {drawerCreatedBefore && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDrawerCreatedBefore(undefined);
                              setOpenBeforeCalendar(false);
                            }}
                          >
                            {t("audit.filters.calendar.clear")}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => setOpenBeforeCalendar(false)}
                        >
                          {t("audit.filters.calendar.ok")}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className="flex flex-row justify-end gap-2">
            <Button variant="outline" onClick={handleClear}>
              {t("common.actions.clear")}
            </Button>
            <Button onClick={handleApply}>{t("common.actions.apply")}</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
