import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Props {
    network: string;
    userName: string | undefined;
}

export function WalletSendGas({ network, userName }: Props) {
  const handleSubmit = async () => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg">
          Enviar GAS
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar gas para {userName}</DialogTitle>
          <DialogDescription>
            Enviar gas para a network selecionada
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input type="text" name="ticket" placeholder="Ticket" />

          <Input type="text" name="address" placeholder="Endereço" />

          <Input type="text" name="network" value={network} disabled/>
        </div>

        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSubmit} className="bg-green-500 text-white">
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
