import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  updateTicket,
  useCreateTicket,
  useCreateTicketAudit,
} from "@/services/Tickets/useTickets";
import { useAuth } from "@/store/auth";
import {
  FinalizationReply,
  Group,
  Status,
  TicketAudit,
  TicketData,
} from "@/interfaces/ticket-data";
import { getReplayTicketReasons } from "@/services/Tickets/useReasons";

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
  const [currentStatus, setCurrentStatus] = useState<Status>(
    ticket.status as Status
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Status | null>(null);
  const [showFinalizationDialog, setShowFinalizationDialog] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);
  const [newGroup, setNewGroup] = useState<Group | "">("");
  const [newTicketReasonId, setNewTicketReasonId] = useState<number | null>(
    null
  );
  const [availableReasons, setAvailableReasons] = useState<FinalizationReply[]>(
    []
  );
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const fetchReasons = async () => {
      if (ticket.reason?.id) {
        const reasons = await getReplayTicketReasons(ticket.reason.id);
        setAvailableReasons(reasons);
      }
    };
    fetchReasons();
  }, [ticket.reason?.id]);

  useEffect(() => {
    if (newTicketReasonId != null) {
      const selected = availableReasons.find((r) => r.id === newTicketReasonId);
      setDescription(selected?.reply ?? "");
    } else {
      setDescription("");
    }
  }, [newTicketReasonId, availableReasons]);

  const selectedReason = availableReasons.find(
    (r) => r.id === selectedReasonId
  );

  const needsNewTicket = selectedReason?.actionType === "new_event";

  const handleChange = (newStatus: Status) => {
    if (newStatus === currentStatus || isUpdating) return;

    if (newStatus === "FINALIZADO" || newStatus === "FINALIZADO EXPIRADO") {
      setPendingStatus(newStatus);
      setShowFinalizationDialog(true);
    } else {
      updateStatus(newStatus);
    }
  };

  const updateStatus = async (newStatus: Status) => {
    setIsUpdating(true);
    try {
      await updateTicket(ticket.id!, { status: newStatus });

      setCurrentStatus(newStatus);

      const auditPayload: TicketAudit = {
        ticketId: ticket.id!,
        action: "Atualizou",
        performedBy: {
          id: user?.id ?? 0,
          name: user?.name ?? "",
          group: user!.groupLevel,
        },
        message: "Atualização de status do ticket",
        description: `Ocorrência ${ticket.id} atualizada para ${newStatus} por ${user?.name}.`,
        date: new Date().toISOString(),
      };

      await useCreateTicketAudit(auditPayload);

      if (needsNewTicket) {
        await createNewTicket();
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    } finally {
      setIsUpdating(false);
      resetForm();
    }
  };

  const createNewTicket = async () => {
    if (!newTicketReasonId || !newGroup) return;

    const selected = availableReasons.find((r) => r.id === newTicketReasonId);
    if (!selected) return;

    const payload: TicketData = {
      createdBy: {
        id: user?.id ?? 0,
        name: user?.name ?? "",
        group: user!.groupLevel,
      },
      assignedTo: null,
      // reason: selected,
      reason: ticket.reason,
      status: "PENDENTE",
      createdAt: new Date().toISOString(),
      client: ticket.client,
    };

    try {
      const newTicket = await useCreateTicket(payload);

      if (newTicket?.id) {
        const auditPayload: TicketAudit = {
          ticketId: newTicket.id,
          action: "Adicionou",
          performedBy: {
            id: user?.id ?? 0,
            name: user?.name ?? "",
            group: user!.groupLevel,
          },
          message: "um novo Ticket",
          description: `Ticket criado por ${
            user?.name || "usuário desconhecido"
          }.`,
          date: new Date().toISOString(),
        };

        await useCreateTicketAudit(auditPayload);
      }
    } catch (error) {
      console.error("Erro ao criar novo ticket:", error);
    }
  };

  const handleFinalize = () => {
    if (!selectedReasonId) return;
    if (needsNewTicket && (!newTicketReasonId || !newGroup)) return;
    if (pendingStatus) {
      // updateStatus(pendingStatus, selectedReason?.reply);
      updateStatus(pendingStatus);
    }
  };

  const resetForm = () => {
    setShowFinalizationDialog(false);
    setSelectedReasonId(null);
    setNewTicketReasonId(null);
    setNewGroup("");
    setDescription("");
    setPendingStatus(null);
  };

  const bgColor = getColorRGBA?.(currentStatus, statusColors, 0.2) ?? "#eee";
  const textColor = getColorRGBA?.(currentStatus, statusColors, 0.9) ?? "#000";

  const STATUS_OPTIONS: Status[] = [
    "PENDENTE",
    "PENDENTE EXPIRADO",
    "EM ANDAMENTO",
    "EM ANDAMENTO EXPIRADO",
    "FINALIZADO",
    "FINALIZADO EXPIRADO",
    "AGUARDANDO RESPOSTA DO CLIENTE",
  ];

  return (
    <>
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

      <Dialog
        open={showFinalizationDialog}
        onOpenChange={setShowFinalizationDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo da Finalização</DialogTitle>
          </DialogHeader>

          <Select
            value={selectedReasonId?.toString() ?? ""}
            onValueChange={(value) => setSelectedReasonId(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o motivo" />
            </SelectTrigger>
            <SelectContent>
              {availableReasons.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Nenhum motivo disponível para este ticket.
                </p>
              )}
              {availableReasons.length > 0 &&
                availableReasons.map((reason) => (
                  <SelectItem key={reason.id} value={reason.id.toString()}>
                    {reason.reply}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {needsNewTicket && (
            <>
              <Select
                value={newGroup}
                onValueChange={(value) => setNewGroup(value as Group)}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent>
                  {["N1", "N2", "N3", "PRODUTO", "MKT", "ADMIN"].map(
                    (group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <Select
                value={newTicketReasonId?.toString() ?? ""}
                onValueChange={(value) => setNewTicketReasonId(Number(value))}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Selecione o motivo do novo ticket" />
                </SelectTrigger>
                <SelectContent>
                  {availableReasons.map((reason) => (
                    <SelectItem key={reason.id} value={reason.id.toString()}>
                      {reason.reply}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                className="mt-2"
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </>
          )}

          <DialogFooter>
            <Button
              onClick={handleFinalize}
              disabled={
                isUpdating ||
                !selectedReasonId ||
                (needsNewTicket && (!newTicketReasonId || !newGroup))
              }
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
