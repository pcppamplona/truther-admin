import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowDown01, ArrowUp01, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTickets } from "@/services/Tickets/useTickets";
import { useNavigate } from "react-router-dom";
import { dateFormat, timeFormat } from "@/lib/formatters";
import { CreateTicket } from "./components/CreateTicket/CreateTicket";
import {
  getPaginationSettings,
  setPaginationSettings,
} from "@/lib/paginationStorage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { RenderPagination } from "@/components/RenderPagination";
import { RoleId, Status, TicketData } from "@/interfaces/TicketData";
import { getColorRGBA, statusColors } from "@/lib/utils";
import { ForbiddenCard } from "@/components/ForbiddenCard";
import { CardEmpty } from "@/components/CardEmpty";
import { useI18n } from "@/i18n";
import { Label } from "@/components/ui/label";

export default function ListOcurrences() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { page: savedPage, limit: savedLimit } =
    getPaginationSettings("tickets");

  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [filter, setFilter] = useState("Todas");
  const [assignedGroup, setAssignedGroup] = useState<number | undefined>();
  const [status, setStatus] = useState<string | undefined>();

  const onlyAssigned = filter === "Meus Tickets";

  useEffect(() => {
    setPaginationSettings("tickets", page, limit);
  }, [page, limit]);

  const { data, isLoading, isError, error } = useTickets(
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    onlyAssigned,
    assignedGroup,
    status 
  );

  const handleRowClick = (ticket: TicketData) => {
    navigate("/ocurrenceDetails", { state: { ticketId: ticket.id } });
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">
          Ocorrências - Tickets
          {t("transactions.pixIn.title")}
        </CardTitle>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center border border-border rounded-lg px-3 py-3 w-full max-w-lg">
            <Search size={16} className="mr-2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar tickets"
              className="outline-none text-sm w-full"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <div>
              <Label className="text-xs">Status</Label>
              <Select
                value={status ?? "ALL"}
                onValueChange={(val) => setStatus(val === "ALL" ? undefined : (val as Status))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDENTE">PENDENTE</SelectItem>
                  <SelectItem value="PENDENTE EXPIRADO">PENDENTE EXPIRADO</SelectItem>
                  <SelectItem value="EM ANDAMENTO">EM ANDAMENTO</SelectItem>
                  <SelectItem value="EM ANDAMENTO EXPIRADO">EM ANDAMENTO EXPIRADO</SelectItem>
                  <SelectItem value="FINALIZADO">FINALIZADO</SelectItem>
                  <SelectItem value="FINALIZADO EXPIRADO">FINALIZADO EXPIRADO</SelectItem>
                  <SelectItem value="AGUARDANDO RESPOSTA DO CLIENTE">
                    AGUARDANDO RESPOSTA DO CLIENTE
                  </SelectItem>
                  <SelectItem value="ALL">Todos</SelectItem>
                </SelectContent>
              </Select>

            </div>

            <div>
              <Label className="text-xs">Assigned</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas</SelectItem>
                  <SelectItem value="Meus Tickets">Meus Tickets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Grupo</Label>
              <Select
                value={assignedGroup?.toString() ?? ""}
                onValueChange={(val) =>
                  setAssignedGroup(val ? Number(val) : undefined)
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Grupo" />
                </SelectTrigger>
                <SelectContent>
                  {RoleId.map((g) => (
                    <SelectItem key={g.id} value={g.id.toString()}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                  <p>Ordenar Tickets</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <CreateTicket />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Criar novo Ticket</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      {!isError && (
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
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Expiração</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <SkeletonTable />
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64">
                    <CardEmpty
                      title="Nenhum ticket encontrado"
                      subtitle="Não foi possível encontrar nenhum ticket. Tente ajustar a pesquisa ou criar um novo."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    onClick={() => handleRowClick(ticket)}
                  >
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.reason.reason}</TableCell>
                    <TableCell>
                      <div
                        className="px-3 py-2 rounded-lg text-xs font-semibold uppercase"
                        style={{
                          backgroundColor: getColorRGBA(
                            ticket.status,
                            statusColors,
                            0.1
                          ),
                          color: getColorRGBA(ticket.status, statusColors, 0.9),
                          width: "fit-content",
                        }}
                      >
                        {ticket.status}
                      </div>
                    </TableCell>

                    <TableCell>
                      {ticket.assigned_user?.name ?? "Não atribuído"}
                    </TableCell>

                    <TableCell>
                      {RoleId.find((role) => role.id === ticket.assigned_role)
                        ?.name ?? "Não atribuído"}
                    </TableCell>

                    <TableCell>
                      {dateFormat(ticket.created_at)} às{" "}
                      {timeFormat(ticket.created_at)}
                    </TableCell>

                    <TableCell>{ticket.reason.expired_at}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {!isError && (
        <div className="flex justify-center mt-4">
          <RenderPagination
            page={page}
            setPage={setPage}
            total={Number(data?.total)}
            limit={Number(data?.limit)}
            setLimit={setLimit}
          />
        </div>
      )}

      {isError && error?.code === "PERMISSION_DENIED" && (
        <ForbiddenCard permission={error.requiredPermission} />
      )}
    </>
  );
}
