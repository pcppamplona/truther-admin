import { useEffect, useState } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { RenderPagination } from "@/components/RenderPagination";
import { getPaginationSettings, setPaginationSettings } from "@/lib/paginationStorage";
import { usePixInTransactions, PixInQueryFilters } from "@/services/transactions/useTransactions";
import { PixInFilters, PixInFiltersValues } from "./components/PixInFilters";

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
              <TableCell>ID</TableCell>
              <TableCell>TXID</TableCell>
              <TableCell>Wallet</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Status Blockchain</TableCell>
              <TableCell>Status Banco</TableCell>
              <TableCell>Tipo</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : (
              data?.data?.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.id}</TableCell>
                  <TableCell className="font-mono text-xs break-all">{tx.txid}</TableCell>
                  <TableCell className="font-mono text-xs break-all">{tx.receive_wallet}</TableCell>
                  <TableCell>{tx.receive_name ?? "n/a"}</TableCell>
                  <TableCell>{tx.receive_doc ?? "n/a"}</TableCell>
                  <TableCell>{tx.status_blockchain ?? "n/a"}</TableCell>
                  <TableCell>{tx.status_bank ?? "n/a"}</TableCell>
                  <TableCell>{tx.typeIn ?? "n/a"}</TableCell>
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
