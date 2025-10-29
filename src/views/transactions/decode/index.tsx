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
import { Textarea } from "@/components/ui/textarea";

export default function Decode() {
  const [code, setCode] = useState("");

  const handleReset = () => {
    setCode("");
  };

  const handleSubmit = () => {};

  return (
    <SidebarLayout
      breadcrumb={[{ label: "Suporte", href: "/clients" }]}
      current="Decodificar"
    >
      <div className="flex flex-1 flex-col max-h-screen overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Decodificar</CardTitle>
              <CardDescription>
                Cole o código cripritografado, para fazer a descodificação.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Textarea
                placeholder="Conteúdo"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleReset}>
                Cancelar
              </Button>
              <Button
                className="bg-primary text-white"
                onClick={handleSubmit}
              >
                Decodificar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
