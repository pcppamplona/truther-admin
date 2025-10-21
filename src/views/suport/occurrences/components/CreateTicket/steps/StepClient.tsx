import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { DataTable } from "@/components/ui/data-table";
import { useClients } from "@/services/clients/useClients";
import { getPaginationSettings } from "@/lib/paginationStorage";
import { ColumnDef } from "@tanstack/react-table";
import { ClientsData } from "@/interfaces/ClientsData";
import { DataTableClient } from "@/components/client-list";
import { Checkbox } from "@/components/ui/checkbox";
import { documentFormat } from "@/lib/formatters";

interface StepClientProps {
  onChange: (field: any, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const clientColumns: ColumnDef<ClientsData>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <div>{row.getValue("name") ?? "—"}</div>,
  },
  {
    accessorKey: "document",
    header: "Documento",
    cell: ({ row }) => <div>{documentFormat(row.getValue("document")) ?? "—"}</div>, 
  },
];

export function StepClient({ onChange, onNext, onBack }: StepClientProps) {
  const { page: savedPage, limit: savedLimit } =
    getPaginationSettings("clients");

  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);
  const [search, setSearch] = useState("");
  const [noClient, setNoClient] = useState(false);

  const { data: clients } = useClients(
    page,
    limit,
    search,
    "created_at",
    "DESC"
  );

  const handleNoClient = (checked: boolean) => {
    setNoClient(checked);
    if (checked) {
      onChange("client_id", null);
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Checkbox
          id="noClient"
          checked={noClient}
          onCheckedChange={handleNoClient}
        />
        <label
          htmlFor="noClient"
          className="text-sm text-muted-foreground cursor-pointer select-none"
        >
          Ticket sem cliente identificado
        </label>
      </div>

      <DataTableClient
        columns={clientColumns}
        data={clients?.data ?? []}
        pagination={{
          page,
          pageSize: limit,
          total: clients?.total ?? 0,
          onPageChange: setPage,
          onPageSizeChange: setLimit,
        }}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Buscar cliente por nome, documento ou wallet",
        }}
        onRowClick={(client: ClientsData) => {
          onChange("client_id", client.id);
          onNext();
        }}
        selectedId={null}
      />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
      </div>
    </div>
  );
}
