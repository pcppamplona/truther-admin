import { useState } from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
} from "../components/BilletCashoutFilters";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { CardEmpty } from "@/components/CardEmpty";
import { bcStatusBilletColors, getColorRGBA } from "@/lib/utils";
import { dateFormat, timeFormat } from "@/lib/formatters";
import { SkeletonTableFull } from "@/components/skeletons/skeletonTableFull";
import { EmptyState } from "@/components/EmptyState";

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

  const { data, isLoading, refetch } = useBilletCashoutTransactions(
    page,
    limit,
    {
      status: filters.status,
      receiverName: filters.receiverName,
      receiverDocument: filters.receiverDocument,
      min_amount: filters.min_amount ? Number(filters.min_amount) : undefined,
      max_amount: filters.max_amount ? Number(filters.max_amount) : undefined,
      banksId: filters.banksId ? Number(filters.banksId) : undefined,
      orderId: filters.orderId ? Number(filters.orderId) : undefined,
      created_after: filters.created_after,
      created_before: filters.created_before,
    }
  );
  

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">
          Transações Boleto (Cashout)
        </CardTitle>
        <CardDescription>
          A seção Transações Boleto (Cashout) exibe todas as operações de saque
          realizadas via boleto bancário. Permite acompanhar o fluxo completo da
          solicitação<br/> desde a criação até a liquidação — incluindo valores,
          status, datas e dados do beneficiário.
        </CardDescription>

        <BilletCashoutFilters
          {...filters}
          setValues={(next: Partial<BilletCashoutFiltersValues>) =>
            setFilters((prev: BilletCashoutFiltersValues) => ({
              ...prev,
              ...next,
            }))
          }
          setPage={setPage}
        />
      </CardHeader>

      <div className="flex-1 overflow-y-auto px-4 lg:px-6 mt-2">
        <div className="overflow-x-auto rounded-md border">
          {isLoading ? (
            <SkeletonTableFull rows={10} columns={9} />
          ) : data && data.data.length === 0 ? (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={9}>
                    <div className="flex justify-center items-center py-16">
                      <EmptyState
                        title="Nenhuma transação encontrada"
                        description="Não há transações bridge que correspondam aos filtros aplicados. Tente ajustar os filtros ou recarregar."
                        actions={
                          <button
                            onClick={() => refetch()}
                            className="mt-4 px-4 py-2 border rounded-md text-sm hover:bg-muted transition"
                          >
                            Recarregar
                          </button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
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
          )}
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 border-t border-border h-16">
        <RenderPagination
          page={page}
          setPage={setPage}
          total={Number(data?.total ?? 0)}
          limit={Number(data?.limit ?? limit)}
          setLimit={setLimit}
        />
      </div>
    </div>
  );
}
