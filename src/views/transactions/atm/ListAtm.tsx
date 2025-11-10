"use client";

import { useEffect, useState } from "react";
import { RenderPagination } from "@/components/RenderPagination";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getPaginationSettings,
  setPaginationSettings,
} from "@/lib/paginationStorage";

import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info } from "@/components/info";
import { getColorRGBA, poColors, txStatusColors } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonTableFull } from "@/components/skeletons/skeletonTableFull";
import { useAtmTransactions } from "@/services/transactions/useTransactions";
import { AtmFilters, AtmFiltersValues } from "../components/AtmFilters";

export default function ListAtm() {
  const { page: savedPage, limit: savedLimit } =
    getPaginationSettings("transactions-atm");

  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);

  const [filters, setFilters] = useState<AtmFiltersValues>({
    txid: "",
    sender: "",
    receiverName: "",
    receiverDocument: "",
    status_bk: "",
    status_px: "",
    created_after: undefined,
    created_before: undefined,
    min_amount: undefined,
    max_amount: undefined,
  });

  const { data, isLoading, refetch } = useAtmTransactions(page, limit, {
    txid: filters.txid,
    sender: filters.sender,
    receiverName: filters.receiverName,
    receiverDocument: filters.receiverDocument,
    status_bk: filters.status_bk,
    status_px: filters.status_px,
    created_after: filters.created_after,
    created_before: filters.created_before,
  });

  useEffect(() => {
    setPaginationSettings("transactions-atm", page, limit);
  }, [page, limit]);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const toggleExpand = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">
          Transações ATM
        </CardTitle>
        <CardDescription>
          A tela de Transações ATM lista todas as retiradas realizadas via
          terminais ATM, com informações detalhadas do envio, recebimento e
          status das operações tanto na blockchain quanto no processamento
          interno.
        </CardDescription>

        <AtmFilters
          {...filters}
          setValues={(next) => setFilters((prev) => ({ ...prev, ...next }))}
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
                        description="Não há transações ATM que correspondam aos filtros aplicados. Tente ajustar os filtros ou recarregar."
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
                  <TableHead>TXID</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Status Blockchain</TableHead>
                  <TableHead>Status Interno</TableHead>
                  <TableHead>Valor (BRL)</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data?.data.map((tx) => (
                  <>
                    <TableRow
                      key={tx.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleExpand(tx.id)}
                    >
                      <TableCell>{tx.id}</TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[200px]">
                        {tx.txid}
                      </TableCell>
                      <TableCell>{tx.sender}</TableCell>
                      <TableCell>{tx.receiverName}</TableCell>
                      <TableCell>
                        <div
                          className="px-3 py-2 rounded-lg text-xs font-semibold uppercase"
                          style={{
                            backgroundColor: getColorRGBA(
                              tx.status_bk,
                              poColors,
                              0.1
                            ),
                            color: getColorRGBA(tx.status_bk, poColors, 0.9),
                            width: "fit-content",
                          }}
                        >
                          {tx.status_bk}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="px-3 py-2 rounded-lg text-xs font-semibold uppercase"
                          style={{
                            backgroundColor: getColorRGBA(
                              tx.status_px,
                              txStatusColors,
                              0.1
                            ),
                            color: getColorRGBA(
                              tx.status_px,
                              txStatusColors,
                              0.9
                            ),
                            width: "fit-content",
                          }}
                        >
                          {tx.status_px}
                        </div>
                      </TableCell>
                      <TableCell>
                        {Number(tx.amount_brl).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell>{tx.createdAt}</TableCell>
                      <TableCell>
                        {expandedId === tx.id ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </TableCell>
                    </TableRow>

                    {expandedId === tx.id && (
                      <TableRow className="bg-muted/40">
                        <TableCell colSpan={9}>
                          <div className="grid grid-cols-2 gap-4 py-3 text-sm">
                            <Info
                              label="Refund TXID"
                              value={tx.refundTxid ?? "-"}
                            />
                            <Info
                              label="Block"
                              value={tx.block?.toString() ?? "-"}
                            />
                            <Info
                              label="Receiver Document"
                              value={tx.receiverDocument ?? "-"}
                            />
                            <Info
                              label="Valor Cripto"
                              value={tx.amount_crypto ?? "-"}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
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
