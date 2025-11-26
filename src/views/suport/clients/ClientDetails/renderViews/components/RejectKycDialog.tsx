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
import { Input } from "@/components/ui/input";
import { useDecisionKyc } from "@/services/clients/kyc/useDecisionKyc";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  document: string;
  trigger: React.ReactNode;
}

export function RejectKycDialog({ document, trigger }: Props) {
  const decisionKyc = useDecisionKyc();

  const [open, setOpen] = useState(false);
  const [levelKyc, setLevelKyc] = useState("0");
  const [internalComent, setInternalComent] = useState("");

  const handleSubmit = () => {
    decisionKyc.mutate(
      {
        document,
        decision: false,
        levelKyc,
        internalComent: internalComent || null,
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
          <DialogTitle>Rejeitar KYC</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Nível de risco</label>
            <Select value={levelKyc} onValueChange={setLevelKyc}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o risco" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="0">0 - No risk</SelectItem>
                <SelectItem value="1">1 - Low risk</SelectItem>
                <SelectItem value="2">2 - Medium risk</SelectItem>
                <SelectItem value="3">3 - High risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Comentário interno</label>
            <Input
              value={internalComent}
              onChange={(e) => setInternalComent(e.target.value)}
              placeholder="Digite um comentário..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-destructive"
            onClick={handleSubmit}
            disabled={decisionKyc.isPending}
          >
            Confirmar rejeição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
