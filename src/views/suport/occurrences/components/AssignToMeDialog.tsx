import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { TicketData } from "@/interfaces/TicketData";
import { useAuthStore } from "@/store/auth";
import { useUpdateTicket } from "@/services/Tickets/useTickets";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";

interface AssignToMeDialogProps {
  ticket: TicketData;
}

export function AssignToMeDialog({ ticket }: AssignToMeDialogProps) {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useUpdateTicket();

  const handleAssignToMe = async () => {
    try {
      const data = await mutateAsync({
        id: ticket.id,
        data: {
          assigned_user: user?.id,
          status: ticket.status === "PENDENTE" ? "EM ANDAMENTO" : ticket.status,
        },
      });

      console.log("Ticket atualizado:", data);
      setOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar ticket:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1">
          {ticket.assigned_user?.id ? (
            <>
              <BookmarkCheck className="text-muted-foreground" />
              <span className="text-muted-foreground text-sm">Atribuído</span>
            </>
          ) : (
            <>
              <Bookmark className="text-primary" />
              <span className="text-primary text-sm">Atribuir a mim</span>
            </>
          )}
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar atribuição</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Deseja realmente se atribuir a esta ocorrência?
        </p>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button disabled={isPending} onClick={handleAssignToMe}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
