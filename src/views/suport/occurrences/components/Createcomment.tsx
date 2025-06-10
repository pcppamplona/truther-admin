import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useAuth } from "@/store/auth";
import { useCreateTicketAudit, useCreateTicketComment } from "@/services/Tickets/useTickets";
import { TicketAudit, TicketComment } from "@/interfaces/ocurrences-data";

export interface CommentProps {
  ticketId: string;
}

export default function CreateComment({ ticketId }: CommentProps) {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

const handleSubmit = async () => {
  if (!message.trim() || !ticketId || !user) return;

  const newComment: TicketComment = {
    ticketId,
    author: user.name,
    message: message.trim(),
    date: new Date().toISOString(),
  };

  try {
    await useCreateTicketComment(newComment);

    const auditPayload: TicketAudit = {
      ticketId: Number(ticketId),
      action: "Adicionou",
      performedBy: {
        id: user.id,
        name: user.name,
        groupSuport: user.groupLevel,
      },
      message: `um novo Comentário`,
      description: `Comentário adicionado por ${user.name}, ao ticket: ${ticketId}`,
      date: new Date().toISOString(),
    };

    await useCreateTicketAudit(auditPayload);
    setMessage("");
    setOpen(false);
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogDescription>Adicionar comentário ao ticket</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Escreva seu comentário aqui..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
          <Button onClick={handleSubmit} className="ml-auto">
            Salvar comentário
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
