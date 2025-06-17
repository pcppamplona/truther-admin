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
  GroupSuport,
  TicketAudit,
  TicketData,
} from "@/interfaces/ocurrences-data";
import {
  updateTicket,
  useCreateTicket,
  useCreateTicketAudit,
} from "@/services/Tickets/useTickets";
import { useAuth } from "@/store/auth";
import { useState, useEffect } from "react";
import { getTicketInfoByTitle } from "./utilsOcurrences";

const STATUS_OPTIONS = [
  "PENDENTE",
  "PENDENTE EXPIRADO",
  "EM ANDAMENTO",
  "EM ANDAMENTO EXPIRADO",
  "FINALIZADO",
  "FINALIZADO EXPIRADO",
  "AGUARDANDO RESPOSTA DO CLIENTE",
] as const;

const FINALIZATION_REASONS = [
  "Problema resolvido",
  "Solicitação cancelada",
  "Mudança de turno",
  "Necessária ação superior",
] as const;

type TicketStatus = (typeof STATUS_OPTIONS)[number];
type FinalizationReason = (typeof FINALIZATION_REASONS)[number];

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
  const [currentStatus, setCurrentStatus] = useState<TicketStatus>(
    ticket.status.status as TicketStatus
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TicketStatus | null>(null);
  const [showFinalizationDialog, setShowFinalizationDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState<FinalizationReason | "">(
    ""
  );
  const [newTicketReason, setNewTicketReason] = useState<string>("");
  const [newGroup, setNewGroup] = useState<GroupSuport | "">("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (newTicketReason) {
      const info = getTicketInfoByTitle(newTicketReason);
      setDescription(info.description);
    } else {
      setDescription("");
    }
  }, [newTicketReason]);

  const handleChange = (newStatus: TicketStatus) => {
    if (newStatus === currentStatus || isUpdating) return;

    if (newStatus === "FINALIZADO" || newStatus === "FINALIZADO EXPIRADO") {
      setPendingStatus(newStatus);
      setShowFinalizationDialog(true);
    } else {
      updateStatus(newStatus);
    }
  };

  const updateStatus = async (newStatus: TicketStatus, reason?: string) => {
    setIsUpdating(true);
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
          groupSuport: user!.groupLevel,
        },
        message: `Atualização de status do ticket`,
        description: `Ocorrência ${ticket.id} finalizada por ${
          user?.name
        }. Motivo: ${reason || "não informado"}`,
        date: new Date().toISOString(),
      };

      await useCreateTicketAudit(auditPayload);

      if (
        reason &&
        (reason === "Mudança de turno" || reason === "Necessária ação superior")
      ) {
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
    if (!newTicketReason || !newGroup) return;

    const ticketInfo = getTicketInfoByTitle(newTicketReason);

    const payload: TicketData = {
      reason: newTicketReason,
      description: description || ticketInfo.description,
      expiredAt: ticketInfo.expiredAt,
      status: {
        title: newTicketReason,
        status: "PENDENTE",
        description: description || ticketInfo.description,
      },
      groupSuport: newGroup,
      createdAt: new Date().toISOString(),
      createdBy: {
        id: user?.id ?? 0,
        name: user?.name ?? "",
        groupSuport: user!.groupLevel,
      },
      assignedTo: null,
      lastInteractedBy: undefined,
      requester: ticket.requester || null,
      startedAt: "",
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
            groupSuport: user!.groupLevel,
          },
          message: `um novo Ticket`,
          description: `Ticket criado por ${
            user?.name || "usuário desconhecido"
          }.`,
          date: new Date().toISOString(),
        };

        await useCreateTicketAudit(auditPayload);
        console.log("Auditoria de criação registrada.");
      }
    } catch (error) {
      console.error("Erro ao criar novo ticket:", error);
    }
  };

  const handleFinalize = () => {
    if (!selectedReason) return;
    if (
      selectedReason === "Mudança de turno" ||
      selectedReason === "Necessária ação superior"
    ) {
      if (!newTicketReason || !newGroup) return;
    }
    if (pendingStatus) {
      updateStatus(pendingStatus, selectedReason);
    }
  };

  const resetForm = () => {
    setShowFinalizationDialog(false);
    setSelectedReason("");
    setNewTicketReason("");
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
            value={selectedReason}
            onValueChange={(value) =>
              setSelectedReason(value as FinalizationReason)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o motivo" />
            </SelectTrigger>
            <SelectContent>
              {FINALIZATION_REASONS.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(selectedReason === "Mudança de turno" ||
            selectedReason === "Necessária ação superior") && (
            <>
              <Select
                value={newGroup}
                onValueChange={(value) => setNewGroup(value as GroupSuport)}
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
                value={newTicketReason}
                onValueChange={(value) => setNewTicketReason(value)}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Selecione o motivo do novo ticket" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(getTicketInfoByTitle("")).map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                  {[
                    "Erro de KYC",
                    "N3 KYC ERROR",
                    "Retorno de KYC ERROR pro anterior",
                    "Avaliação de tratativa de evento",
                    "EMAIL AJUDA UNIVERSITARIOS",
                  ].map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
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
                !selectedReason ||
                ((selectedReason === "Mudança de turno" ||
                  selectedReason === "Necessária ação superior") &&
                  (!newTicketReason || !newGroup))
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
