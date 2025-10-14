import { useState } from "react";
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
import { TicketData, FinalizationReply } from "@/interfaces/TicketData";
import { Forward } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { useFinalizeTicket } from "@/services/Tickets/useTickets";
import { useTicketReasonsReply } from "@/services/Tickets/useReasons";

interface Props {
  ticket: TicketData;
}

export function FinalizeTicketDialog({ ticket }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedReply, setSelectedReply] = useState<FinalizationReply | null>(
    null
  );
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);

  const finalizeTicket = useFinalizeTicket();
  const { user } = useAuthStore();

  const { data: replysData } = useTicketReasonsReply(ticket.reason.id);
  const replys = Array.isArray(replysData)
    ? replysData
    : [replysData].filter(Boolean);

  // const canFinalize =
  //   ticket.assigned_user &&
  //   ticket.assigned_user.id === user?.id &&
  //   !["FINALIZADO", "FINALIZADO EXPIRADO"].includes(ticket.status);

  const handleOpen = () => {
    if (!ticket.assigned_user) {
      toast.error("Ticket sem responsável", {
        description: "Atribua-se ao ticket antes de finalizá-lo.",
        duration: 3000,
      });
      return;
    }

    if (ticket.assigned_user.id !== user?.id) {
      toast.error("Acesso negado", {
        description: "Você não é o responsável ou não tem permissão de finalizar este ticket.",
        duration: 3000,
      });
      return;
    }

    setOpen(true);
  };

  const handleFinalize = async () => {
    if (!selectedReply) {
      toast.error("Selecione uma resposta de finalização.", { duration: 2000 });
      return;
    }

    if (selectedReply.comment && comment.trim() === "") {
      toast.error("Comentário obrigatório", {
        description: "Esta resposta exige um comentário de finalização.",
        duration: 2000,
      });
      setShowComment(true);
      return;
    }

    try {
      await finalizeTicket.mutateAsync({
        id: ticket.id,
        reply_id: selectedReply.id,
        comment: comment.trim() || undefined,
      });

      toast.success("Ticket finalizado com sucesso!");
      setOpen(false);
      setSelectedReply(null);
      setComment("");
    } catch (error: any) {
      toast.error("Erro ao finalizar ticket", {
        description: error?.response?.data?.message ?? "Erro inesperado.",
      });
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="h-8"
        onClick={handleOpen}
        // disabled={!canFinalize}
      >
        <Forward size={18} />
        <p>Finalizar</p>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Ticket #{ticket.id}</DialogTitle>
          </DialogHeader>

          <Select
            value={selectedReply?.id.toString() ?? ""}
            onValueChange={(value) => {
              const reply =
                replys.find((r) => r.id.toString() === value) ?? null;
              setSelectedReply(reply);
              setShowComment(reply?.comment === true);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o motivo da finalização" />
            </SelectTrigger>
            <SelectContent>
              {replys.map((reply) => (
                <SelectItem key={reply.id} value={reply.id.toString()}>
                  {reply.reply}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showComment && (
            <div className="mt-4">
              <Textarea
                placeholder="Escreva o comentário de finalização..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={handleFinalize}
              disabled={finalizeTicket.isPending || !selectedReply}
            >
              {finalizeTicket.isPending ? "Finalizando..." : "Confirmar"}
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
