import * as React from "react";
import {
  ChevronDown,
  FileText,
  Funnel,
  MessageSquareText,
  Search,
  Calendar as CalendarIcon,
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

interface AuditLogFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedMethod: methodType | "";
  setSelectedMethod: (value: methodType | "") => void;
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
  selectedMethod,
  setSelectedMethod,
  createdBefore,
  setCreatedBefore,
  createdAfter,
  setCreatedAfter,
  setPage,
  methodColors,
}: AuditLogFiltersProps) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [drawerSearch, setDrawerSearch] = React.useState("");
  const [drawerSelectedMethod, setDrawerSelectedMethod] = React.useState<methodType | "">(selectedMethod);
  const [drawerCreatedBefore, setDrawerCreatedBefore] = React.useState<Date | undefined>(
    createdBefore ? new Date(createdBefore) : undefined
  );
  const [drawerCreatedAfter, setDrawerCreatedAfter] = React.useState<Date | undefined>(
    createdAfter ? new Date(createdAfter) : undefined
  );
  const [openBeforeCalendar, setOpenBeforeCalendar] = React.useState(false);
  const [openAfterCalendar, setOpenAfterCalendar] = React.useState(false);

  const drawerRef = React.useRef<HTMLDivElement>(null);

  const handleDrawerOpenChange = (open: boolean) => {
    if (open) {
      setDrawerSearch(search);
      setDrawerSelectedMethod(selectedMethod);
      setDrawerCreatedBefore(createdBefore ? new Date(createdBefore) : undefined);
      setDrawerCreatedAfter(createdAfter ? new Date(createdAfter) : undefined);
    }
    setIsDrawerOpen(open);
  };

  const handleClear = () => {
    setDrawerSearch("");
    setDrawerSelectedMethod("");
    setDrawerCreatedBefore(undefined);
    setDrawerCreatedAfter(undefined);
    setSearch("");
    setSelectedMethod("");
    setCreatedBefore(undefined);
    setCreatedAfter(undefined);
    setIsDrawerOpen(false);
  };

  const handleApply = () => {
    setSearch(drawerSearch);
    setSelectedMethod(drawerSelectedMethod);
    
    // Format dates to YYYY-MM-DD
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

  // Helper function to format date to YYYY-MM-DD
  const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange} direction="right">
      <DrawerTrigger asChild>
        <Button className="w-14 h-12 bg-blue-500">
          <Funnel size={18} color="#fff" />
        </Button>
      </DrawerTrigger>
      <DrawerContent ref={drawerRef} className="p-4">
        <DrawerHeader>
          <DrawerTitle>Filtros</DrawerTitle>
          <DrawerDescription>
            Filtre os registros de auditoria
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquareText size={18} />
              <strong>Mensagem</strong>
            </div>
            <div className="flex items-center border border-border rounded-lg px-3 py-3 w-full">
              <Search size={16} className="mr-2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pesquisar mensagem"
                className="outline-none text-sm w-full"
                value={drawerSearch}
                onChange={(e) => setDrawerSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <FileText size={18} />
              <strong>Método Http</strong>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {drawerSelectedMethod || "Selecione um método"}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem 
                  onClick={() => setDrawerSelectedMethod("")}
                  className="cursor-pointer"
                >
                  Todos
                </DropdownMenuItem>
                {["POST", "DELETE", "GET", "PUT", "PATCH"].map((method) => (
                  <DropdownMenuItem 
                    key={method}
                    onClick={() => setDrawerSelectedMethod(method as methodType)}
                    className={`cursor-pointer ${drawerSelectedMethod === method ? "bg-muted" : ""}`}
                  >
                    <span className={methodColors[method as methodType]}>
                      {method}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon size={18} />
              <strong>Data de criação</strong>
            </div>
            
            <div className="flex flex-col gap-3">
              <Label htmlFor="created_after" className="px-1">
                Criado após
              </Label>
              <Popover open={openAfterCalendar} onOpenChange={setOpenAfterCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="created_after"
                    className="w-full justify-between font-normal"
                  >
                    {drawerCreatedAfter ? formatDateToYYYYMMDD(drawerCreatedAfter) : "Selecione a data"}
                    <ChevronDown size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  container={drawerRef.current}
                  className="w-auto overflow-hidden p-0" 
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={drawerCreatedAfter}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setDrawerCreatedAfter(date);
                      setOpenAfterCalendar(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <Label htmlFor="created_before" className="px-1">
                Criado antes
              </Label>
              <Popover open={openBeforeCalendar} onOpenChange={setOpenBeforeCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="created_before"
                    className="w-full justify-between font-normal"
                  >
                    {drawerCreatedBefore ? formatDateToYYYYMMDD(drawerCreatedBefore) : "Selecione a data"}
                    <ChevronDown size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  container={drawerRef.current}
                  className="w-auto overflow-hidden p-0" 
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={drawerCreatedBefore}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setDrawerCreatedBefore(date);
                      setOpenBeforeCalendar(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <DrawerFooter className="flex flex-row justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleClear}
          >
            Limpar
          </Button>
          <Button 
            onClick={handleApply}
          >
            Aplicar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}