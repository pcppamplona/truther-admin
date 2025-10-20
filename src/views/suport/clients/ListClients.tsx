import { useClients } from "@/services/clients/useClients";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown01,
  ArrowUp01,
  Download,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClientsData } from "@/interfaces/ClientsData";
import { RenderPagination } from "@/components/RenderPagination";
import {
  getPaginationSettings,
  setPaginationSettings,
} from "@/lib/paginationStorage";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { dateFormat, documentFormat, timeFormat } from "@/lib/formatters";

export default function ListClients() {
  const navigate = useNavigate();
  const { page: savedPage, limit: savedLimit } =
    getPaginationSettings("clients");

  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    setPaginationSettings("clients", page, limit);
  }, [page, limit]);

  const { data, isLoading } = useClients(
    page,
    limit,
    search,
    sortBy,
    sortOrder
  );

  const handleRowClick = (client: ClientsData) => {
    navigate("/clientDetails", { state: { clientId: client.id } });
  };
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">
          Todos os Clientes
        </CardTitle>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center border border-border rounded-lg px-3 py-3 w-full max-w-lg">
            <Search size={16} className="mr-2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar clientes Ex: Documento, nome..."
              className="outline-none text-sm w-full"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-14 h-12"
                    onClick={() =>
                      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")
                    }
                  >
                    {sortOrder === "ASC" ? (
                      <ArrowUp01 size={18} />
                    ) : (
                      <ArrowDown01 size={18} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ordenar clientes</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="w-14 h-12">
                    <Download size={18} color="#fff"/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Baixar lista em CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <div className="w-full px-4 lg:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell
                onClick={() => {
                  setSortBy("id");
                  setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
                }}
              >
                ID
              </TableCell>
              <TableCell
                onClick={() => {
                  setSortBy("name");
                  setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
                }}
              >
                Nome
              </TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Data Criação</TableCell>
              <TableCell>KYC</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : (
              data?.data?.map((client) => (
                <TableRow
                  key={client.id}
                  onClick={() => handleRowClick(client)}
                >
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.name ?? "n/a"}</TableCell>
                  <TableCell>{documentFormat(client.document)}</TableCell>
                  <TableCell>{client.role}</TableCell>
                  <TableCell>{dateFormat(client.created_at)} ás {timeFormat(client.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          client.kyc_approved ? "bg-primary" : "bg-destructive"
                        }`}
                      />
                      <span className="font-medium">
                        {client.kyc_approved ? "Sim" : "Não"}
                      </span>
                    </div>
                  </TableCell>
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
          total={Number(data?.total)}
          limit={Number(data?.limit)}
          setLimit={setLimit}
        />
      </div>
    </>
  );
}
