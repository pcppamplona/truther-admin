import { useEffect, useState } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { RenderPagination } from "@/components/RenderPagination";
import { getPaginationSettings, setPaginationSettings } from "@/lib/paginationStorage";
import { usePixOutTransactions, PixOutQueryFilters } from "@/services/transactions/useTransactions";
import { PixOutFilters, PixOutFiltersValues } from "./components/PixOutFilters";

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
              <TableCell>ID</TableCell>
              <TableCell>TXID</TableCell>
              <TableCell>Remetente</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Status BK</TableCell>
              <TableCell>Status PX</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : (
              data?.data?.map((tx, index) => (
                <TableRow key={`${tx.id}-${tx.txid}-${index}`}>
                  <TableCell>{tx.id}</TableCell>
                  <TableCell className="font-mono text-xs break-all">{tx.txid}</TableCell>
                  <TableCell className="font-mono text-xs break-all">{tx.sender}</TableCell>
                  <TableCell>{tx.sender_name ?? "n/a"}</TableCell>
                  <TableCell>{tx.sender_document ?? "n/a"}</TableCell>
                  <TableCell>{tx.status_bk ?? "n/a"}</TableCell>
                  <TableCell>{tx.status_px ?? "n/a"}</TableCell>
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
    </>
  );
}
