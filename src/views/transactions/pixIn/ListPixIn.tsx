import { Fragment, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { RenderPagination } from "@/components/RenderPagination";
import { getPaginationSettings, setPaginationSettings } from "@/lib/paginationStorage";
import { usePixInTransactions } from "@/services/transactions/useTransactions";
import { Info } from "@/components/info";
import { PixInFilters, PixInFiltersValues } from "../components/PixInFilters";

export default function ListPixIn() {
  const { page: savedPage, limit: savedLimit } = getPaginationSettings("transactions-pix-in");

  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);
  const [filters, setFilters] = useState<PixInFiltersValues>({
    txid: "",
    status_bank: "",
    status_blockchain: "",
    payer_document: "",
    payer_name: "",
    created_after: undefined,
    created_before: undefined,
    min_amount: "",
    max_amount: "",
    wallet: "",
    end2end: "",
    destinationKey: "",
    typeIn: "",
  });

  useEffect(() => {
    setPaginationSettings("transactions-pix-in", page, limit);
  }, [page, limit]);

  const { data, isLoading } = usePixInTransactions(page, limit, {
    txid: filters.txid,
    status_bank: filters.status_bank,
    status_blockchain: filters.status_blockchain,
    payer_document: filters.payer_document,
    payer_name: filters.payer_name,
    created_after: filters.created_after,
    created_before: filters.created_before,
    min_amount: filters.min_amount,
    max_amount: filters.max_amount,
    wallet: filters.wallet,
    end2end: filters.end2end,
    destinationKey: filters.destinationKey,
    typeIn: filters.typeIn,
  });

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">Transações PIX IN</CardTitle>
        <PixInFilters
          txid={filters.txid}
          status_bank={filters.status_bank}
          status_blockchain={filters.status_blockchain}
          payer_document={filters.payer_document}
          payer_name={filters.payer_name}
          created_after={filters.created_after}
          created_before={filters.created_before}
          min_amount={filters.min_amount}
          max_amount={filters.max_amount}
          wallet={filters.wallet}
          end2end={filters.end2end}
          destinationKey={filters.destinationKey}
          typeIn={filters.typeIn}
          setValues={(next) => setFilters((prev) => ({ ...prev, ...next }))}
          setPage={setPage}
        />
      </CardHeader>

      <div className="w-full px-4 lg:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>TXID</TableCell>
              <TableCell>Wallet</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Nome Pagador</TableCell>
              <TableCell>Status Banco</TableCell>
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
              data?.data?.map((tx) => (
                <Fragment key={tx.id}>
                  <TableRow
                    className="cursor-pointer hover:bg-input transition"
                    onClick={() => toggleExpand(tx.id)}
                  >
                    <TableCell className="font-mono text-xs break-all">{tx.txid}</TableCell>
                    <TableCell className="font-mono text-xs break-all">{tx.receive_wallet}</TableCell>
                    <TableCell>{tx.receive_name ?? "n/a"}</TableCell>
                    <TableCell>{tx.payer_name ?? "n/a"}</TableCell>
                    <TableCell>{tx.status_bank ?? "n/a"}</TableCell>
                    <TableCell>{tx.status_blockchain ?? "n/a"}</TableCell>
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
                                <Info label={<strong>Wallet ID</strong>} value={tx.wallet_id ?? "-"} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>Documento Destinatário</strong>} value={tx.receive_doc ?? "-"} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>Chave de Destino</strong>} value={tx.destinationKey ?? "-"} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>End To End</strong>} value={tx.end2end ?? "-"} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>Documento Pagador</strong>} value={tx.payer_document ?? "-"} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>Valor</strong>} value={tx.amount ?? "-"} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>Erro Blockchain</strong>} value={tx.msg_error_blockchain ?? "-"} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>Erro Banco</strong>} value={tx.msg_error_bank ?? "-"} />
                              </div>
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info label={<strong>Tipo de Entrada</strong>} value={tx.typeIn ?? "-"} />
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
