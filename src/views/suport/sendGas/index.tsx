import { useState } from "react";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SendGas() {
  const [ticket, setTicket] = useState("");
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("");

  const handleReset = () => {
    setTicket("");
    setAddress("");
    setNetwork("");
  };

  const handleSubmit = () => {
    console.log({ ticket, address, network });
  };

  return (
    <SidebarLayout
      breadcrumb={[{ label: "Suporte", href: "clients" }]}
      current="Enviar GAS"
    >
      <div className="flex flex-1 flex-col max-h-screen overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Enviar GAS para cliente</CardTitle>
              <CardDescription>
                Faça o envio de GAS para a network do cliente escolhido.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Input
                type="text"
                name="ticket"
                placeholder="Ticket"
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
              />

              <Input
                type="text"
                name="address"
                placeholder="Endereço"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger>
                  <SelectValue placeholder="Rede (Network)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Polygon">
                    <div className="flex items-center gap-2">
                      <img src="/polygon.png" alt="polygon" className="w-5 h-5" />
                      Polygon
                    </div>
                  </SelectItem>
                  <SelectItem value="Liquid">
                    <div className="flex items-center gap-2">
                      <img src="/liquid.png" alt="liquid" className="w-5 h-5" />
                      Liquid
                    </div>
                  </SelectItem>
                  <SelectItem value="Bitcoin">
                    <div className="flex items-center gap-2">
                      <img src="/bitcoin.png" alt="bitcoin" className="w-5 h-5" />
                      Bitcoin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleReset}>
                Cancelar
              </Button>
              <Button className="bg-green-500 text-white" onClick={handleSubmit}>
                Enviar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
