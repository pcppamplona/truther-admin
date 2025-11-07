import { Fragment, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { RenderPagination } from "@/components/RenderPagination";
import {
  getPaginationSettings,
  setPaginationSettings,
} from "@/lib/paginationStorage";
import { usePixInTransactions } from "@/services/transactions/useTransactions";
import { Info } from "@/components/info";
import {
  PixInFilters,
  PixInFiltersValues,
} from "../components/PixInFilters.tsx";
import { useI18n } from "@/i18n";
import { getColorRGBA, poColors } from "@/lib/utils";

export default function ListPixIn() {
  const { t } = useI18n();
  const { page: savedPage, limit: savedLimit } = getPaginationSettings(
    "transactions-pix-in"
  );

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
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">
          {t("transactions.pixIn.title")}
        </CardTitle>
        
         <CardDescription>
          {t("transactions.pixIn.description")}
        </CardDescription>
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

      <div className="flex-1 overflow-y-auto px-4 lg:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t("transactions.pixIn.table.headers.txid")}</TableCell>
              <TableCell>{t("transactions.pixIn.table.headers.statusBank")}</TableCell>
              <TableCell>{t("transactions.pixIn.table.headers.statusBlockchain")}</TableCell>
              <TableCell>{t("transactions.pixIn.table.headers.wallet")}</TableCell>
              <TableCell>{t("transactions.pixIn.table.headers.name")}</TableCell>
              <TableCell>{t("transactions.pixIn.table.headers.payerName")}</TableCell>
              <TableCell>{t("transactions.pixIn.table.headers.createdAt")}</TableCell>
              <TableCell>{t("transactions.pixIn.table.headers.token")}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : data && data.data && data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-64">
                  <CardEmpty
                    title={t("transactions.common.emptyState.title")}
                    subtitle={t("transactions.common.emptyState.subtitle")}
                  />
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.map((tx) => (
                <Fragment key={tx.id}>
                  <TableRow
                    className="cursor-pointer hover:bg-input transition"
                    onClick={() => toggleExpand(tx.id)}
                  >
                    <TableCell>{tx.id}</TableCell>
                    <TableCell className="font-mono text-xs break-all"> {tx.txid}</TableCell>
                    <TableCell>{tx.status_bank ?? "-"}</TableCell>
                    <TableCell>
                      <div
                        className="px-3 py-2 rounded-lg text-xs font-semibold uppercase"
                        style={{
                          backgroundColor: getColorRGBA(
                            tx.status_blockchain ?? "",
                            poColors,
                            0.1
                          ),
                          color: getColorRGBA(
                            tx.status_blockchain ?? "",
                            poColors,
                            0.9
                          ),

                          width: "fit-content",
                        }}
                      >
                        {tx.status_blockchain}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs break-all">{tx.receive_wallet}</TableCell>
                    <TableCell>{tx.receive_name ?? "-"}</TableCell>
                    <TableCell>{tx.payer_name ?? "-"}</TableCell>
                    <TableCell>{tx.createdAt ?? "-"}</TableCell>
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
                            }[tx.token_symbol?.toUpperCase() ?? ""] ||
                            "/default.png"
                          }
                          alt={tx.token_symbol ?? "token"}
                          className="w-5 h-5 object-contain"
                        />
                        <span className="uppercase">
                          {tx.token_symbol ?? "-"}
                        </span>
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
                              <Info label={t("transactions.pixIn.details.walletId")} value={tx.wallet_id ?? "-"} />                              
                              <Info label={t("transactions.pixIn.details.recipientDocument")} value={tx.receive_doc ?? "-"} />                              
                              <Info label={t("transactions.pixIn.details.destinationKey")} value={tx.destinationKey ?? "-"} />                             
                              <Info label={t("transactions.pixIn.details.end2end")} value={tx.end2end ?? "-"} />                            
                              <Info label={t("transactions.pixIn.details.payerDocument")} value={tx.payer_document ?? "-"} />                           
                              <Info label={t("transactions.pixIn.details.amount")} value={tx.amount ?? "-"} />                            
                              <Info label={t("transactions.pixIn.details.errorBlockchain")} value={tx.msg_error_blockchain ?? "-"} />                           
                              <Info label={t("transactions.pixIn.details.errorBank")} value={tx.msg_error_bank ?? "-"} />                         
                              <Info label={t("transactions.pixIn.details.typeIn")} value={tx.typeIn ?? "-"} />                         
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

      <div className="flex justify-center items-center">
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
