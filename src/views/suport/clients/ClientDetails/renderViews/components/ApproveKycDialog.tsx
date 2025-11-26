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

export function ApproveKycDialog({ document, trigger }: Props) {
  const decisionKyc = useDecisionKyc();
  const [open, setOpen] = useState(false);
  const [levelKyc, setLevelKyc] = useState("0");
  const [internalComent, setInternalComent] = useState("");

  const handleSubmit = () => {
    decisionKyc.mutate(
      {
        document,
        decision: true,
        levelKyc,
        internalComent: internalComent || null,
      },
      {
        onSuccess: () => setOpen(false),
      }
    );
    console.log("teste", {
      document,
      decision: true,
      levelKyc,
      internalComent: internalComent || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Aprovar KYC</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Nível de risco</label>
            <Select
              value={levelKyc}
              onValueChange={(value) => setLevelKyc(value)}
            >
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
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            className="bg-primary"
            onClick={handleSubmit}
            disabled={decisionKyc.isPending}
          >
            Confirmar aprovação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
