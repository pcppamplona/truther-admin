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
import { useRetryKyc } from "@/services/clients/kyc/useRetryKyc";

interface Props {
  document: string;
  trigger: React.ReactNode;
}

export function RetryKycDialog({ document, trigger }: Props) {
  const retryKyc = useRetryKyc();

  const [open, setOpen] = useState(false);
  const [internalComent, setInternalComent] = useState("");

  const handleSubmit = () => {
    retryKyc.mutate(
      {
        document,
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
          <DialogTitle>Retry KYC</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
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
            className="bg-primary"
            onClick={handleSubmit}
            disabled={retryKyc.isPending}
          >
            Confirmar Retry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
