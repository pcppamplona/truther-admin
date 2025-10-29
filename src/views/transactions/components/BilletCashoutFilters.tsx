import { useState, useRef } from "react";
import { Funnel, Calendar as CalendarIcon, X } from "lucide-react";
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

export interface BilletCashoutFiltersValues {
  orderId?: string;
  receiverName?: string;
  receiverDocument?: string;
  status?: string;
  min_amount?: string;
  max_amount?: string;
  banksId?: string;
  created_after?: string;
  created_before?: string;
}

interface BilletCashoutFiltersProps extends BilletCashoutFiltersValues {
  setValues: (next: Partial<BilletCashoutFiltersValues>) => void;
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
    status: "Status",
    receiverName: "Nome",
    receiverDocument: "Documento",
    min_amount: "Valor mín.",
    max_amount: "Valor máx.",
    banksId: "Banco",
    orderId: "Order ID",
    created_after: "Criado após",
    created_before: "Criado antes",
  };

  if (key.includes("amount") && value)
    value = Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  if (key.startsWith("created_") && value)
    value = new Date(value).toLocaleDateString("pt-BR");

  return `${map[key] ?? key}: ${value}`;
}


export function BilletCashoutFilters(props: BilletCashoutFiltersProps) {
  const {
    orderId,
    receiverName,
    receiverDocument,
    status,
    min_amount,
    max_amount,
    banksId,
    created_after,
    created_before,
    setValues,
    setPage,
  } = props;

  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [localOrderId, setLocalOrderId] = useState(orderId ?? "");
  const [localReceiverName, setLocalReceiverName] = useState(
    receiverName ?? ""
  );
  const [localReceiverDocument, setLocalReceiverDocument] = useState(
    receiverDocument ?? ""
  );
  const [localStatus, setLocalStatus] = useState(status ?? "");
  const [localBanksId, setLocalBanksId] = useState(banksId ?? "");
  const [localMinAmount, setLocalMinAmount] = useState(min_amount ?? "");
  const [localMaxAmount, setLocalMaxAmount] = useState(max_amount ?? "");
  const [localCreatedAfter, setLocalCreatedAfter] = useState<Date | undefined>(
    created_after ? new Date(created_after) : undefined
  );
  const [localCreatedBefore, setLocalCreatedBefore] = useState<
    Date | undefined
  >(created_before ? new Date(created_before) : undefined);

  const [openBeforeCalendar, setOpenBeforeCalendar] = useState(false);
  const [openAfterCalendar, setOpenAfterCalendar] = useState(false);

  const resetLocal = () => {
    setLocalOrderId("");
    setLocalReceiverName("");
    setLocalReceiverDocument("");
    setLocalStatus("");
    setLocalBanksId("");
    setLocalMinAmount("");
    setLocalMaxAmount("");
    setLocalCreatedAfter(undefined);
    setLocalCreatedBefore(undefined);
  };

  const apply = () => {
    setPage(1);
    setValues({
      orderId: localOrderId,
      receiverName: localReceiverName,
      receiverDocument: localReceiverDocument,
      status: localStatus,
      banksId: localBanksId,
      min_amount: localMinAmount,
      max_amount: localMaxAmount,
      created_after: formatDateParam(localCreatedAfter),
      created_before: formatDateParam(localCreatedBefore),
    });
    setOpen(false);
  };

  const clearAll = () => {
    setPage(1);
    setValues({
      orderId: "",
      receiverName: "",
      receiverDocument: "",
      status: "",
      banksId: "",
      min_amount: "",
      max_amount: "",
      created_after: undefined,
      created_before: undefined,
    });
    resetLocal();
    setOpen(false);
  };

  const syncWhenOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setLocalOrderId(orderId ?? "");
      setLocalReceiverName(receiverName ?? "");
      setLocalReceiverDocument(receiverDocument ?? "");
      setLocalStatus(status ?? "");
      setLocalBanksId(banksId ?? "");
      setLocalMinAmount(min_amount ?? "");
      setLocalMaxAmount(max_amount ?? "");
      setLocalCreatedAfter(created_after ? new Date(created_after) : undefined);
      setLocalCreatedBefore(
        created_before ? new Date(created_before) : undefined
      );
    }
  };

  return (
    <div className="w-full flex justify-end">
      <Drawer open={open} onOpenChange={syncWhenOpen} direction="right">
        <DrawerTrigger asChild>
          <Button className="w-14 h-12 ">
            <Funnel size={18} color="#fff" />
          </Button>
        </DrawerTrigger>
        <DrawerContent
          ref={drawerRef}
          className="p-4 data-[vaul-drawer-direction=right]:w-[700px] data-[vaul-drawer-direction=right]:max-w-[70vw] data-[vaul-drawer-direction=right]:sm:max-w-[70vw]"
        >
          <div className="grid grid-cols-2 gap-4 p-4">
            <DrawerHeader className="col-span-full">
              <DrawerTitle>Filtros Billet Cashout</DrawerTitle>
            </DrawerHeader>

            <div>
              <Label htmlFor="orderId">ID do Pedido</Label>
              <input
                id="orderId"
                className="mt-1 w-full border rounded px-3 py-2 bg-transparent font-mono text-xs"
                placeholder="ID do pedido"
                value={localOrderId}
                onChange={(e) => setLocalOrderId(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="receiverName">Nome do beneficiário</Label>
              <input
                id="receiverName"
                className="mt-1 w-full border rounded px-3 py-2 bg-transparent"
                placeholder="contém..."
                value={localReceiverName}
                onChange={(e) => setLocalReceiverName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="receiverDocument">
                Documento do beneficiário
              </Label>
              <input
                id="receiverDocument"
                className="mt-1 w-full border rounded px-3 py-2 bg-transparent"
                placeholder="Somente números"
                value={localReceiverDocument}
                onChange={(e) => setLocalReceiverDocument(e.target.value)}
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={localStatus || "ALL"}
                onValueChange={(v) => setLocalStatus(v === "ALL" ? "" : v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="NEW">NEW</SelectItem>
                  <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                  <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                  <SelectItem value="CANCEL">CANCEL</SelectItem>
                  <SelectItem value="FAILED">FAILED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="banksId">Banco</Label>
              <input
                id="banksId"
                className="mt-1 w-full border rounded px-3 py-2 bg-transparent"
                placeholder="ID ou nome do banco"
                value={localBanksId}
                onChange={(e) => setLocalBanksId(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="min_amount">Valor mínimo</Label>
              <input
                id="min_amount"
                className="mt-1 w-full border rounded px-3 py-2 bg-transparent"
                placeholder="9.99"
                value={localMinAmount}
                onChange={(e) => setLocalMinAmount(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="max_amount">Valor máximo</Label>
              <input
                id="max_amount"
                className="mt-1 w-full border rounded px-3 py-2 bg-transparent"
                placeholder="9.99"
                value={localMaxAmount}
                onChange={(e) => setLocalMaxAmount(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <Label>Data início</Label>
              <Popover
                open={openAfterCalendar}
                onOpenChange={setOpenAfterCalendar}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={"justify-start text-left font-normal mt-1"}
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
                      setOpenAfterCalendar(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col">
              <Label>Data fim</Label>
              <Popover
                open={openBeforeCalendar}
                onOpenChange={setOpenBeforeCalendar}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={"justify-start text-left font-normal mt-1"}
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
                      setOpenBeforeCalendar(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
