import { useState, useRef, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTransactionsCsv } from "@/services/transactions/useTransactionsCsv";
import { useI18n } from "@/i18n";

export interface AtmFiltersValues {
  txid?: string;
  sender?: string;
  receiverName?: string;
  receiverDocument?: string;
  status_bk?: string;
  status_px?: string;
  min_amount?: string;
  max_amount?: string;
  created_after?: string;
  created_before?: string;
}

interface AtmFiltersProps extends AtmFiltersValues {
  setValues: (next: Partial<AtmFiltersValues>) => void;
  setPage: (v: number) => void;
}

function formatDateFilter(date?: Date): string | undefined {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatFilterLabel(key: string, value: any): string {
  const labels: Record<string, string> = {
    txid: "TXID",
    sender: "Remetente",
    receiverName: "Nome Recebedor",
    receiverDocument: "Doc. Recebedor",
    status_bk: "Status Blockchain",
    status_px: "Status Interno",
    min_amount: "Valor mínimo",
    max_amount: "Valor máximo",
    created_after: "Data início",
    created_before: "Data fim",
  };
  return `${labels[key] ?? key}: ${value}`;
}

export function AtmFilters(props: AtmFiltersProps) {
    const { t } = useI18n();
    const {
    txid,
    sender,
    receiverName,
    receiverDocument,
    status_bk,
    status_px,
    min_amount,
    max_amount,
    created_after,
    created_before,
    setValues,
    setPage,
  } = props;

  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [localTxid, setLocalTxid] = useState(txid ?? "");
  const [localSender, setLocalSender] = useState(sender ?? "");
  const [localReceiverName, setLocalReceiverName] = useState(
    receiverName ?? ""
  );
  const [localReceiverDocument, setLocalReceiverDocument] = useState(
    receiverDocument ?? ""
  );
  const [localStatusBk, setLocalStatusBk] = useState(status_bk ?? "");
  const [localStatusPx, setLocalStatusPx] = useState(status_px ?? "");
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

  const resetLocalState = () => {
    setLocalTxid("");
    setLocalSender("");
    setLocalReceiverName("");
    setLocalReceiverDocument("");
    setLocalStatusBk("");
    setLocalStatusPx("");
    setLocalMinAmount("");
    setLocalMaxAmount("");
    setLocalCreatedAfter(undefined);
    setLocalCreatedBefore(undefined);
  };

  const applyFilters = () => {
    setPage(1);
    setValues({
      txid: localTxid,
      sender: localSender,
      receiverName: localReceiverName,
      receiverDocument: localReceiverDocument,
      status_bk: localStatusBk,
      status_px: localStatusPx,
      min_amount: localMinAmount,
      max_amount: localMaxAmount,
      created_after: formatDateFilter(localCreatedAfter),
      created_before: formatDateFilter(localCreatedBefore),
    });
    setOpen(false);
  };

  const clearFilters = () => {
    setPage(1);
    setValues({
      txid: "",
      sender: "",
      receiverName: "",
      receiverDocument: "",
      status_bk: "",
      status_px: "",
      min_amount: "",
      max_amount: "",
      created_after: undefined,
      created_before: undefined,
    });
    resetLocalState();
    setOpen(false);
  };

  const handleDrawerOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setLocalTxid(txid ?? "");
      setLocalSender(sender ?? "");
      setLocalReceiverName(receiverName ?? "");
      setLocalReceiverDocument(receiverDocument ?? "");
      setLocalStatusBk(status_bk ?? "");
      setLocalStatusPx(status_px ?? "");
      setLocalMinAmount(min_amount ?? "");
      setLocalMaxAmount(max_amount ?? "");
      setLocalCreatedAfter(created_after ? new Date(created_after) : undefined);
      setLocalCreatedBefore(
        created_before ? new Date(created_before) : undefined
      );
    }
  };

  const blockchainStatuses = [
    "NEW",
    "PROCESSING",
    "CONFIRMED",
    "DROP",
    "CANCEL",
    "REFUNDED",
  ];
  const internalStatuses = [
    "NEW",
    "PROCESSING",
    "CONFIRMED",
    "CANCEL",
    "FAILED",
    "REFUNDED",
  ];

  const activeFilters = useMemo(() => {
    const entries = Object.entries({
      txid,
      sender,
      receiverName,
      receiverDocument,
      status_bk,
      status_px,
      min_amount,
      max_amount,
      created_after,
      created_before,
    }).filter(([_, v]) => v && v !== "");
    return entries.map(([key, value]) => ({
      key,
      label: formatFilterLabel(key, value),
    }));
  }, [
    txid,
    sender,
    receiverName,
    receiverDocument,
    status_bk,
    status_px,
    min_amount,
    max_amount,
    created_after,
    created_before,
  ]);

  const downloadCsv = useTransactionsCsv('/transactions/atm/csv', 'atm');
  const handleDownloadCsv = async () => {
    await downloadCsv({
      txid,
      sender,
      receiverName,
      receiverDocument,
      status_bk,
      status_px,
      min_amount,
      max_amount,
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
            onClick={() => {
              setPage(1);
              setValues({ [key]: undefined });
            }}
          >
            {label} ✕
          </Badge>
        ))}

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

      <Drawer open={open} onOpenChange={handleDrawerOpenChange} direction="right">
        <DrawerTrigger asChild>
          <Button className="w-12 h-10 mr-2" variant="outline">
            <Funnel size={16}  />
          </Button>
        </DrawerTrigger>

          <DrawerContent
            ref={drawerRef}
            className="p-4 data-[vaul-drawer-direction=right]:w-[500px] data-[vaul-drawer-direction=right]:max-w-[70vw]"
          >
          <DrawerHeader className="col-span-full">
            <DrawerTitle className="flex flex-row items-center gap-2">
              <ListFilter /> Filtros ATM
            </DrawerTitle>
          </DrawerHeader>

          <div className="grid grid-cols-2 gap-4 p-4">
            <div>
              <Label>TXID</Label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder="0x..."
                value={localTxid}
                onChange={(e) => setLocalTxid(e.target.value)}
              />
            </div>

            <div>
              <Label>Sender</Label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder="Remetente"
                value={localSender}
                onChange={(e) => setLocalSender(e.target.value)}
              />
            </div>

            <div>
              <Label>Receiver Name</Label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder="Nome do recebedor"
                value={localReceiverName}
                onChange={(e) => setLocalReceiverName(e.target.value)}
              />
            </div>

            <div>
              <Label>Receiver Document</Label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder="CPF/CNPJ"
                value={localReceiverDocument}
                onChange={(e) => setLocalReceiverDocument(e.target.value)}
              />
            </div>

            <div>
              <Label>Status Blockchain</Label>
              <Select
                value={localStatusBk || "ALL"}
                onValueChange={(v) => setLocalStatusBk(v === "ALL" ? "" : v)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  {blockchainStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status Interno</Label>
              <Select
                value={localStatusPx || "ALL"}
                onValueChange={(v) => setLocalStatusPx(v === "ALL" ? "" : v)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Status Interno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  {internalStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Valor mínimo</Label>
              <input
                type="number"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder="9.99"
                value={localMinAmount}
                onChange={(e) => setLocalMinAmount(e.target.value)}
              />
            </div>

            <div>
              <Label>Valor máximo</Label>
              <input
                type="number"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder="9.99"
                value={localMaxAmount}
                onChange={(e) => setLocalMaxAmount(e.target.value)}
              />
            </div>

            <div>
              <Label>Data início</Label>
              <Popover
                open={openAfterCalendar}
                onOpenChange={setOpenAfterCalendar}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-1 justify-start text-left font-normal"
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

            <div>
              <Label>Data fim</Label>
              <Popover
                open={openBeforeCalendar}
                onOpenChange={setOpenBeforeCalendar}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-1 justify-start text-left font-normal"
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
          </div>

          <DrawerFooter className="col-span-full">
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={clearFilters}>
                <X size={16} className="mr-1" /> Limpar
              </Button>
              <Button onClick={applyFilters}>Aplicar</Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  </div>
  );
}
