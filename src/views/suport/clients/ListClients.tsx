import { useClients } from "@/services/clients/useClients"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowDown01,
  ArrowUp01,
  Download,
  FolderOpen,
  Search,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { ClientsData } from "@/interfaces/ClientsData"
import { RenderPagination } from "@/components/RenderPagination"
import {
  getPaginationSettings,
  setPaginationSettings,
} from "@/lib/paginationStorage"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { dateFormat, documentFormat, timeFormat } from "@/lib/formatters"
import { SkeletonTableFull } from "@/components/skeletons/skeletonTableFull"
import { EmptyState } from "@/components/EmptyState"

export default function ListClients() {
  const navigate = useNavigate()
  const { page: savedPage, limit: savedLimit } = getPaginationSettings("clients")

  const [page, setPage] = useState(savedPage)
  const [limit, setLimit] = useState(savedLimit)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC")

  useEffect(() => {
    setPaginationSettings("clients", page, limit)
  }, [page, limit])

  const { data: clients, isLoading, refetch } = useClients(
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  )

  const handleRowClick = (client: ClientsData) => {
    navigate("/clientDetails", { state: { clientId: client.id, clientDocument: client.document } })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">
          Todos os Clientes
        </CardTitle>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center border border-border rounded-lg px-3 py-3 w-full max-w-lg">
            <Search size={16} className="mr-2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar clientes Ex: Documento, Wallets ou Nome"
              className="outline-none text-sm w-full bg-transparent"
              value={search}
              onChange={(e) => {
                setPage(1)
                setSearch(e.target.value)
              }}
            />
          </div>

          <div className="flex items-center gap-2 mr-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-12 h-10"
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
                  <Button className="w-12 h-10">
                    <Download size={18} color="#fff" />
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

     
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 mt-2">
        {isLoading ? (
          <SkeletonTableFull rows={8} columns={6} />
        ) : clients?.data.length === 0 ? (
          <EmptyState
            title="Nenhum cliente encontrado"
            description="Não foi encontrado nenhum registro de cliente. Tente novamente!"
            icon={<FolderOpen className="w-10 h-10 text-muted-foreground" />}
            actions={
              <Button variant="outline" onClick={() => refetch()}>
                Recarregar
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  onClick={() => {
                    setSortBy("id")
                    setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  onClick={() => {
                    setSortBy("name")
                    setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")
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
              {clients?.data?.map((client) => (
                <TableRow
                  key={client.id}
                  onClick={() => handleRowClick(client)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.name ?? "n/a"}</TableCell>
                  <TableCell>{documentFormat(client.document)}</TableCell>
                  <TableCell>{client.role}</TableCell>
                  <TableCell>
                    {dateFormat(client.created_at)} às{" "}
                    {timeFormat(client.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          client.kyc_approved
                            ? "bg-primary"
                            : "bg-destructive"
                        }`}
                      />
                      <span className="font-medium">
                        {client.kyc_approved ? "Sim" : "Não"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex justify-center items-center">
        <RenderPagination
          page={page}
          setPage={setPage}
          total={Number(clients?.total)}
          limit={Number(clients?.limit)}
          setLimit={setLimit}
        />
      </div>
    </div>
  )
}
