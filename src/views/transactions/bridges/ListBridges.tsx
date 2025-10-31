import { RenderPagination } from "@/components/RenderPagination";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getPaginationSettings,
  setPaginationSettings,
} from "@/lib/paginationStorage";
import { useEffect, useState } from "react";
import {
  BridgeFilters,
  BridgeFiltersValues,
} from "../components/BridgesFilters";
import { useBridgeTransactions } from "@/services/transactions/useTransactions";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { CardEmpty } from "@/components/CardEmpty";
import { Info } from "@/components/info";
import { dateFormat, timeFormat } from "@/lib/formatters";
import { getColorRGBA, txStatusColors } from "@/lib/utils";

export default function ListBridges() {
  const { page: savedPage, limit: savedLimit } = getPaginationSettings(
    "transactions-bridges"
  );

  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);

  const [filters, setFilters] = useState<BridgeFiltersValues>({
    user_id: "",
    wallet_id: "",
    status: "",
    created_after: undefined,
    created_before: undefined,
  });

  const { data, isLoading } = useBridgeTransactions(page, limit, {
    user_id: filters.user_id ? Number(filters.user_id) : undefined,
    wallet_id: filters.wallet_id ? Number(filters.wallet_id) : undefined,
    status: filters.status,
    created_after: filters.created_after,
    created_before: filters.created_before,
  });

  useEffect(() => {
    setPaginationSettings("transactions-bridges", page, limit);
  }, [page, limit]);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">
          Transações Bridge
        </CardTitle>

        <BridgeFilters
          {...filters}
          setValues={(next) => setFilters((prev) => ({ ...prev, ...next }))}
          setPage={setPage}
        />

        {Object.values(filters).some((v) => v !== "" && v !== undefined) && (
          <div>
            <Label className="mb-2 block text-sm font-medium text-muted-foreground">
              Filtros aplicados:
            </Label>

            <div className="flex flex-wrap gap-2">
              {Object.entries(filters)
                .filter(([_, value]) => value !== "" && value !== undefined)
                .map(([key, value]) => (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1"
                  >
                    <span>
                      {key}:{" "}
                      {String(value).length > 20
                        ? `${String(value).slice(0, 20)}...`
                        : String(value)}
                    </span>
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
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ID Usuário</TableHead>
                <TableHead>ID Wallet</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead></TableHead>
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
                      subtitle="Tente ajustar os filtros ou criar uma nova."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((tx) => (
                  <>
                    <TableRow
                      key={tx.id}
                      className="cursor-pointer hover:bg-input transition"
                      onClick={() => toggleExpand(tx.id)}
                    >
                      <TableCell>{tx.id}</TableCell>
                      <TableCell>
                        <div
                          className="px-3 py-2 rounded-lg text-xs font-semibold uppercase"
                          style={{
                            backgroundColor: getColorRGBA(
                              tx.status,
                              txStatusColors,
                              0.1
                            ),
                            color: getColorRGBA(tx.status, txStatusColors, 0.9),
                            width: "fit-content",
                          }}
                        >
                          {tx.status}
                        </div>
                      </TableCell>

                      <TableCell>{tx.user_id}</TableCell>
                      <TableCell>{tx.wallet_id}</TableCell>
                      <TableCell>
                        {tx.value.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              {
                                USDT: "/usdt.png",
                                BTC: "/bitcoin.png",
                                ETH: "/eth.png",
                                BRL: "/brl.png",
                                VRL: "/vrl.png",
                              }[tx.symbol?.toUpperCase() ?? ""] ||
                              "/default.png"
                            }
                            alt={tx.symbol ?? "token"}
                            className="w-5 h-5 object-contain"
                          />
                          <span className="uppercase">{tx.symbol ?? "-"}</span>
                        </div>
                      </TableCell>

                      <TableCell>{dateFormat(tx.created_at)}</TableCell>
                      <TableCell>{timeFormat(tx.created_at)}</TableCell>
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
                            <Info label="From" value={tx.from_address ?? "-"} />
                            <Info label="To" value={tx.to_address ?? "-"} />
                            <Info label="TX Hash" value={tx.tx_hash ?? "-"} />
                            <Info label="Flow" value={tx.flow ?? "-"} />
                            <Info label="Type" value={tx.type ?? "-"} />
                            <Info
                              label="Retries"
                              value={tx.retry_count?.toString() ?? "-"}
                            />
                            <Info
                              label="Protocol Dest."
                              value={tx.protocol_destination ?? "-"}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
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
