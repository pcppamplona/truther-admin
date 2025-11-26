import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useDisinterest } from "@/services/clients/kyc/useDisinterest";

interface Props {
  document: string;
  trigger: React.ReactNode;
}

const reasons = [
  "Bloqueio por motivos de segurança",
  "Usuário esta ferindo as politicas da plataforma.",
  "Usuário solicitou o bloqueio na plataforma.",
  "Cliente com movimentações suspeitas.",
];

export function DisinterestKycDialog({ document, trigger }: Props) {
  const disinterest = useDisinterest();

  const [open, setOpen] = useState(false);
  const [internalComent, setInternalComent] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    disinterest.mutate(
      {
        document,
        internalComent,
        reason,
      },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Disinterest</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Resumo</label>
            <Textarea
              value={internalComent}
              onChange={(e) => setInternalComent(e.target.value)}
              rows={4}
            
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Motivo</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>

              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>

          <Button
            className="bg-primary"
            onClick={handleSubmit}
            disabled={disinterest.isPending}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
