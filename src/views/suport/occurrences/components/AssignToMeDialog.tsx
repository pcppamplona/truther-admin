import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import {
  TicketData,
  TicketAudit,
  groupHierarchy,
  Group,
} from "@/interfaces/ticket-data";
import { useAuthStore } from "@/store/auth";
import {
  updateTicket,
  useCreateTicketAudit,
} from "@/services/Tickets/useTickets";

interface AssignToMeDialogProps {
  ticket: TicketData;
}

export function AssignToMeDialog({ ticket }: AssignToMeDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();

  const isAssignedToUser = ticket.assignedTo?.id === user?.id;
  const currentLevel = ticket.assignedTo?.group as
    | Group
    | undefined;
  const userLevel = user?.groupLevel as Group | undefined;

  const isAlreadyAssigned = Boolean(ticket.assignedTo);
  const hasPermission =
    userLevel !== undefined &&
    (!isAlreadyAssigned ||
      (currentLevel !== undefined &&
        groupHierarchy[userLevel] > groupHierarchy[currentLevel]));

  const handleAssignToMe = async () => {
    if (!ticket || !user || !hasPermission) return;

    try {
      await updateTicket(ticket.id!, {
        assignedTo: {
          id: user.id,
          name: user.name,
          group: user.groupLevel,
        },
      });

      if (ticket.status === "PENDENTE") {
      await updateTicket(ticket.id!, {
        status: "EM ANDAMENTO",
      });
    }

      const auditPayload: TicketAudit = {
        ticketId: ticket.id!,
        action: "Atribuiu",
        performedBy: {
          id: user.id,
          name: user.name,
          group: user.groupLevel,
        },
        message: "um ticket",
        description: `Ocorrência ${ticket.id} atribuída a ${user.name}.`,
        date: new Date().toISOString(),
      };

      await useCreateTicketAudit(auditPayload);
    } catch (err) {
      console.error("Erro ao atribuir ocorrência ou registrar ações:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <button
              disabled={!hasPermission || isAssignedToUser}
              className="flex items-center gap-1"
            >
              {ticket.assignedTo ? (
                <>
                  <BookmarkCheck className="text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    Atribuído
                  </span>
                </>
              ) : (
                <>
                  <Bookmark className="text-primary" />
                  <span className="text-primary text-sm">Atribuir a mim</span>
                </>
              )}
            </button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {ticket.assignedTo
              ? "Este ticket já possui responsável"
              : "Atribuir este ticket a você"}
          </p>
        </TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar atribuição</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Deseja realmente se atribuir a esta ocorrência?
        </p>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              await handleAssignToMe();
              setOpen(false);
            }}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
