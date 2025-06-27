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
  Status,
  TicketData,
} from "@/interfaces/ticket-data";

import { getColorRGBA, statusColors } from "./utilsOcurrences";
import { getReplyReason } from "@/services/Tickets/useReasons";
import { useFinalizeTicketFlow } from "@/services/Tickets/useTickets";

interface Props {
  ticket: TicketData;
}

export function FinalizeTicketDialog({ ticket }: Props) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [currentStatus, setCurrentStatus] = useState<Status>(
    ticket.status as Status
  );
  const [selectedReply, setSelectedReply] = useState<FinalizationReply | null>(
    null
  );
  const [replys, setReplys] = useState<FinalizationReply[]>([]);
  const [showComment, setShowComment] = useState(false);
  const [showAssignConfirm, setShowAssignConfirm] = useState(false);

  useEffect(() => {
    const fetchReplys = async () => {
      if (ticket.reason.id) {
        const reasonReplys = await getReplyReason(ticket.reason.id);
        setReplys(reasonReplys);
      }
    };
    fetchReplys();
  }, [ticket.reason.id]);

  const handleChange = (status: Status) => {
    setCurrentStatus(status);
    if (status === "FINALIZADO") {
      setOpen(true);
    }
  };

  const finalizeTicketFlow = useFinalizeTicketFlow();

  const handleFinalize = async () => {
    if (!selectedReply) return;

    const needsComment = selectedReply.comment;
    const hasResponsible = !!ticket.assignedTo;

    if (needsComment && comment.trim() === "") {
      return;
    }

    if (!needsComment && !hasResponsible) {
      setShowAssignConfirm(true);
      return;
    }

    await finalizeTicketFlow.mutateAsync({
      ticket,
      reply: selectedReply,
      commentText: comment.trim() || undefined,
    });

    setOpen(false);
    setSelectedReply(null);
    setComment("");
  };

  const handleComment = async () => {
    await finalizeTicketFlow.mutateAsync({
      ticket,
      reply: selectedReply!,
      commentText: comment.trim(),
    });
    setShowComment(false);
    setOpen(false);
    setComment("");
    setSelectedReply(null);
  };

  const bgColor = getColorRGBA?.(currentStatus, statusColors, 0.2) ?? "#eee";
  const textColor = getColorRGBA?.(currentStatus, statusColors, 0.9) ?? "#000";

  return (
    <>
      <Select onValueChange={handleChange} value={currentStatus}>
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
              <SelectItem value="FINALIZADO" className="text-primary">
                FINALIZAR TICKET
              </SelectItem>
            )}
        </SelectContent>
      </Select>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          setShowComment(false);
          setSelectedReply(null);
          setComment("");
          setShowAssignConfirm(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respostas da Finalização</DialogTitle>
          </DialogHeader>

          <Select
            value={selectedReply?.id.toString() ?? ""}
            onValueChange={(value) => {
              const replyFound = replys.find((r) => r.id.toString() === value);
              setSelectedReply(replyFound ?? null);
              setShowComment(replyFound?.comment === true);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o motivo" />
            </SelectTrigger>
            <SelectContent>
              {replys.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Nenhum motivo disponível para este ticket.
                </p>
              )}
              {replys.map((reply) => (
                <SelectItem key={reply.id} value={reply.id.toString()}>
                  {reply.reply}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showAssignConfirm ? (
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                Esse ticket não tem responsável. Deseja se atribuir e finalizar?
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowAssignConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={async () => {
                    await finalizeTicketFlow.mutateAsync({
                      ticket,
                      reply: selectedReply!,
                      commentText: comment.trim() || undefined,
                    });
                    setShowAssignConfirm(false);
                    setOpen(false);
                    setSelectedReply(null);
                    setComment("");
                  }}
                >
                  Sim, atribuir e finalizar
                </Button>
              </div>
            </div>
          ) : showComment ? (
            <div className="flex flex-col gap-2 mt-4">
              <Textarea
                placeholder="Escreva um comentário de finalização aqui..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[120px] whitespace-pre-wrap break-words"
              />
              <Button
                onClick={handleComment}
                disabled={comment.trim() === ""}
              >
                Enviar comentário e Finalizar
              </Button>
            </div>
          ) : (
            <DialogFooter>
              <Button
                onClick={handleFinalize}
                disabled={!selectedReply}
              >
                Confirmar
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
