import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransactionsFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  setPage: (v: number) => void;
}

export function TransactionsFilters({ search, setSearch, status, setStatus, setPage }: TransactionsFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center border border-border rounded-lg px-3 py-3 w-full max-w-lg">
        <Search size={16} className="mr-2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Pesquisar por txid, carteira ou documento"
          className="outline-none text-sm w-full bg-transparent"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={status || "ALL"}
          onValueChange={(value) => {
            setPage(1);
            setStatus(value === "ALL" ? "" : value);
          }}
        >
          <SelectTrigger aria-label="Status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="CONFIRMED">Confirmado</SelectItem>
            <SelectItem value="PENDING">Pendente</SelectItem>
            <SelectItem value="FAILED">Falhou</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
