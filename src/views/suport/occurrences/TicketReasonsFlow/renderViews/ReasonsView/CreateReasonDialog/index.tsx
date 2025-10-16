import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { useTicketReason } from "@/services/Tickets/useReasons";
import { StepReason } from "./Steps/StepReason";
import { StepReplies } from "./Steps/StepReplies";
import { StepReplyActions } from "./Steps/StepReplyActions";
import type { Reason, ReplyAction } from "@/interfaces/TicketData";

interface ReplyPayload {
  reply: string;
  comment: boolean;
  actions: ReplyAction[];
}

interface CreateTicketReasonPayload extends Omit<Reason, "id"> {
  replies: ReplyPayload[];
}

export function CreateReasonDialog() {
  const { user } = useAuthStore();
  const createTicketReason = useTicketReason();
  const [, setCurrentReplyIndex] = useState(0);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const stepTitles: Record<number, string> = {
    1: "Categoria e Motivo",
    2: "Resposta para o Motivo",
    3: "Ações (Reply Actions)",
  };

  const [reasonData, setReasonData] = useState<
    Partial<CreateTicketReasonPayload>
  >({
    replies: [],
  });

  const handleChange = <K extends keyof CreateTicketReasonPayload>(
    field: K,
    value: CreateTicketReasonPayload[K]
  ) => {
    setReasonData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!reasonData.category_id || !reasonData.reason) {
      toast.warning("Preencha os campos obrigatórios.");
      return;
    }

    const payload: CreateTicketReasonPayload = {
      category_id: reasonData.category_id!,
      type: reasonData.type ?? "Novo fluxo",
      reason: reasonData.reason ?? "Sem título",
      expired_at: reasonData.expired_at ?? 7,
      description: reasonData.description ?? "",
      type_recipient: reasonData.type_recipient ?? "USER",
      recipient: reasonData.recipient ?? "N1",
      replies: reasonData.replies ?? [],
    };

    try {
      await createTicketReason.mutateAsync(payload);
      setOpen(false);
      setStep(1);
      setReasonData({ replies: [] });

      toast.success("Reason criado com sucesso!", {
        description: `Motivo "${payload.reason}" foi adicionado.`,
        duration: 3000,
      });
    } catch (err) {
      toast.error("Erro ao criar reason!", {
        description: "Não foi possível criar o reason. Tente novamente.",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-12 h-12">
          <Plus size={18} color="#fff" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogDescription>Criar novo Reason</DialogDescription>
          <Progress value={(step / 3) * 100} className="my-4" />
          <DialogTitle>{stepTitles[step]}</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <StepReason onChange={handleChange} onNext={() => setStep(2)} />
        )}

        {step === 2 && (
          <StepReplies
            replies={reasonData.replies || []}
            onChange={(replies) => handleChange("replies", replies)}
            onNext={() => {
              setCurrentReplyIndex(0);
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && reasonData.replies && reasonData.replies.length > 0 && (
          <div className="space-y-6">
            {reasonData.replies.map((reply, index) => (
              <StepReplyActions
                key={index}
                reply={reply}
                replyIndex={index}
                onUpdateActions={(i, actions) => {
                  const updatedReplies = [...reasonData.replies!];
                  updatedReplies[i].actions = actions;
                  handleChange("replies", updatedReplies);
                }}
                hideNavigation
              />
            ))}

            <div className="flex justify-between mt-8 border-t border-border pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Voltar
              </Button>
              <Button onClick={handleSubmit}>Finalizar</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
