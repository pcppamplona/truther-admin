import { useState, useRef } from "react";
import { Funnel, Calendar as CalendarIcon, X, ListFilter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { TxStatusBridge } from "@/interfaces/Transactions";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTransactionsCsv } from "@/services/transactions/useTransactionsCsv";
import { useI18n } from "@/i18n";

export interface BridgeFiltersValues {
  user_id?: string;
  wallet_id?: string;
  status?: string;
  created_after?: string;
  created_before?: string;
}

interface BridgeFiltersProps extends BridgeFiltersValues {
  setValues: (next: Partial<BridgeFiltersValues>) => void;
  setPage: (v: number) => void;
}

function formatDateFilter(date?: Date): string | undefined {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatFilterLabel(key: string, value: any): string {
  const map: Record<string, string> = {
    user_id: "User ID",
    wallet_id: "Wallet ID",
    status: "Status",
    created_after: "Criado após",
    created_before: "Criado antes",
  };

  if (key.startsWith("created_") && value)
    value = new Date(value).toLocaleDateString("pt-BR");

  return `${map[key] ?? key}: ${value}`;
}

export function BridgeFilters(props: BridgeFiltersProps) {
  const { t } = useI18n();
  const {
    user_id,
    wallet_id,
    status,
    created_after,
    created_before,
    setValues,
    setPage,
  } = props;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [localUserId, setLocalUserId] = useState(user_id ?? "");
  const [localWalletId, setLocalWalletId] = useState(wallet_id ?? "");
  const [localStatus, setLocalStatus] = useState(status ?? "");
  const [localCreatedAfter, setLocalCreatedAfter] = useState<Date | undefined>(
    created_after ? new Date(created_after) : undefined
  );
  const [localCreatedBefore, setLocalCreatedBefore] = useState<
    Date | undefined
  >(created_before ? new Date(created_before) : undefined);

  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);

  const resetLocalState = () => {
    setLocalUserId("");
    setLocalWalletId("");
    setLocalStatus("");
    setLocalCreatedAfter(undefined);
    setLocalCreatedBefore(undefined);
  };

  const applyFilters = () => {
    setPage(1);
    setValues({
      user_id: localUserId,
      wallet_id: localWalletId,
      status: localStatus,
      created_after: formatDateFilter(localCreatedAfter),
      created_before: formatDateFilter(localCreatedBefore),
    });
    setIsDrawerOpen(false);
  };

  const clearFilters = () => {
    setPage(1);
    setValues({
      user_id: "",
      wallet_id: "",
      status: "",
      created_after: undefined,
      created_before: undefined,
    });
    resetLocalState();
    setIsDrawerOpen(false);
  };

  const handleDrawerOpenChange = (nextOpen: boolean) => {
    setIsDrawerOpen(nextOpen);
    if (nextOpen) {
      setLocalUserId(user_id ?? "");
      setLocalWalletId(wallet_id ?? "");
      setLocalStatus(status ?? "");
      setLocalCreatedAfter(created_after ? new Date(created_after) : undefined);
      setLocalCreatedBefore(
        created_before ? new Date(created_before) : undefined
      );
    }
  };

  const bridgeStatuses: TxStatusBridge[] = [
    "SUCCESS",
    "FAILED",
    "DUPLICATED",
    "WAITING_CONFIRM",
    "PROCESSING_2GO",
    "PROCESSING",
    "REFUND",
    "EXECUTING",
    "COMPLETED",
    "PENDING_WITHDRAWAL",
    "NEW",
    "NEEDCHECK",
    "WAITING_REFUND",
    "REFUNDED",
    "CHECKING",
    "CANCELED",
    "FAILED_BRIDGE",
    "EME",
  ];

  const activeFilters = Object.entries({
    user_id,
    wallet_id,
    status,
    created_after,
    created_before,
  })
    .filter(([_, value]) => value && value !== "")
    .map(([key, value]) => ({
      key,
      label: formatFilterLabel(key, value),
    }));

  const downloadCsv = useTransactionsCsv('/transactions/bridges/csv', 'bridges');
  const handleDownloadCsv = async () => {
    await downloadCsv({
      user_id,
      wallet_id,
      status,
      created_after,
      created_before,
    });
  };

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(({ key, label }) => (
          <Badge
            key={key}
            variant="secondary"
            className="text-xs font-medium cursor-pointer"
            onClick={() => setValues({ [key]: undefined })}
          >
            {label} ✕
          </Badge>
        ))}

        <div className="flex items-center gap-2">
          {activeFilters.length > 0 && (
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={clearFilters}
            >
              Limpar tudo
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-14 h-12" onClick={handleDownloadCsv}>
                <Download size={18} color="#fff" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("common.actions.downloadCsv")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange} direction="right">
        <DrawerTrigger asChild>
          <Button className="w-12 h-10 mr-2" variant="outline">
            <Funnel size={16}  />
          </Button>
        </DrawerTrigger>

          <DrawerContent
            ref={drawerRef}
            className="p-4 data-[vaul-drawer-direction=right]:w-[600px] data-[vaul-drawer-direction=right]:max-w-[70vw]"
          >
          <div className="grid grid-cols-2 gap-4 p-4">
            <DrawerHeader className="col-span-full">
              <DrawerTitle className="flex flex-row items-center gap-2">
                <ListFilter />
                Filtros Bridge Transactions
              </DrawerTitle>
            </DrawerHeader>

            <div className="mt-4">
              <Label htmlFor="user_id">User ID</Label>
              <input
                id="user_id"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent font-mono text-xs"
                placeholder="Ex: 12"
                value={localUserId}
                onChange={(e) => setLocalUserId(e.target.value)}
              />
            </div>

            {/* Wallet ID */}
            <div className="mt-4">
              <Label htmlFor="wallet_id">Wallet ID</Label>
              <input
                id="wallet_id"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent font-mono text-xs"
                placeholder="Ex: 3"
                value={localWalletId}
                onChange={(e) => setLocalWalletId(e.target.value)}
              />
            </div>

            <div className="flex flex-col mt-4">
              <Label>Data início</Label>
              <Popover
                open={isStartDatePickerOpen}
                onOpenChange={setIsStartDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localCreatedAfter
                      ? localCreatedAfter.toLocaleDateString()
                      : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  container={drawerRef.current}
                  className="w-auto p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={localCreatedAfter}
                    onSelect={(date) => {
                      setLocalCreatedAfter(date ?? undefined);
                      setIsStartDatePickerOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col mt-4">
              <Label>Data fim</Label>
              <Popover
                open={isEndDatePickerOpen}
                onOpenChange={setIsEndDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localCreatedBefore
                      ? localCreatedBefore.toLocaleDateString()
                      : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  container={drawerRef.current}
                  className="w-auto p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={localCreatedBefore}
                    onSelect={(date) => {
                      setLocalCreatedBefore(date ?? undefined);
                      setIsEndDatePickerOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="mt-4">
              <Label>Status</Label>
              <Select
                value={localStatus || "ALL"}
                onValueChange={(v) => setLocalStatus(v === "ALL" ? "" : v)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  {bridgeStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DrawerFooter className="col-span-full">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={clearFilters}>
                  <X size={16} className="mr-1" /> Limpar
                </Button>
                <Button onClick={applyFilters}>Aplicar</Button>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  </div>
  );
}
