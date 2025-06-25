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
import { useNavigate } from "react-router-dom";
import { dateFormat, timeFormat } from "@/lib/formatters";
import { useAuth } from "@/store/auth";
import { getColorRGBA, statusColors } from "./components/utilsOcurrences";
import { CreateTicket } from "./components/CreateTicket";
import {
  Group,
  groupHierarchy,
  TicketData,
} from "@/interfaces/ticket-data";

export default function ListOcurrences() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;
  const userGroupLevel = user?.groupLevel;

  const { data: Tickets } = useTickets();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Todas");

  const accessibleGroups = userGroupLevel
    ? (Object.keys(groupHierarchy) as Group[]).filter(
        (group) => groupHierarchy[group] <= groupHierarchy[userGroupLevel as Group]
      )
    : [];

  const filteredTickets = Tickets?.filter((ticket) => {
    const matchesSearch = (ticket.reason.reason ?? "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let recipientGroup: Group | null = null;

    if (ticket.reason.typeRecipient === "GROUP") {
      recipientGroup = ticket.reason.recipient as Group;
    } else if (ticket.reason.typeRecipient === "USER") {
      // Destinatário é usuário, não tem grupo
      recipientGroup = null;
    } else if (ticket.reason.typeRecipient === "ALL") {
      recipientGroup = ticket.reason.recipient as Group;
    }

    const isGroupAccessible =
      recipientGroup !== null ? accessibleGroups.includes(recipientGroup) : true;

    const matchesFilter = (() => {
      if (filter === "Meus Tickets") {
        return ticket.assignedTo !== null && typeof ticket.assignedTo !== "string" && ticket.assignedTo.id === userId;
      }

      if ((filter as Group) in groupHierarchy) {
        if (ticket.reason.typeRecipient === "GROUP") {
          return ticket.reason.recipient === filter;
        }

        if (ticket.reason.typeRecipient === "ALL") {
          return ticket.reason.recipient === filter;
        }

        if (ticket.reason.typeRecipient === "USER") {
          const assignedGroup =
            ticket.assignedTo !== null &&
            typeof ticket.assignedTo !== "string"
              ? ticket.assignedTo.group
              : null;
          return assignedGroup === filter;
        }
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
              <SelectItem value="Meus Tickets">Meus Tickets</SelectItem>
              {accessibleGroups.map((group) => (
                <SelectItem key={group} value={group}>
                  Grupo {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CreateTicket />
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Expiração</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets?.map((ticket) => (
              <TableRow key={ticket.id} onClick={() => handleRowClick(ticket)}>
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
                  {ticket.assignedTo && typeof ticket.assignedTo !== "string"
                    ? ticket.assignedTo.name
                    : "Não atribuído"}
                </TableCell>
                <TableCell>
                  {dateFormat(ticket.createdAt)} às {timeFormat(ticket.createdAt)}
                </TableCell>
                <TableCell>{ticket.reason.expiredAt} horas</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </div>
  );
}
