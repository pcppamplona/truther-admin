// src/pages/transactions/components/BridgeFilters.tsx

import { useState, useRef } from "react";
import { Funnel, Calendar as CalendarIcon, X, ListFilter } from "lucide-react";
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

function formatDateParam(date?: Date): string | undefined {
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
  const { user_id, wallet_id, status, created_after, created_before, setValues, setPage } = props;

  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // estados locais
  const [localUserId, setLocalUserId] = useState(user_id ?? "");
  const [localWalletId, setLocalWalletId] = useState(wallet_id ?? "");
  const [localStatus, setLocalStatus] = useState(status ?? "");
  const [localCreatedAfter, setLocalCreatedAfter] = useState<Date | undefined>(
    created_after ? new Date(created_after) : undefined
  );
  const [localCreatedBefore, setLocalCreatedBefore] = useState<Date | undefined>(
    created_before ? new Date(created_before) : undefined
  );

  const [openBeforeCalendar, setOpenBeforeCalendar] = useState(false);
  const [openAfterCalendar, setOpenAfterCalendar] = useState(false);

  const resetLocal = () => {
    setLocalUserId("");
    setLocalWalletId("");
    setLocalStatus("");
    setLocalCreatedAfter(undefined);
    setLocalCreatedBefore(undefined);
  };

  const apply = () => {
    setPage(1);
    setValues({
      user_id: localUserId,
      wallet_id: localWalletId,
      status: localStatus,
      created_after: formatDateParam(localCreatedAfter),
      created_before: formatDateParam(localCreatedBefore),
    });
    setOpen(false);
  };

  const clearAll = () => {
    setPage(1);
    setValues({
      user_id: "",
      wallet_id: "",
      status: "",
      created_after: undefined,
      created_before: undefined,
    });
    resetLocal();
    setOpen(false);
  };

  const syncWhenOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setLocalUserId(user_id ?? "");
      setLocalWalletId(wallet_id ?? "");
      setLocalStatus(status ?? "");
      setLocalCreatedAfter(created_after ? new Date(created_after) : undefined);
      setLocalCreatedBefore(created_before ? new Date(created_before) : undefined);
    }
  };

  const statuses: TxStatusBridge[] = [
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

  return (
    <div className="w-full flex justify-end">
      <Drawer open={open} onOpenChange={syncWhenOpen} direction="right">
        <DrawerTrigger asChild>
          <Button className="w-14 h-12">
            <Funnel size={18} color="#fff" />
          </Button>
        </DrawerTrigger>

        <DrawerContent
          ref={drawerRef}
          className="p-4 data-[vaul-drawer-direction=right]:w-[600px] data-[vaul-drawer-direction=right]:max-w-[70vw]"
        >
          <div className="grid grid-cols-2 gap-4 p-4">
            <DrawerHeader className="col-span-full">
              <DrawerTitle className="flex flex-row items-center gap-2"><ListFilter />Filtros Bridge Transactions</DrawerTitle>
            </DrawerHeader>

            {/* User ID */}
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
              <Popover open={openAfterCalendar} onOpenChange={setOpenAfterCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal mt-1">
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
                      setOpenAfterCalendar(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data fim */}
            <div className="flex flex-col mt-4">
              <Label>Data fim</Label>
              <Popover open={openBeforeCalendar} onOpenChange={setOpenBeforeCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal mt-1">
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
                      setOpenBeforeCalendar(false);
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
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            <DrawerFooter className="col-span-full">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={clearAll}>
                  <X size={16} className="mr-1" /> Limpar
                </Button>
                <Button onClick={apply}>Aplicar</Button>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
