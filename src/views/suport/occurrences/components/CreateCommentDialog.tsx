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
import { useAuthStore } from "@/store/auth";
import { TicketData } from "@/interfaces/TicketData";
import { useCreateTicketComment, useUpdateTicket } from "@/services/Tickets/useTickets";
import { toast } from "sonner";

export interface CommentProps {
  ticket: TicketData;
}

export default function CreateCommentDialog({ ticket }: CommentProps) {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { user } = useAuthStore();

  const { mutateAsync: updateTicket, isPending: isUpdating } = useUpdateTicket();
  const { mutateAsync: createComment, isPending: isCreating } = useCreateTicketComment();

  const handleSubmit = async () => {
    if (!message.trim() || !ticket.id || !user) {
      console.warn("Comentário inválido ou dados ausentes.");
      return;
    }

    if (!ticket.assigned_user?.id) {
      setConfirming(true);
      return;
    }

    await handleCreateComment();
  };

  const handleCreateComment = async (assignIfNeeded = false) => {
    try {
      if (assignIfNeeded) {
        await updateTicket({
          id: ticket.id,
          data: {
            assigned_user: user?.id,
            status: ticket.status === "PENDENTE" ? "EM ANDAMENTO" : ticket.status,
          },
        });
      }

      await createComment({
        ticket_id: ticket.id,
        author: user?.name ?? "",
        message: message,
      });

       toast.success("Comentário adicionado", {
        description: `Seu novo comentário já foi adicionado ao ticket ${ticket.id}`,
        duration: 2000,
      });

      setMessage("");
      setConfirming(false);
      setOpen(false);
    } catch (err) {
      toast.error("Não Foi possível adicionar o comentário!", {
        description: `Seu novo comentário ao ticket ${ticket.id} foi negado. Tente novamente!`,
        duration: 3000,
      });
    }
  };

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
              disabled={isUpdating || isCreating}
            />

            <Button
              onClick={handleSubmit}
              className="ml-auto"
              disabled={isUpdating || isCreating}
            >
              {isUpdating || isCreating ? "Salvando..." : "Salvar comentário"}
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
            <Button
              variant="outline"
              onClick={() => setConfirming(false)}
              disabled={isUpdating}
            >
              Cancelar
            </Button>

            <Button
              onClick={() => handleCreateComment(true)}
              disabled={isUpdating || isCreating}
            >
              {isUpdating || isCreating ? "Processando..." : "Confirmar e salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
