import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketAudit, TicketData } from "@/interfaces/ocurrences-data";
import { updateTicket, useCreateTicketAudit } from "@/services/Tickets/useTickets";
import { useAuth } from "@/store/auth";
import { useState } from "react";

const STATUS_OPTIONS = [
  "PENDENTE",
  "PENDENTE EXPIRADO",
  "EM ANDAMENTO",
  "EM ANDAMENTO EXPIRADO",
  "FINALIZADO",
  "FINALIZADO EXPIRADO",
  "AGUARDANDO RESPOSTA DO CLIENTE",
] as const;

type TicketStatus = typeof STATUS_OPTIONS[number];

interface TicketStatusDropdownProps {
  ticket: TicketData;
  statusColors: Record<string, string>;
  getColorRGBA: (status: string, colors: any, opacity: number) => string;
}

export function TicketStatusDropdown({
  ticket,
  statusColors,
  getColorRGBA,
}: TicketStatusDropdownProps) {
  const { user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<TicketStatus>(ticket.status.status as TicketStatus);
  const [isUpdating, setIsUpdating] = useState(false);


  const handleChange = async (newStatus: TicketStatus) => {
    if (newStatus === currentStatus || isUpdating) return;

    try {
       await updateTicket(ticket.id!, {
        status: { ...ticket.status, status: newStatus },
      });

      setCurrentStatus(newStatus);

      const auditPayload: TicketAudit = {
        ticketId: ticket.id!,
        action: "Atualizou",
        performedBy: {
          id: user?.id ?? 0,
          name: user?.name ?? "",
          groupSuport: user?.groupLevel ?? "N1",
        },
        message: `Atualização de status do ticket`,
        description: `Ocorrência ${ticket.id} atualizada para "${newStatus}" por ${user?.name ?? "usuário"}.`,
        date: new Date().toISOString(),
      };

      await useCreateTicketAudit(auditPayload);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const bgColor = getColorRGBA?.(currentStatus, statusColors, 0.2) ?? "#eee";
  const textColor = getColorRGBA?.(currentStatus, statusColors, 0.9) ?? "#000";

  return (
    <Select
      onValueChange={handleChange}
      value={currentStatus}
      disabled={isUpdating}
    >
      <SelectTrigger
        className="w-fit h-2 text-sm font-semibold lowercase rounded-sm cursor-pointer border-none"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
