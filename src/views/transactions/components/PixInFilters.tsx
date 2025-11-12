import { useState, useRef, useMemo } from "react";
import { Calendar as CalendarIcon, Funnel, ListFilter, X } from "lucide-react";
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
} from "@/components/ui/drawer";
import { poStatusBlockchain } from "@/interfaces/Transactions";
import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";

export interface PixInFiltersValues {
  txid: string;
  status_bank: string;
  status_blockchain: string;
  payer_document: string;
  payer_name: string;
  created_after?: string;
  created_before?: string;
  min_amount: string;
  max_amount: string;
  wallet: string;
  end2end: string;
  destinationKey: string;
  typeIn: string;
}

interface PixInFiltersProps extends PixInFiltersValues {
  setValues: (next: Partial<PixInFiltersValues>) => void;
  setPage: (v: number) => void;
}

function formatDateParam(date?: Date): string | undefined {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatPixInFilterLabel(key: string, value: any): string {
  const labels: Record<string, string> = {
    txid: "TXID",
    status_bank: "Status BK",
    status_blockchain: "Status PX",
    payer_document: "Doc. Pagador",
    payer_name: "Nome Pagador",
    created_after: "Data início",
    created_before: "Data fim",
    min_amount: "Valor mínimo",
    max_amount: "Valor máximo",
    wallet: "Carteira",
    end2end: "End2End",
    destinationKey: "Chave Destino",
    typeIn: "Tipo",
  };

  return `${labels[key] ?? key}: ${value}`;
}

export function PixInFilters(props: PixInFiltersProps) {
  const { t } = useI18n();
  const {
    txid,
    status_bank,
    status_blockchain,
    payer_document,
    payer_name,
    created_after,
    created_before,
    min_amount,
    max_amount,
    wallet,
    end2end,
    destinationKey,
    typeIn,
    setValues,
    setPage,
  } = props;

  const [open, setOpen] = useState(false);
  const [localTxid, setLocalTxid] = useState(txid);
  const [localStatusBank, setLocalStatusBank] = useState(status_bank);
  const [localStatusBlockchain, setLocalStatusBlockchain] =
    useState(status_blockchain);
  const [localPayerDocument, setLocalPayerDocument] = useState(payer_document);
  const [localPayerName, setLocalPayerName] = useState(payer_name);
  const [localCreatedAfter, setLocalCreatedAfter] = useState<Date | undefined>(
    created_after ? new Date(created_after) : undefined
  );
  const [localCreatedBefore, setLocalCreatedBefore] = useState<
    Date | undefined
  >(created_before ? new Date(created_before) : undefined);
  const [localMinAmount, setLocalMinAmount] = useState(min_amount);
  const [localMaxAmount, setLocalMaxAmount] = useState(max_amount);
  const [localWallet, setLocalWallet] = useState(wallet);
  const [localEnd2end, setLocalEnd2end] = useState(end2end);
  const [localDestinationKey, setLocalDestinationKey] =
    useState(destinationKey);
  const [localTypeIn, setLocalTypeIn] = useState(typeIn);
  const [openBeforeCalendar, setOpenBeforeCalendar] = useState(false);
  const [openAfterCalendar, setOpenAfterCalendar] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const resetLocal = () => {
    setLocalTxid("");
    setLocalStatusBank("");
    setLocalStatusBlockchain("");
    setLocalPayerDocument("");
    setLocalPayerName("");
    setLocalCreatedAfter(undefined);
    setLocalCreatedBefore(undefined);
    setLocalMinAmount("");
    setLocalMaxAmount("");
    setLocalWallet("");
    setLocalEnd2end("");
    setLocalDestinationKey("");
    setLocalTypeIn("");
  };

  const apply = () => {
    setPage(1);
    setValues({
      txid: localTxid,
      status_bank: localStatusBank,
      status_blockchain: localStatusBlockchain,
      payer_document: localPayerDocument,
      payer_name: localPayerName,
      created_after: formatDateParam(localCreatedAfter),
      created_before: formatDateParam(localCreatedBefore),
      min_amount: localMinAmount,
      max_amount: localMaxAmount,
      wallet: localWallet,
      end2end: localEnd2end,
      destinationKey: localDestinationKey,
      typeIn: localTypeIn,
    });

    setOpen(false);
  };

  const clearAll = () => {
    setPage(1);
    setValues({
      txid: "",
      status_bank: "",
      status_blockchain: "",
      payer_document: "",
      payer_name: "",
      created_after: undefined,
      created_before: undefined,
      min_amount: "",
      max_amount: "",
      wallet: "",
      end2end: "",
      destinationKey: "",
      typeIn: "",
    });
    resetLocal();
    setOpen(false);
  };

  const syncWhenOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setLocalTxid(txid);
      setLocalStatusBank(status_bank);
      setLocalStatusBlockchain(status_blockchain);
      setLocalPayerDocument(payer_document);
      setLocalPayerName(payer_name);
      setLocalCreatedAfter(created_after ? new Date(created_after) : undefined);
      setLocalCreatedBefore(
        created_before ? new Date(created_before) : undefined
      );
      setLocalMinAmount(min_amount);
      setLocalMaxAmount(max_amount);
      setLocalWallet(wallet);
      setLocalEnd2end(end2end);
      setLocalDestinationKey(destinationKey);
      setLocalTypeIn(typeIn);
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
      status_bank,
      status_blockchain,
      payer_document,
      payer_name,
      created_after,
      created_before,
      min_amount,
      max_amount,
      wallet,
      end2end,
      destinationKey,
      typeIn,
    }).filter(([_, v]) => v);
    return entries.map(([key, value]) => ({
      key,
      label: formatPixInFilterLabel(key, value),
    }));
  }, [
    txid,
    status_bank,
    status_blockchain,
    payer_document,
    payer_name,
    created_after,
    created_before,
    min_amount,
    max_amount,
    wallet,
    end2end,
    destinationKey,
    typeIn,
  ]);

  return (
    <div className="w-full flex justify-between items-center mb-2">
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
              onClick={clearAll}
            >
              Limpar tudo
            </Badge>
          )}
        </div>
      </div>
      <Drawer open={open} onOpenChange={syncWhenOpen} direction="right">
        <Button className="w-12 h-10 mr-2" variant="outline"  onClick={() => setOpen(true)}>
          <Funnel size={16} color="#fff" />
        </Button>
        <DrawerContent
          ref={drawerRef}
          className="p-4 data-[vaul-drawer-direction=right]:w-[500px] data-[vaul-drawer-direction=right]:max-w-[70vw] data-[vaul-drawer-direction=right]:sm:max-w-[70vw]"
        >
          <div className="grid grid-cols-2 gap-4 p-4">
            <DrawerHeader className="col-span-full">
              <DrawerTitle className="flex flex-row items-center gap-2">
                <ListFilter />
                {t("transactions.pixIn.filters.title")}
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
                {t("transactions.common.walletLabel")}
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
              <Label htmlFor="payer_document">
                {t("transactions.common.payerDocumentLabel")}
              </Label>
              <input
                id="payer_document"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder={t("transactions.common.numbersOnlyPlaceholder")}
                value={localPayerDocument}
                onChange={(e) => setLocalPayerDocument(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <Label htmlFor="payer_name">
                {t("transactions.common.payerNameLabel")}
              </Label>
              <input
                id="payer_name"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder={t("transactions.common.containsPlaceholder")}
                value={localPayerName}
                onChange={(e) => setLocalPayerName(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <Label htmlFor="destinationKey">
                {t("transactions.common.destinationKeyLabel")}
              </Label>
              <input
                id="destinationKey"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-transparent"
                placeholder={t("transactions.common.pixKeyLabel")}
                value={localDestinationKey}
                onChange={(e) => setLocalDestinationKey(e.target.value)}
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
              <Label>{t("transactions.common.statusBankLabel")}</Label>
              <Select
                value={localStatusBank || "ALL"}
                onValueChange={(v) => setLocalStatusBank(v === "ALL" ? "" : v)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue
                    placeholder={t("transactions.common.statusBankLabel")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">
                    {t("transactions.common.allOption")}
                  </SelectItem>
                  <SelectItem value="NEW">NEW</SelectItem>
                  <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                  <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                  <SelectItem value="CANCEL">CANCEL</SelectItem>
                  <SelectItem value="DROP">DROP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-2">
              <Label>{t("transactions.common.statusBlockchainLabel")}</Label>
              <Select
                value={localStatusBlockchain || "ALL"}
                onValueChange={(v) =>
                  setLocalStatusBlockchain(v === "ALL" ? "" : v)
                }
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

            <div className="mt-2">
              <Label>{t("transactions.common.typeLabel")}</Label>
              <Select
                value={localTypeIn || "ALL"}
                onValueChange={(v) => setLocalTypeIn(v === "ALL" ? "" : v)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="PIXLINK">PIXLINK</SelectItem>
                  <SelectItem value="SMARTLINK">SMARTLINK</SelectItem>
                  <SelectItem value="INVOICE">INVOICE</SelectItem>
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
