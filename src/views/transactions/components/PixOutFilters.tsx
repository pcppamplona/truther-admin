import { useState, useRef, useMemo } from "react";
import { useI18n } from "@/i18n";
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
import { poStatusBlockchain } from "@/interfaces/Transactions";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/services/api";

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

export function formatFilterLabel(key: string, value: any): string {
  const labels: Record<string, string> = {
    txid: "TXID",
    end2end: "End2End",
    pixKey: "Chave Pix",
    receiverDocument: "Doc. Recebedor",
    receiverName: "Nome Recebedor",
    wallet: "Carteira",
    status_px: "Status PX",
    status_bk: "Status BK",
    min_amount: "Valor mínimo",
    max_amount: "Valor máximo",
    created_after: "Data início",
    created_before: "Data fim",
  };

  return `${labels[key] ?? key}: ${value}`;
}

export function PixOutFilters(props: PixOutFiltersProps) {
  const { t } = useI18n();
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
  const [localReceiverDocument, setLocalReceiverDocument] =
    useState(receiverDocument);
  const [localReceiverName, setLocalReceiverName] = useState(receiverName);
  const [localWallet, setLocalWallet] = useState(wallet);
  const [localStatusPx, setLocalStatusPx] = useState(status_px);
  const [localStatusBk, setLocalStatusBk] = useState(status_bk);
  const [localMinAmount, setLocalMinAmount] = useState(min_amount);
  const [localMaxAmount, setLocalMaxAmount] = useState(max_amount);
  const [localCreatedAfter, setLocalCreatedAfter] = useState<Date | undefined>(
    created_after ? new Date(created_after) : undefined
  );
  const [localCreatedBefore, setLocalCreatedBefore] = useState<
    Date | undefined
  >(created_before ? new Date(created_before) : undefined);
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
      setLocalCreatedBefore(
        created_before ? new Date(created_before) : undefined
      );
    }
  };

  const status: poStatusBlockchain[] = [
    "CONFIRMED",
    "DROP",
    "CANCEL",
    "REFUNDED",
    "NEW",
    "PROCESSING",
  ];

  const activeFilters = useMemo(() => {
    const entries = Object.entries({
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
    }).filter(([_, v]) => v && v !== "");
    return entries.map(([key, value]) => ({
      key,
      label: formatFilterLabel(key, value),
    }));
  }, [
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
  ]);

  const handleDownloadCsv = async () => {
    try {
      const params = new URLSearchParams();
      if (txid) params.append("txid", txid);
      if (end2end) params.append("end2end", end2end);
      if (pixKey) params.append("pixKey", pixKey);
      if (receiverDocument) params.append("receiverDocument", receiverDocument);
      if (receiverName) params.append("receiverName", receiverName);
      if (wallet) params.append("wallet", wallet);
      if (status_px) params.append("status_px", status_px);
      if (status_bk) params.append("status_bk", status_bk);
      if (min_amount) params.append("min_amount", min_amount);
      if (max_amount) params.append("max_amount", max_amount);

      const response = await api.get(`/transactions/pix-out/csv?${params.toString()}`,
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const filename = `pix-out-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.csv`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to download CSV pix-out:", e);
    }
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
              onClick={clearAll}
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

        <Drawer open={open} onOpenChange={syncWhenOpen} direction="right">
          <DrawerTrigger asChild>
            <Button className="w-12 h-10 mr-2" variant="outline">
              <Funnel size={16} color="#fff" />
            </Button>
          </DrawerTrigger>
          <DrawerContent
            ref={drawerRef}
            className="p-4 data-[vaul-drawer-direction=right]:w-[500px] data-[vaul-drawer-direction=right]:max-w-[70vw] data-[vaul-drawer-direction=right]:sm:max-w-[70vw]"
          >
          <div className="grid grid-cols-2 gap-4 p-4">
            <DrawerHeader className="col-span-full">
              <DrawerTitle className="flex flex-row items-center gap-2">
                <ListFilter />
                {t("transactions.pixOut.filters.title")}
              </DrawerTitle>
            </DrawerHeader>

            <div className="mt-2">
              <Label htmlFor="txid">TXID</Label>
              <input
                id="txid"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder="0x..."
                value={localTxid}
                onChange={(e) => setLocalTxid(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <Label htmlFor="wallet">
                {t("transactions.common.senderWalletLabel")}
              </Label>
              <input
                id="wallet"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder="0x..."
                value={localWallet}
                onChange={(e) => setLocalWallet(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <Label htmlFor="receiverName">
                {t("transactions.common.receiverNameLabel")}
              </Label>
              <input
                id="receiverName"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder={t("transactions.common.containsPlaceholder")}
                value={localReceiverName}
                onChange={(e) => setLocalReceiverName(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <Label htmlFor="receiverDocument">
                {t("transactions.common.receiverDocumentLabel")}
              </Label>
              <input
                id="receiverDocument"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder={t("transactions.common.numbersOnlyPlaceholder")}
                value={localReceiverDocument}
                onChange={(e) => setLocalReceiverDocument(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <Label htmlFor="pixKey">
                {t("transactions.common.pixKeyLabel")}
              </Label>
              <input
                id="pixKey"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder={t("transactions.common.pixKeyLabel")}
                value={localPixKey}
                onChange={(e) => setLocalPixKey(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <Label htmlFor="end2end">
                {t("transactions.common.endToEndLabel")}
              </Label>
              <input
                id="end2end"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder="E2E..."
                value={localEnd2end}
                onChange={(e) => setLocalEnd2end(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <Label>{t("transactions.common.statusBlockchainLabel")}</Label>
              <Select
                value={localStatusBk || "ALL"}
                onValueChange={(v) => setLocalStatusBk(v === "ALL" ? "" : v)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  {status.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-2">
              <Label>{t("transactions.common.statusBankLabel")}</Label>
              <Select
                value={localStatusPx || "ALL"}
                onValueChange={(v) => setLocalStatusPx(v === "ALL" ? "" : v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue
                    placeholder={t("transactions.common.statusBankLabel")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">
                    {t("transactions.common.allOption")}
                  </SelectItem>
                  <SelectItem value="NEW">NEW</SelectItem>
                  <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                  <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                  <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                  <SelectItem value="CANCEL">CANCEL</SelectItem>
                  <SelectItem value="DROP">DROP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-2">
              <Label htmlFor="min_amount">
                {t("transactions.common.minAmount")}
              </Label>
              <input
                id="min_amount"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder="9.99"
                value={localMinAmount}
                onChange={(e) => setLocalMinAmount(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <Label htmlFor="max_amount">
                {t("transactions.common.maxAmount")}
              </Label>
              <input
                id="max_amount"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder="9.99"
                value={localMaxAmount}
                onChange={(e) => setLocalMaxAmount(e.target.value)}
              />
            </div>

            <div className="flex flex-col mt-2">
              <Label>{t("transactions.common.dateStart")}</Label>
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
                      : t("common.actions.selectDate")}
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

            <div className="flex flex-col mt-2">
              <Label>{t("transactions.common.dateEnd")}</Label>
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
                      : t("common.actions.selectDate")}
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
                  <X size={16} className="mr-1" /> {t("common.actions.clear")}
                </Button>
                <Button onClick={apply}>{t("common.actions.apply")}</Button>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  </div>
  );
}
