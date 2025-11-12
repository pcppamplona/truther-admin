import { useState, useMemo, useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Funnel, ListFilter, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export interface UserTransactionsFiltersValues {
  status?: string;
  hash?: string;
  value?: number;
  created_after?: string;
  created_before?: string;
}

interface UserTransactionsFiltersProps extends UserTransactionsFiltersValues {
  setValues: (next: Partial<UserTransactionsFiltersValues>) => void;
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
    hash: "Hash",
    value: "Valor",
    created_after: "Data início",
    created_before: "Data fim",
  };

  if (key.startsWith("created_") && value)
    value = new Date(value).toLocaleDateString("pt-BR");

  return `${map[key] ?? key}: ${value}`;
}

export function UserTransactionsFilters(props: UserTransactionsFiltersProps) {
  const {
    status,
    hash,
    value,
    created_after,
    created_before,
    setValues,
    setPage,
  } = props;

  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // estados locais (controle interno)
  const [localStatus, setLocalStatus] = useState(status ?? "");
  const [localHash, setLocalHash] = useState(hash ?? "");
  const [localValue, setLocalValue] = useState<number | undefined>(value);
  const [localCreatedAfter, setLocalCreatedAfter] = useState<Date | undefined>(
    created_after ? new Date(created_after) : undefined
  );
  const [localCreatedBefore, setLocalCreatedBefore] = useState<
    Date | undefined
  >(created_before ? new Date(created_before) : undefined);

  const [openBeforeCalendar, setOpenBeforeCalendar] = useState(false);
  const [openAfterCalendar, setOpenAfterCalendar] = useState(false);

  const resetLocal = () => {
    setLocalStatus("");
    setLocalHash("");
    setLocalValue(undefined);
    setLocalCreatedAfter(undefined);
    setLocalCreatedBefore(undefined);
  };

  const apply = () => {
    setPage(1);
    setValues({
      status: localStatus,
      hash: localHash,
      value: localValue,
      created_after: formatDateParam(localCreatedAfter),
      created_before: formatDateParam(localCreatedBefore),
    });
    setOpen(false);
  };

  const clearAll = () => {
    setPage(1);
    setValues({
      status: "",
      hash: "",
      value: undefined,
      created_after: undefined,
      created_before: undefined,
    });
    resetLocal();
    setOpen(false);
  };

  const syncWhenOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setLocalStatus(status ?? "");
      setLocalHash(hash ?? "");
      setLocalValue(value);
      setLocalCreatedAfter(created_after ? new Date(created_after) : undefined);
      setLocalCreatedBefore(
        created_before ? new Date(created_before) : undefined
      );
    }
  };

  const statuses = [
    "SUCCESS",
    "FAILED",
    "PENDING",
    "PROCESSING",
    "CANCELED",
    "REFUNDED",
  ];

  const activeFilters = useMemo(() => {
    const entries = Object.entries({
      status,
      hash,
      value,
      created_after,
      created_before,
    }).filter(([_, v]) => v);
    return entries.map(([key, value]) => ({
      key,
      label: formatFilterLabel(key, value),
    }));
  }, [status, hash, value, created_after, created_before]);

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
              onClick={clearAll}
            >
              Limpar tudo
            </Badge>
          )}
        </div>
      </div>

      <Drawer open={open} onOpenChange={syncWhenOpen} direction="right">
        <DrawerTrigger asChild>
          <Button className="w-12 h-10 mr-2" variant="outline">
            <Funnel size={16} color="#fff" />
          </Button>
        </DrawerTrigger>

        <DrawerContent
          ref={drawerRef}
          className="p-4 data-[vaul-drawer-direction=right]:w-[600px] data-[vaul-drawer-direction=right]:max-w-[70vw]"
        >
          <div className="grid grid-cols-2 gap-4 p-4">
            <DrawerHeader className="col-span-full">
              <DrawerTitle className="flex flex-row items-center gap-2">
                <ListFilter /> Filtros - Transações de Usuário
              </DrawerTitle>
            </DrawerHeader>

            {/* STATUS */}
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

            {/* HASH */}
            <div className="mt-4">
              <Label htmlFor="hash">Hash</Label>
              <Input
                id="hash"
                className="mt-1"
                placeholder="Ex: 0x123abc..."
                value={localHash}
                onChange={(e) => setLocalHash(e.target.value)}
              />
            </div>

            {/* VALOR */}
            <div className="mt-4">
              <Label htmlFor="value">Valor mínimo</Label>
              <Input
                id="value"
                type="number"
                min={0}
                className="mt-1"
                placeholder="Ex: 100"
                value={localValue ?? ""}
                onChange={(e) =>
                  setLocalValue(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            </div>

            {/* DATA INÍCIO */}
            <div className="flex flex-col mt-4">
              <Label>Data início</Label>
              <Popover
                open={openAfterCalendar}
                onOpenChange={setOpenAfterCalendar}
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
                      setOpenAfterCalendar(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* DATA FIM */}
            <div className="flex flex-col mt-4">
              <Label>Data fim</Label>
              <Popover
                open={openBeforeCalendar}
                onOpenChange={setOpenBeforeCalendar}
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
                      setOpenBeforeCalendar(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* FOOTER */}
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
