import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { TicketData } from "@/interfaces/TicketData";
import { useAuthStore } from "@/store/auth";
import { useUpdateTicket } from "@/services/Tickets/useTickets";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { toast } from "sonner";

interface AssignToMeDialogProps {
  ticket: TicketData;
  disabled?: boolean;
}

export function AssignToMeDialog({
  ticket,
  disabled = false,
}: AssignToMeDialogProps) {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useUpdateTicket();

  const handleAssignToMe = async () => {
    if (disabled) return;
    try {
      await mutateAsync({
        id: ticket.id,
        data: {
          assigned_user: user?.id,
          status: ticket.status === "PENDENTE" ? "EM ANDAMENTO" : ticket.status,
        },
      });

      setOpen(false);

      toast.success("Ticket atualizado", {
        description: "Agora está atribuído a você.",
        duration: 2000,
      });
    } catch (error) {
      console.error("Erro ao atualizar ticket:", error);

      toast.error("Erro ao atualizar", {
        description: "Não foi possível atribuir o ticket.",
        duration: 2000,
      });
    }
  };

  // const isAssigned = Boolean(ticket.assigned_user);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-1"
          disabled={Boolean(ticket.assigned_user?.id) || isPending}
        >
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

      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Confirmar atribuição</DialogTitle>
          <DialogDescription>
            Você deseja realmente se atribuir a esta ocorrência?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button disabled={isPending} onClick={handleAssignToMe}>
            {isPending ? "Atribuindo..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
