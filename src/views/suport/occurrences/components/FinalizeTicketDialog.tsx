import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  FinalizationReply,
  Group,
  Status,
  TicketAudit,
  TicketData,
} from "@/interfaces/ticket-data";
import { getReplayTicketReasons } from "@/services/Tickets/useReasons";
import { useAuth } from "@/store/auth";
import {
  updateTicket,
  useCreateTicket,
  useCreateTicketAudit,
} from "@/services/Tickets/useTickets";
import { getColorRGBA, statusColors } from "./utilsOcurrences";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: TicketData;
}

export function FinalizeTicketDialog({ ticket }: Props) {
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

  return (
    <>
      <Select
        onValueChange={handleChange}
        value={currentStatus}
        disabled={isUpdating}
      >
        <SelectTrigger
          className="w-fit h-2 text-sm font-semibold lowercase rounded-sm border-none"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          <SelectValue placeholder={ticket.status} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ticket.status} disabled>
            {ticket.status}
          </SelectItem>
          {ticket.status !== "FINALIZADO" &&
            ticket.status !== "FINALIZADO EXPIRADO" && (
              <SelectItem value="FINALIZADO" className="text-red-600">
                FINALIZAR TICKET
              </SelectItem>
            )}
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

      {/* <Dialog open={open} onOpenChange={onOpenChange}> */}
       {/* <Dialog
        open={showFinalizationDialog}
        onOpenChange={setShowFinalizationDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resposta da Finalização</DialogTitle>
          </DialogHeader>

          <Select
            value={selectedReasonId?.toString() ?? ""}
            onValueChange={(value) => setSelectedReasonId(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a resposta pertinente" />
            </SelectTrigger>
            <SelectContent>
              {availableReasons.map((reason) => (
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
                  <SelectValue placeholder="Grupo para novo ticket" />
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
                  <SelectValue placeholder="Motivo do novo ticket" />
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
                !selectedReasonId ||
                (needsNewTicket && (!newTicketReasonId || !newGroup))
              }
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
}
