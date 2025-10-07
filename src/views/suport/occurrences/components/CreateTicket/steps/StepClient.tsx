import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { DataTable } from "@/components/ui/data-table";
import { useClients } from "@/services/clients/useClients";
import { getPaginationSettings } from "@/lib/paginationStorage";
import { ColumnDef } from "@tanstack/react-table";
import { ClientsData } from "@/interfaces/ClientsData";
import { DataTableClient } from "@/components/client-list";

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
];

export function StepClient({ onChange, onNext, onBack }: StepClientProps) {
  const { page: savedPage, limit: savedLimit } =
    getPaginationSettings("clients");

  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);
  const [search, setSearch] = useState("");

  const { data: clients } = useClients(
    page,
    limit,
    search,
    "created_at",
    "DESC"
  );

  return (
    <div className="space-y-4">
      {/* <DataTable
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
          placeholder: "Buscar cliente...",
        }}
        onRowClick={(client: ClientsData) => {
          onChange("client_id", client.id);
          onNext();
        }}
      /> */}
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
          placeholder: "Buscar cliente...",
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
