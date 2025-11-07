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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Props {
  network: string;
  userName: string | undefined;
}

export function WalletSendGas({ network, userName }: Props) {
  const handleSubmit = async () => {};

  return (
    <Dialog>
       <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button className="w-12 h-12 text-white">
                <Send />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enviar GAS</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center gap-2">
          <img
            src={
              {
                Polygon: "/polygon.png",
                Liquid: "/liquid.png",
                Bitcoin: "/bitcoin.png",
              }[network] || "/default.png"
            }
            alt={network}
            className="w-10 h-10 object-contain"
          />
          <div>
            <DialogTitle>Enviar GAS para {userName}</DialogTitle>
            <DialogDescription>
              Enviar gas para a network '{network}' selecionada
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <Input type="text" name="ticket" placeholder="Ticket" />

          <Input type="text" name="address" placeholder="Endereço" />

          <Input type="text" name="network" value={network} disabled />
        </div>

        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSubmit} className="bg-primary text-white">
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
