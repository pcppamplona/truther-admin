import { Fragment, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { RenderPagination } from "@/components/RenderPagination";
import { getPaginationSettings, setPaginationSettings } from "@/lib/paginationStorage";
import { usePixOutTransactions } from "@/services/transactions/useTransactions";
import { Info } from "@/components/info";
import { PixOutFilters, PixOutFiltersValues } from "../components/PixOutFilters";

export default function ListPixOut() {
  const { page: savedPage, limit: savedLimit } = getPaginationSettings("transactions-pix-out");

  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);
  const [filters, setFilters] = useState<PixOutFiltersValues>({
    txid: "",
    end2end: "",
    pixKey: "",
    receiverDocument: "",
    receiverName: "",
    wallet: "",
    status_px: "",
    status_bk: "",
    min_amount: "",
    max_amount: "",
    created_after: undefined,
    created_before: undefined,
  });

  useEffect(() => {
    setPaginationSettings("transactions-pix-out", page, limit);
  }, [page, limit]);

  const { data, isLoading } = usePixOutTransactions(page, limit, {
    txid: filters.txid,
    end2end: filters.end2end,
    pixKey: filters.pixKey,
    receiverDocument: filters.receiverDocument,
    receiverName: filters.receiverName,
    wallet: filters.wallet,
    status_px: filters.status_px,
    status_bk: filters.status_bk,
    min_amount: filters.min_amount,
    max_amount: filters.max_amount,
    created_after: filters.created_after,
    created_before: filters.created_before,
  });

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">Transações PIX OUT</CardTitle>
        <PixOutFilters
          txid={filters.txid}
          end2end={filters.end2end}
          pixKey={filters.pixKey}
          receiverDocument={filters.receiverDocument}
          receiverName={filters.receiverName}
          wallet={filters.wallet}
          status_px={filters.status_px}
          status_bk={filters.status_bk}
          min_amount={filters.min_amount}
          max_amount={filters.max_amount}
          created_after={filters.created_after}
          created_before={filters.created_before}
          setValues={(next) => setFilters((prev) => ({ ...prev, ...next }))}
          setPage={setPage}
        />
      </CardHeader>

      <div className="w-full px-4 lg:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>TXID</TableCell>
              <TableCell>Remetente</TableCell>
              <TableCell>Nome Remetente</TableCell>
              <TableCell>Nome Recebedor</TableCell>
              <TableCell>Status Bank</TableCell>
              <TableCell>Status Blockchain</TableCell>
              <TableCell>Criado Em</TableCell>
              <TableCell>Token</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : (
              data?.data?.map((tx, index) => (
                <Fragment key={`${tx.id}-${tx.txid}-${index}`}>
                  <TableRow
                    className="cursor-pointer hover:bg-input transition"
                    onClick={() => toggleExpand(tx.id)}
                  >
                    <TableCell className="font-mono text-xs break-all">{tx.txid}</TableCell>
                    <TableCell className="font-mono text-xs break-all">{tx.sender}</TableCell>
                    <TableCell>{tx.sender_name ?? "n/a"}</TableCell>
                    <TableCell>{tx.receiver_name ?? "n/a"}</TableCell>
                    <TableCell>{tx.status_px ?? "n/a"}</TableCell>
                    <TableCell>{tx.status_bk ?? "n/a"}</TableCell>
                    <TableCell>{tx.createdAt ?? "n/a"}</TableCell>
                    <TableCell>{tx.token_symbol ?? "n/a"}</TableCell>
                    <TableCell>
                      {expandedId === tx.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </TableCell>
                  </TableRow>

                  <AnimatePresence>
                    {expandedId === tx.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={9} className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden p-4 text-sm"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>ID</strong>} value={tx.id} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>End To End</strong>} value={tx.end2end ?? "-"} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>Documento Remetente</strong>} value={tx.sender_document ?? "-"} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>Valor (BRL)</strong>} value={tx.amount_brl ?? "-"} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>Data da Operação</strong>} value={tx.date_op ?? "-"} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>Documento Recebedor</strong>} value={tx.receiver_document ?? "-"} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>Chave Pix</strong>} value={tx.pixKey ?? "-"} />
                              </div>
                            </div>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </Fragment>
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
    </>
  );
}
