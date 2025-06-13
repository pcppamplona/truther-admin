import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Search } from "lucide-react";
import { useState } from "react";
import { useTickets } from "@/services/Tickets/useTickets";
import {
  groupHierarchy,
  GroupSuport,
  TicketData,
} from "@/interfaces/ocurrences-data";
import { useNavigate } from "react-router-dom";
import { dateFormat, timeFormat } from "@/lib/formatters";
import { CreateOcurrence } from "./components/CreateOcurrence";
import { useAuth } from "@/store/auth";
import { getColorRGBA, statusColors } from "./components/utilsOcurrences";

export default function ListOcurrences() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;
  const userGroupLevel = user?.groupLevel;

  const { data: Tickets } = useTickets();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Todas");

  const accessibleGroups = userGroupLevel
    ? (Object.keys(groupHierarchy) as GroupSuport[]).filter(
        (group) => groupHierarchy[group] <= groupHierarchy[userGroupLevel]
      )
    : [];
    
  const filteredTickets = Tickets?.filter((ticket) => {
    const matchesSearch = (ticket.reason ?? "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const isGroupAccessible = accessibleGroups.includes(ticket.groupSuport);

    const matchesFilter = (() => {
      if (filter === "Minhas Ocorrências") {
        return ticket.assignedTo?.id === userId;
      }

      if (filter in groupHierarchy) {
        return ticket.groupSuport === filter;
      }
      return true;
    })();

    return matchesSearch && isGroupAccessible && matchesFilter;
  });

  const handleRowClick = (ticket: TicketData) => {
    navigate("/ocurrenceDetails", { state: { id: ticket.id } });
  };

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Ocorrências - Tickets
          <div className="flex items-center border border-border rounded-lg px-3 py-2 mt-4">
            <Search size={16} className="mr-2" />
            <input
              type="text"
              placeholder="Pesquisar clientes"
              className="outline-none text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardTitle>

        <div className="flex justify-self-end items-center space-x-4 my-2">
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas</SelectItem>
              <SelectItem value="Minhas Ocorrências">
                Minhas Ocorrências
              </SelectItem>
              {accessibleGroups.map((group) => (
                <SelectItem key={group} value={group}>
                  Grupo {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <CreateOcurrence />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-gray-500">ID</TableHead>
              <TableHead className="font-semibold text-gray-500">
                Título
              </TableHead>
              <TableHead className="font-semibold text-gray-500">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-500">
                Responsável
              </TableHead>
              <TableHead className="font-semibold text-gray-500">
                Grupo
              </TableHead>
              <TableHead className="font-semibold text-gray-500">
                Data
              </TableHead>
              <TableHead className="font-semibold text-gray-500">
                Tempo de expiração
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets?.map((ticket) => (
              <TableRow key={ticket.id} onClick={() => handleRowClick(ticket)}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.reason}</TableCell>
                <TableCell>
                  <div
                    className="px-3 py-1 rounded-lg text-sm font-semibold lowercase"
                    style={{
                      backgroundColor: getColorRGBA(
                        ticket.status.status,
                        statusColors,
                        0.2
                      ),
                      color: getColorRGBA(
                        ticket.status.status,
                        statusColors,
                        0.9
                      ),
                      width: "fit-content",
                    }}
                  >
                    {ticket.status.status}
                  </div>
                </TableCell>
                <TableCell>
                  {ticket.assignedTo?.name ?? "Não atribuído"}
                </TableCell>

                <TableCell>{ticket.groupSuport}</TableCell>
                <TableCell>
                  {dateFormat(ticket.createdAt)} às{" "}
                  {timeFormat(ticket.createdAt)}
                </TableCell>
                <TableCell>{ticket.expiredAt} horas</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </div>
  );
}
