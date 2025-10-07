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
import { ArrowDown01, ArrowUp01, Search, TriangleAlert } from "lucide-react";
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
import { TicketData } from "@/interfaces/TicketData";
import { getColorRGBA, statusColors } from "@/lib/utils";

export default function ListOcurrences() {
  const navigate = useNavigate();
  const { page: savedPage, limit: savedLimit } =
    getPaginationSettings("tickets");

  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    setPaginationSettings("tickets", page, limit);
  }, [page, limit]);

  const { data, isLoading } = useTickets(
    page,
    limit,
    search,
    sortBy,
    sortOrder
  );

  const handleRowClick = (ticket: TicketData) => {
    navigate("/ocurrenceDetails", { state: { ticketId: ticket.id } });
  };

  const [filter, setFilter] = useState("Todas");

  // const userId = user?.id;
  // const userGroupLevel = user?.groupLevel;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">
          Ocorrências - Tickets
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
            <div className="flex justify-self-end items-center space-x-4 my-2">
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas</SelectItem>
                  <SelectItem value="Meus Tickets">Meus Tickets</SelectItem>
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
              <TableHead>Data</TableHead>
              <TableHead>Expiração</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : data?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center text-center">
                    <TriangleAlert className="text-muted-foreground" />
                    <p className="text-lg font-semibold">
                      Nenhum ticket encontrado
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Não foi possível encontrar nenhum ticket. Tente ajustar a
                      <br />pesquisa ou criar um novo.
                    </p>
                  </div>
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
                      className="px-3 py-1 rounded-lg text-sm font-semibold lowercase"
                      style={{
                        backgroundColor: getColorRGBA(
                          ticket.status,
                          statusColors,
                          0.2
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
