import { Fragment, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
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
import { usePixOutTransactions } from "@/services/transactions/useTransactions";
import { Info } from "@/components/info";
import {
  formatFilterLabel,
  PixOutFilters,
  PixOutFiltersValues,
} from "../components/PixOutFilters";
import { getColorRGBA, poColors } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n";
import { CardEmpty } from "@/components/CardEmpty";

export default function ListPixOut() {
  const { t } = useI18n();
  const { page: savedPage, limit: savedLimit } = getPaginationSettings(
    "transactions-pix-out"
  );

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
        <CardTitle className="text-2xl font-bold mb-4">
          {t("transactions.pixOut.title")}
        </CardTitle>
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
          setValues={(next: Partial<PixOutFiltersValues>) => setFilters((prev: PixOutFiltersValues) => ({ ...prev, ...next }))}
          setPage={setPage}
        />

        {Object.values(filters).some((v) => v !== "" && v !== undefined) && (
          <div>
            <Label className="mb-2 block text-sm font-medium text-muted-foreground">
              {t("transactions.common.appliedFilters")} 
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
                  })
                }
              >
                {t("transactions.common.clearAll")}
              </Badge>
            </div>
          </div>
        )}
      </CardHeader>

      <div className="w-full px-4 lg:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>{t("transactions.pixOut.table.headers.txid")}</TableCell>
              <TableCell>{t("transactions.pixOut.table.headers.sender")}</TableCell>
              <TableCell>{t("transactions.pixOut.table.headers.senderName")}</TableCell>
              <TableCell>{t("transactions.pixOut.table.headers.receiverName")}</TableCell>
              <TableCell>{t("transactions.pixOut.table.headers.statusBank")}</TableCell>
              <TableCell>{t("transactions.pixOut.table.headers.statusBlockchain")}</TableCell>
              <TableCell>{t("transactions.pixOut.table.headers.createdAt")}</TableCell>
              <TableCell>{t("transactions.pixOut.table.headers.token")}</TableCell>
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
              data?.data?.map((tx, index) => (
                <Fragment key={`${tx.id}-${tx.txid}-${index}`}>
                  <TableRow
                    className="cursor-pointer hover:bg-input transition"
                    onClick={() => toggleExpand(tx.id)}
                  >
                    <TableCell className="font-mono text-xs break-all">
                      {tx.txid}
                    </TableCell>
                    <TableCell>{tx.status_px ?? "-"}</TableCell>
                    <TableCell>
                      <div
                        className="px-3 py-2 rounded-lg text-xs font-semibold uppercase"
                        style={{
                          backgroundColor: getColorRGBA(
                            tx.status_bk ?? "",
                            poColors,
                            0.1
                          ),
                          color: getColorRGBA(
                            tx.status_bk ?? "",
                            poColors,
                            0.9
                          ),

                          width: "fit-content",
                        }}
                      >
                        {tx.status_bk}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs break-all">
                      {tx.sender}
                    </TableCell>
                    <TableCell>{tx.sender_name ?? "-"}</TableCell>
                    <TableCell>{tx.receiver_name ?? "-"}</TableCell>

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
                        <TableCell colSpan={9} className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden p-4 text-sm"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Info label={t("transactions.pixOut.details.id")} value={tx.id} />
                              <Info label={t("transactions.pixOut.details.end2end")} value={tx.end2end ?? "-"} />
                              <Info label={t("transactions.pixOut.details.senderDocument")} value={tx.sender_document ?? "-"} />
                              <Info label={t("transactions.pixOut.details.amountBrl")} value={tx.amount_brl ?? "-"} />
                              <Info label={t("transactions.pixOut.details.dateOp")} value={tx.date_op ?? "-"} />
                              <Info label={t("transactions.pixOut.details.receiverDocument")} value={tx.receiver_document ?? "-"} />
                              <Info label={t("transactions.pixOut.details.pixKey")} value={tx.pixKey ?? "-"} />
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
