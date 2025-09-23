import { useState } from "react";
import {
  ChevronDown,
  FileText,
  Funnel,
  MessageSquareText,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  setPage: (value: number) => void;
  methodColors: Record<methodType, string>;
}

export function AuditLogFilters({
  search,
  setSearch,
  selectedMethod,
  setSelectedMethod,
  setPage,
  methodColors,
}: AuditLogFiltersProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState("");

  // Initialize drawerSearch with the current search value when the drawer opens
  const handleDrawerOpenChange = (open: boolean) => {
    if (open) {
      setDrawerSearch(search);
    }
    setIsDrawerOpen(open);
  };

  const handleClear = () => {
    setDrawerSearch("");
    setSearch("");
    setSelectedMethod("");
    setIsDrawerOpen(false);
  };

  const handleApply = () => {
    setSearch(drawerSearch);
    // selectedMethod is already set when the dropdown item is clicked
    setPage(1);
    setIsDrawerOpen(false);
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange} direction="right">
      <DrawerTrigger asChild>
        <Button className="w-14 h-12 bg-blue-500">
          <Funnel size={18} color="#fff" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
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
                  {selectedMethod || "Selecione um método"}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem 
                  onClick={() => setSelectedMethod("")}
                  className="cursor-pointer"
                >
                  Todos
                </DropdownMenuItem>
                {["POST", "DELETE", "GET", "PUT", "PATCH"].map((method) => (
                  <DropdownMenuItem 
                    key={method}
                    onClick={() => setSelectedMethod(method as methodType)}
                    className={`cursor-pointer ${selectedMethod === method ? "bg-muted" : ""}`}
                  >
                    <span className={methodColors[method as methodType]}>
                      {method}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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