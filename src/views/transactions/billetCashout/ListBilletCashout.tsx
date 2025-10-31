import { useState } from "react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPaginationSettings } from "@/lib/paginationStorage";
import { useBilletCashoutTransactions } from "@/services/transactions/useTransactions";
import { RenderPagination } from "@/components/RenderPagination";
import {
  BilletCashoutFilters,
  BilletCashoutFiltersValues,
  formatFilterLabel,
} from "../components/BilletCashoutFilters";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { CardEmpty } from "@/components/CardEmpty";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { bcStatusBilletColors, getColorRGBA } from "@/lib/utils";
import { dateFormat, timeFormat } from "@/lib/formatters";

export default function ListBilletCashout() {
  const { page: savedPage, limit: savedLimit } = getPaginationSettings(
    "transactions-billet-cashout"
  );

  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);
  const [filters, setFilters] = useState<BilletCashoutFiltersValues>({
    status: "",
    receiverName: "",
    receiverDocument: "",
    min_amount: "",
    max_amount: "",
    banksId: "",
    orderId: "",
    created_after: undefined,
    created_before: undefined,
  });

  const { data, isLoading } = useBilletCashoutTransactions(page, limit, {
    status: filters.status,
    receiverName: filters.receiverName,
    receiverDocument: filters.receiverDocument,
    min_amount: filters.min_amount ? Number(filters.min_amount) : undefined,
    max_amount: filters.max_amount ? Number(filters.max_amount) : undefined,
    banksId: filters.banksId ? Number(filters.banksId) : undefined,
    orderId: filters.orderId ? Number(filters.orderId) : undefined,
    created_after: filters.created_after,
    created_before: filters.created_before,
  });

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">
          Transações Boleto (Cashout)
        </CardTitle>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex-1">
              <BilletCashoutFilters
                {...filters}
                setValues={(next: Partial<BilletCashoutFiltersValues>) =>
                  setFilters((prev: BilletCashoutFiltersValues) => ({ ...prev, ...next }))
                }
                setPage={setPage}
              />

              {Object.values(filters).some(
                (v) => v !== "" && v !== undefined
              ) && (
                <div>
                  <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                    Filtros aplicados:
                  </Label>

                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters)
                      .filter(
                        ([_, value]) => value !== "" && value !== undefined
                      )
                      .map(([key, value]) => (
                        <Badge
                          key={key}
                          variant="secondary"
                          className="flex items-center gap-2 px-3 py-1"
                        >
                          <span>{formatFilterLabel(key, value)}</span>
                          <button
                            onClick={() =>
                              setFilters((prev) => ({ ...prev, [key]: "" }))
                            }
                            className="hover:text-destructive focus:outline-none"
                          >
                            <X size={14} />
                          </button>
                        </Badge>
                      ))}

                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() =>
                        setFilters({
                          status: "",
                          receiverName: "",
                          receiverDocument: "",
                          min_amount: "",
                          max_amount: "",
                          banksId: "",
                          orderId: "",
                          created_after: undefined,
                          created_before: undefined,
                        })
                      }
                    >
                      Limpar tudo
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nome do Recebedor</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <SkeletonTable />
              ) : data && data.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-64">
                    <CardEmpty
                      title="Nenhuma transação encontrada"
                      subtitle="Não foi possível encontrar nenhuma transação. Tente ajustar os filtros ou criar uma nova."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.id}</TableCell>
                    <TableCell>
                      <div
                        className="px-3 py-2 rounded-lg text-xs font-semibold uppercase"
                        style={{
                          backgroundColor: getColorRGBA(
                            tx.status,
                            bcStatusBilletColors,
                            0.1
                          ),
                          color: getColorRGBA(
                            tx.status,
                            bcStatusBilletColors,
                            0.9
                          ),
                          width: "fit-content",
                        }}
                      >
                        {tx.status}
                      </div>
                    </TableCell>
                    <TableCell>{tx.receiverName ?? "-"}</TableCell>
                    <TableCell>{tx.receiverDocument ?? "-"}</TableCell>
                    <TableCell>
                      {tx.amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                    <TableCell>{tx.banksId ?? "-"}</TableCell>
                    <TableCell>{tx.orderId ?? "-"}</TableCell>

                    <TableCell>{dateFormat(tx.createdAt)}</TableCell>
                    <TableCell>{timeFormat(tx.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center mt-4">
          <RenderPagination
            page={page}
            setPage={setPage}
            total={Number(data?.total ?? 0)}
            limit={Number(data?.limit ?? limit)}
            setLimit={setLimit}
          />
        </div>
      </CardContent>
    </>
  );
}
