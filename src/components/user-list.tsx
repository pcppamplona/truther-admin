import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { getInitials } from "@/lib/formatters";

interface DataTableUsersProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  onRowClick?: (row: TData) => void;
  selectedId?: number | string | null;
}

export function DataTableUsers<TData, TValue>({
  columns,
  data,
  pagination,
  search,
  onRowClick,
  selectedId,
}: DataTableUsersProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: !!pagination,
    pageCount: pagination
      ? Math.ceil(pagination.total / pagination.pageSize)
      : undefined,
  });

  return (
    <div className="space-y-4">
      {search && (
        <Input
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
          placeholder={search.placeholder ?? "Buscar..."}
          className="w-full"
        />
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const isSelected =
              selectedId !== undefined &&
              (row.original as any)?.id === selectedId;

            return (
              <div
                key={row.id}
                className={`flex items-center rounded-lg p-2 cursor-pointer transition hover:bg-muted-foreground/10 ${
                  isSelected ? "bg-primary text-white" : ""
                }`}
                onClick={() => onRowClick?.(row.original)}
              >
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 ${
                    isSelected
                      ? "bg-white text-primary"
                      : "bg-primary text-white"
                  }`}
                >
                  {getInitials(String(row.getValue("name") ?? ""))}
                </div>

                <div className="flex flex-col overflow-hidden ml-4">
                  {row.getVisibleCells().map((cell, index) => {
                    if (index === 0) return null;
                    return (
                      <span
                        key={cell.id}
                        className={`truncate ${
                          index === 1
                            ? "font-medium text-sm"
                            : "text-xs text-muted-foreground"
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </span>
                    );
                  })}
                </div>

                <ChevronRight className="ml-auto size-4" />
              </div>
            );
          })
        ) : (
          <div className="h-24 flex items-center justify-center text-muted-foreground">
            Nenhum resultado encontrado.
          </div>
        )}
      </div>

      {pagination && (
        <div className="flex items-center justify-between pt-4">
          <span>
            {pagination.page} /{" "}
            {Math.ceil(pagination.total / pagination.pageSize)}
          </span>

          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              &lt;
            </Button>

            <Button
              variant="outline"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={
                pagination.page >=
                Math.ceil(pagination.total / pagination.pageSize)
              }
            >
              &gt;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
