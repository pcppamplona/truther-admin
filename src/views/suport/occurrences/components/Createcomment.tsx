import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useAuth } from "@/store/auth";
import {
  updateTicket,
  useCreateTicketAudit,
  useCreateTicketComment,
} from "@/services/Tickets/useTickets";
import { TicketData } from "@/interfaces/ticket-data";

export interface CommentProps {
  ticket: TicketData;
}

export default function CreateComment({ ticket }: CommentProps) {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!message.trim() || !ticket.id || !user) {
      console.warn("Comentário inválido ou dados ausentes.");
      return;
    }

    if (!ticket.assignedTo) {
      // Ticket sem responsável: abrir confirmação
      setConfirming(true);
      return;
    }

    // Ticket já tem responsável: cria comentário direto
    await handleCreateComment();
  };

  const handleCreateComment = async (assignIfNeeded = false) => {
    if (!user || !ticket.id || !message.trim()) return;

    if (assignIfNeeded) {
      const updated = await updateTicket(ticket.id, {
        assignedTo: {
          id: user.id,
          name: user.name,
          group: user.groupLevel,
        },
      });

      await useCreateTicketAudit({
        ticketId: ticket.id,
        action: "Atribuiu",
        performedBy: {
          id: user.id,
          name: user.name,
          group: user.groupLevel,
        },
        message: "um ticket",
        description: `Ocorrência ${ticket.id} atribuída a ${user.name}.`,
        date: new Date().toISOString(),
      });

      if (updated.status === "PENDENTE") {
        await updateTicket(ticket.id, { status: "EM ANDAMENTO" });

        await useCreateTicketAudit({
          ticketId: ticket.id,
          action: "Atualizou",
          performedBy: {
            id: user.id,
            name: user.name,
            group: user.groupLevel,
          },
          message: "o status do ticket",
          description: `Status da ocorrência ${ticket.id} alterado para EM ANDAMENTO por ${user.name}.`,
          date: new Date().toISOString(),
        });
      }
    }
    if (assignIfNeeded) {
      const updated = await updateTicket(ticket.id, {
        assignedTo: {
          id: user.id,
          name: user.name,
          group: user.groupLevel,
        },
      });

      await useCreateTicketAudit({
        ticketId: ticket.id,
        action: "Atribuiu",
        performedBy: {
          id: user.id,
          name: user.name,
          group: user.groupLevel,
        },
        message: "um ticket",
        description: `Ocorrência ${ticket.id} atribuída a ${user.name}.`,
        date: new Date().toISOString(),
      });

      if (updated.status === "PENDENTE") {
        await updateTicket(ticket.id, { status: "EM ANDAMENTO" });

        await useCreateTicketAudit({
          ticketId: ticket.id,
          action: "Atualizou",
          performedBy: {
            id: user.id,
            name: user.name,
            group: user.groupLevel,
          },
          message: "o status do ticket",
          description: `Status da ocorrência ${ticket.id} alterado para EM ANDAMENTO por ${user.name}.`,
          date: new Date().toISOString(),
        });
      }
    }

    await useCreateTicketComment({
      ticketId: ticket.id,
      author: user.name,
      message: message.trim(),
      date: new Date().toISOString(),
    });

    await useCreateTicketAudit({
      ticketId: ticket.id,
      action: "Adicionou",
      performedBy: {
        id: user.id,
        name: user.name,
        group: user.groupLevel,
      },
      message: "um novo Comentário",
      description: `Comentário adicionado por ${user.name}, ao ticket: ${ticket.id}`,
      date: new Date().toISOString(),
    });

    setMessage("");
    setOpen(false);
    setConfirming(false);
  };

  // const handleCreateComment = async (assignIfNeeded = false) => {
  //   if (!user || !ticket.id || !message.trim()) return;

  //   if (assignIfNeeded) {
  //     await updateTicket(ticket.id, {
  //       assignedTo: {
  //         id: user.id,
  //         name: user.name,
  //         group: user.groupLevel,
  //       },
  //     });

  //     await useCreateTicketAudit({
  //       ticketId: ticket.id,
  //       action: "Atribuiu",
  //       performedBy: {
  //         id: user.id,
  //         name: user.name,
  //         group: user.groupLevel,
  //       },
  //       message: "um ticket",
  //       description: `Ocorrência ${ticket.id} atribuída a ${user.name}.`,
  //       date: new Date().toISOString(),
  //     });
  //   }

  //   await useCreateTicketComment({
  //     ticketId: ticket.id,
  //     author: user.name,
  //     message: message.trim(),
  //     date: new Date().toISOString(),
  //   });

  //   await useCreateTicketAudit({
  //     ticketId: ticket.id,
  //     action: "Adicionou",
  //     performedBy: {
  //       id: user.id,
  //       name: user.name,
  //       group: user.groupLevel,
  //     },
  //     message: "um novo Comentário",
  //     description: `Comentário adicionado por ${user.name}, ao ticket: ${ticket.id}`,
  //     date: new Date().toISOString(),
  //   });

  //   setMessage("");
  //   setOpen(false);
  //   setConfirming(false);
  // };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          setConfirming(false);
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center border-primary text-primary"
          >
            <Plus size={16} className="mr-2" />
            Comentário
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] w-full overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Novo Comentário</DialogTitle>
            <DialogDescription>
              Adicionar comentário ao ticket
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Escreva seu comentário aqui..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] whitespace-pre-wrap break-words"
            />
            <Button onClick={handleSubmit} className="ml-auto">
              Salvar comentário
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar atribuição</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Este ticket ainda não possui responsável. Ao salvar o comentário,
            você será atribuído automaticamente a ele. Deseja continuar?
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setConfirming(false)}>
              Cancelar
            </Button>

            <Button
              onClick={async () => {
                await handleCreateComment(true);
                setMessage("");
                setConfirming(false);
                setOpen(false);
              }}
            >
              Confirmar e salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
