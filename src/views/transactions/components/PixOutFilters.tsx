import { useState, useRef } from "react";
import { Funnel, Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export interface PixOutFiltersValues {
  txid: string;
  end2end: string;
  pixKey: string;
  receiverDocument: string;
  receiverName: string;
  wallet: string;
  status_px: string;
  status_bk: string;
  min_amount: string;
  max_amount: string;
  created_after?: string;
  created_before?: string;
}

interface PixOutFiltersProps extends PixOutFiltersValues {
  setValues: (next: Partial<PixOutFiltersValues>) => void;
  setPage: (v: number) => void;
}

function formatDateParam(date?: Date): string | undefined {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function PixOutFilters(props: PixOutFiltersProps) {
  const {
    txid,
    end2end,
    pixKey,
    receiverDocument,
    receiverName,
    wallet,
    status_px,
    status_bk,
    min_amount,
    max_amount,
    created_after,
    created_before,
    setValues,
    setPage,
  } = props;

  const [open, setOpen] = useState(false);
  const [localTxid, setLocalTxid] = useState(txid);
  const [localEnd2end, setLocalEnd2end] = useState(end2end);
  const [localPixKey, setLocalPixKey] = useState(pixKey);
  const [localReceiverDocument, setLocalReceiverDocument] = useState(receiverDocument);
  const [localReceiverName, setLocalReceiverName] = useState(receiverName);
  const [localWallet, setLocalWallet] = useState(wallet);
  const [localStatusPx, setLocalStatusPx] = useState(status_px);
  const [localStatusBk, setLocalStatusBk] = useState(status_bk);
  const [localMinAmount, setLocalMinAmount] = useState(min_amount);
  const [localMaxAmount, setLocalMaxAmount] = useState(max_amount);
  const [localCreatedAfter, setLocalCreatedAfter] = useState<Date | undefined>(created_after ? new Date(created_after) : undefined);
  const [localCreatedBefore, setLocalCreatedBefore] = useState<Date | undefined>(created_before ? new Date(created_before) : undefined);
  const [openBeforeCalendar, setOpenBeforeCalendar] = useState(false);
  const [openAfterCalendar, setOpenAfterCalendar] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const resetLocal = () => {
    setLocalTxid("");
    setLocalEnd2end("");
    setLocalPixKey("");
    setLocalReceiverDocument("");
    setLocalReceiverName("");
    setLocalWallet("");
    setLocalStatusPx("");
    setLocalStatusBk("");
    setLocalMinAmount("");
    setLocalMaxAmount("");
    setLocalCreatedAfter(undefined);
    setLocalCreatedBefore(undefined);
  };

  const apply = () => {
    setPage(1);
    setValues({
      txid: localTxid,
      end2end: localEnd2end,
      pixKey: localPixKey,
      receiverDocument: localReceiverDocument,
      receiverName: localReceiverName,
      wallet: localWallet,
      status_px: localStatusPx,
      status_bk: localStatusBk,
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
      txid: "",
      end2end: "",
      pixKey: "",
      receiverDocument: "",
      receiverName: "",
      wallet: "",
      status_px: "",
      status_bk: "",
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
      setLocalTxid(txid);
      setLocalEnd2end(end2end);
      setLocalPixKey(pixKey);
      setLocalReceiverDocument(receiverDocument);
      setLocalReceiverName(receiverName);
      setLocalWallet(wallet);
      setLocalStatusPx(status_px);
      setLocalStatusBk(status_bk);
      setLocalMinAmount(min_amount);
      setLocalMaxAmount(max_amount);
      setLocalCreatedAfter(created_after ? new Date(created_after) : undefined);
      setLocalCreatedBefore(created_before ? new Date(created_before) : undefined);
    }
  };

  return (
    <div className="w-full flex justify-end">
      <Drawer open={open} onOpenChange={syncWhenOpen} direction="right">
        <DrawerTrigger asChild>
          <Button variant="outline">
            <Funnel size={16} className="mr-2" /> Filtros
          </Button>
        </DrawerTrigger>
        <DrawerContent ref={drawerRef} className="p-4 data-[vaul-drawer-direction=right]:w-[700px] data-[vaul-drawer-direction=right]:max-w-[70vw] data-[vaul-drawer-direction=right]:sm:max-w-[70vw]">
          <div className="grid grid-cols-2 gap-4 p-4">
            <DrawerHeader className="col-span-full">
              <DrawerTitle>Filtros PIX OUT</DrawerTitle>
            </DrawerHeader>

            <div>
              <Label htmlFor="txid">TXID</Label>
              <input
                id="txid"
                className="mt-1 w-full border rounded px-3 py-2 bg-transparent font-mono text-xs"
                placeholder="0x..."
                value={localTxid}
                onChange={(e) => setLocalTxid(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="wallet">Wallet do remetente</Label>
              <input
                id="wallet"
                className="mt-1 w-full border rounded px-3 py-2 bg-transparent font-mono text-xs"
                placeholder="0x..."
                value={localWallet}
                onChange={(e) => setLocalWallet(e.target.value)}
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
              <Label htmlFor="receiverDocument">Documento do beneficiário</Label>
              <input
                id="receiverDocument"
                className="mt-1 w-full border rounded px-3 py-2 bg-transparent"
                placeholder="Somente números"
                value={localReceiverDocument}
                onChange={(e) => setLocalReceiverDocument(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="pixKey">Chave PIX</Label>
              <input
                id="pixKey"
                className="mt-1 w-full border rounded px-3 py-2 bg-transparent"
                placeholder="Chave PIX"
                value={localPixKey}
                onChange={(e) => setLocalPixKey(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="end2end">EndToEnd</Label>
              <input
                id="end2end"
                className="mt-1 w-full border rounded px-3 py-2 bg-transparent font-mono text-xs"
                placeholder="E2E..."
                value={localEnd2end}
                onChange={(e) => setLocalEnd2end(e.target.value)}
              />
            </div>

            <div>
              <Label>Status Blockchain</Label>
              <Select value={localStatusBk || "ALL"} onValueChange={(v) => setLocalStatusBk(v === "ALL" ? "" : v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Status Blockchain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Status Blockchain</SelectItem>
                  <SelectItem value="NEW">NEW</SelectItem>
                  <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                  <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                  <SelectItem value="CANCEL">CANCEL</SelectItem>
                  <SelectItem value="DROP">DROP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status Bank</Label>
              <Select value={localStatusPx || "ALL"} onValueChange={(v) => setLocalStatusPx(v === "ALL" ? "" : v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Status Bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Status Bank</SelectItem>
                  <SelectItem value="NEW">NEW</SelectItem>
                  <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                  <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                  <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                  <SelectItem value="CANCEL">CANCEL</SelectItem>
                  <SelectItem value="DROP">DROP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="min_amount">Valor mínimo (ex: 9.99)</Label>
              <input
                id="min_amount"
                className="mt-1 w-full border rounded px-3 py-2 bg-transparent"
                placeholder="9.99"
                value={localMinAmount}
                onChange={(e) => setLocalMinAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="max_amount">Valor máximo (ex: 9.99)</Label>
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
              <Popover open={openAfterCalendar} onOpenChange={setOpenAfterCalendar}>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={"justify-start text-left font-normal mt-1"}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localCreatedAfter ? localCreatedAfter.toLocaleDateString() : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent container={drawerRef.current} className="w-auto p-0" align="start">
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
              <Popover open={openBeforeCalendar} onOpenChange={setOpenBeforeCalendar}>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={"justify-start text-left font-normal mt-1"}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localCreatedBefore ? localCreatedBefore.toLocaleDateString() : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent container={drawerRef.current} className="w-auto p-0" align="start">
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
