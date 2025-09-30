import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCreateTicket } from "@/services/Tickets/useTickets";

import type { TicketTyped } from "@/interfaces/TicketData";
import { StepCategory } from "./steps/StepCategory";
import { StepClient } from "./steps/StepClient";
import { StepRecipient } from "./steps/StepRecipient";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { toast } from "sonner";

export function CreateTicket() {
  const { user } = useAuthStore();
  const createTicket = useCreateTicket();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const stepTitles: Record<number, string> = {
    1: "Categoria e Motivo",
    2: "Informações do Cliente",
    3: "Confirmação do Receptor",
  };
  const [ticketData, setTicketData] = useState<Partial<TicketTyped>>({});

  const handleChange = <K extends keyof TicketTyped>(
    field: K,
    value: TicketTyped[K]
  ) => {
    setTicketData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateTicket = async () => {
    if (!ticketData.reason_id || !user) return;

    const payload: TicketTyped = {
      created_by: user.id,
      client_id: ticketData.client_id ?? null,
      assigned_group: ticketData.assigned_group ?? null,
      assigned_user: ticketData.assigned_user ?? null,
      reason_id: ticketData.reason_id,
      status: "PENDENTE",
      created_at: new Date().toISOString(),
    };

    try {
      await createTicket.mutateAsync(payload);
      setOpen(false);
      setStep(1);
      setTicketData({});

      toast.success("Novo ticket criado", {
        description: `Seu novo novo ticket:${ticketData.id} foi adicionado com sucesso`,
        duration: 2000,
      });
    } catch (err) {
       toast.error("Erro ao criar ticket!", {
        description: "Não foi possível criar esse ticket. Tente novamente em alguns minutos!",
        duration: 2000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-14 h-12">
          <Plus size={18} color="#fff" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogDescription>Criar novo ticket</DialogDescription>
          <Progress value={(step / 3) * 100} className="my-4" />
          <DialogTitle>{stepTitles[step]}</DialogTitle>
        </DialogHeader>
        {step === 1 && (
          <StepCategory onChange={handleChange} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <StepClient
            onChange={handleChange}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepRecipient
            reasonId={ticketData.reason_id!}
            onChange={handleChange}
            onBack={() => setStep(2)}
            onSubmit={handleCreateTicket}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
