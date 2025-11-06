import { useState } from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown, MoveDown, MoveUp } from "lucide-react";
import { getPaginationSettings } from "@/lib/paginationStorage";
import { useUserTransactions } from "@/services/transactions/useUserTransactions";
import { dateFormat, timeFormat } from "@/lib/formatters";
import { getColorRGBA, txStatusColors } from "@/lib/utils";
import { RenderPagination } from "@/components/RenderPagination";
import { SkeletonTableFull } from "@/components/skeletons/skeletonTableFull";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "@/components/info";

interface UserTransactionsProps {
  document: string;
}

export function UserTransactionsView({ document }: UserTransactionsProps) {
  const { page: savedPage, limit: savedLimit } =
    getPaginationSettings("user-transactions");

  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  const { data, isLoading, isError } = useUserTransactions(
    document,
    page,
    limit,
    search,
    sortBy,
    sortOrder
  );

  const transactions = data?.data ?? [];

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-2">
          Histórico de Transações
        </CardTitle>

        <CardDescription>
          Lista completa de todas as transações realizadas pelo cliente.
          <br />
          Aqui você pode acompanhar os detalhes de cada movimentação, incluindo
          status, tipo e moeda.
        </CardDescription>
      </CardHeader>

      <div className="w-full px-4 lg:px-6">
        {isLoading ? (
          <SkeletonTableFull rows={6} columns={8} />
        ) : isError ? (
          <p>Erro ao carregar transações.</p>
        ) : transactions.length === 0 ? (
          <p>Nenhuma transação encontrada.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Flow</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Origem</TableCell>
                  <TableCell>Destino</TableCell>
                  <TableCell>Moeda</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions.map((tx) => (
                  <>
                    <TableRow
                      key={tx.id}
                      className="cursor-pointer hover:bg-input transition"
                      onClick={() => toggleExpand(tx.id)}
                    >
                      <TableCell>{tx.id}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        {tx.flow === "IN" ? (
                            <MoveDown className="text-green-500" />
                        ) : (
                            <MoveUp />
                        )}
                        {tx.flow}
                      </TableCell>
                      <TableCell>{dateFormat(tx.created_at)}</TableCell>
                      <TableCell>{timeFormat(tx.created_at)}</TableCell>
                      <TableCell>
                        <div
                          className="px-3 py-2 rounded-lg text-xs font-semibold uppercase text-center w-full"
                          style={{
                            backgroundColor: getColorRGBA(
                              tx.status ?? "",
                              txStatusColors,
                              0.1
                            ),
                            color: getColorRGBA(
                              tx.status ?? "",
                              txStatusColors,
                              0.9
                            ),
                            width: "fit-content",
                          }}
                        >
                          {tx.status}
                        </div>
                      </TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell>{tx.from_address}</TableCell>
                      <TableCell>{tx.to_address}</TableCell>
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
                      <TableCell>
                        {expandedId === tx.id ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </TableCell>
                    </TableRow>

                    <AnimatePresence>
                      {expandedId === tx.id && (
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={10} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden p-4 text-sm"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Info label="UUID" value={tx.uuid} />
                                <Info label="Token ID" value={tx.token_id} />
                                <Info label="User ID" value={tx.user_id} />
                                <Info label="Valor" value={tx.value} />
                                <Info label="Taxa" value={tx.fee_value} />
                                <Info label="Hash da Transação" value={tx.tx_hash} />
                                <Info label="Atualizado em" value={dateFormat(tx.updated_at)} />
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-center mt-4">
              <RenderPagination
                page={page}
                setPage={setPage}
                total={Number(data?.total)}
                limit={Number(data?.limit)}
                setLimit={setLimit}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
