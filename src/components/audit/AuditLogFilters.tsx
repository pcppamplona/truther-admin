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
import {useRef, useState} from "react";

type actionType = 'security' | 'listing' | 'alter' | 'crm';

interface AuditLogFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  descriptionSearch: string;
  setDescriptionSearch: (value: string) => void;
  selectedMethod: methodType | "";
  setSelectedMethod: (value: methodType | "") => void;
  selectedAction: actionType | "";
  setSelectedAction: (value: actionType | "") => void;
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
  createdBefore,
  setCreatedBefore,
  createdAfter,
  setCreatedAfter,
  setPage,
  methodColors,
}: AuditLogFiltersProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState("");
  const [drawerDescriptionSearch, setDrawerDescriptionSearch] = useState("");
  const [drawerSelectedMethod, setDrawerSelectedMethod] = useState<methodType | "">(selectedMethod);
  const [drawerSelectedAction, setDrawerSelectedAction] = useState<actionType | "">(selectedAction);
  const [drawerCreatedBefore, setDrawerCreatedBefore] = useState<Date | undefined>(
    createdBefore ? new Date(createdBefore) : undefined
  );
  const [drawerCreatedAfter, setDrawerCreatedAfter] = useState<Date | undefined>(
    createdAfter ? new Date(createdAfter) : undefined
  );
  const [openBeforeCalendar, setOpenBeforeCalendar] = useState(false);
  const [openAfterCalendar, setOpenAfterCalendar] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);

  const handleDrawerOpenChange = (open: boolean) => {
    if (open) {
      setDrawerSearch(search);
      setDrawerDescriptionSearch(descriptionSearch);
      setDrawerSelectedMethod(selectedMethod);
      setDrawerSelectedAction(selectedAction);
      setDrawerCreatedBefore(createdBefore ? new Date(createdBefore) : undefined);
      setDrawerCreatedAfter(createdAfter ? new Date(createdAfter) : undefined);
    }
    setIsDrawerOpen(open);
  };

  const handleClear = () => {
    setDrawerSearch("");
    setDrawerDescriptionSearch("");
    setDrawerSelectedMethod("");
    setDrawerSelectedAction("");
    setDrawerCreatedBefore(undefined);
    setDrawerCreatedAfter(undefined);
    setSearch("");
    setDescriptionSearch("");
    setSelectedMethod("");
    setSelectedAction("");
    setCreatedBefore(undefined);
    setCreatedAfter(undefined);
    setIsDrawerOpen(false);
  };

  const handleApply = () => {
    setSearch(drawerSearch);
    setDescriptionSearch(drawerDescriptionSearch);
    setSelectedMethod(drawerSelectedMethod);
    setSelectedAction(drawerSelectedAction);

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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
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

  return (
    <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange} direction="right">
      <DrawerTrigger asChild>
        <Button className="w-14 h-12 bg-blue-500">
          <Funnel size={18} color="#fff" />
        </Button>
      </DrawerTrigger>
      <DrawerContent ref={drawerRef} className="
          p-4
          data-[vaul-drawer-direction=right]:w-[700px]
          data-[vaul-drawer-direction=right]:max-w-[70vw]
          data-[vaul-drawer-direction=right]:sm:max-w-[70vw]
        ">
        <DrawerHeader>
          <DrawerTitle>Filtros</DrawerTitle>
          <DrawerDescription>
            Filtre os registros de auditoria
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-row gap-4">
            <div className="space-y-2 flex-1">
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
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <ScrollText size={18} />
                <strong>Descrição</strong>
              </div>
              <div className="flex items-center border border-border rounded-lg px-3 py-3 w-full">
                <Search size={16} className="mr-2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Pesquisar descrição"
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
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={18} />
                <strong>Ação</strong>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {drawerSelectedAction || "Selecione uma ação"}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem 
                    onClick={() => setDrawerSelectedAction("")}
                    className="cursor-pointer"
                  >
                    Todos
                  </DropdownMenuItem>
                  {["security", "listing", "alter", "crm"].map((action) => (
                    <DropdownMenuItem 
                      key={action}
                      onClick={() => setDrawerSelectedAction(action as actionType)}
                      className={`cursor-pointer ${drawerSelectedAction === action ? "bg-muted" : ""}`}
                    >
                      {action}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon size={18} />
              <strong>Data de criação</strong>
            </div>
            
            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-3 flex-1">
                <Label htmlFor="created_after" className="px-1">
                  Criado após
                </Label>
                <Popover open={openAfterCalendar} onOpenChange={setOpenAfterCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="created_after"
                      className="w-full justify-between font-normal"
                      type="button"
                      aria-label="Selecionar data - Criado depois de"
                    >
                      <span>
                        {drawerCreatedAfter ? formatDateToYYYYMMDD(drawerCreatedAfter) : "Selecione a data"}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        {drawerCreatedAfter && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label="Limpar data 'Criado depois de'"
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
                          Limpar
                        </Button>
                      )}
                      <Button size="sm" onClick={() => setOpenAfterCalendar(false)}>
                        OK
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <Label htmlFor="created_before" className="px-1">
                  Criado antes
                </Label>
                <Popover open={openBeforeCalendar} onOpenChange={setOpenBeforeCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="created_before"
                      className="w-full justify-between font-normal"
                      type="button"
                      aria-label="Selecionar data - Criado antes de"
                    >
                      <span>
                        {drawerCreatedBefore ? formatDateToYYYYMMDD(drawerCreatedBefore) : "Selecione a data"}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        {drawerCreatedBefore && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label="Limpar data 'Criado antes de'"
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
                          Limpar
                        </Button>
                      )}
                      <Button size="sm" onClick={() => setOpenBeforeCalendar(false)}>
                        OK
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
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