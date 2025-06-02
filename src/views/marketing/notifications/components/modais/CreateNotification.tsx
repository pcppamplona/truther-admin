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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { NotificationData } from "@/interfaces/notification-data";
import { Plus } from "lucide-react";
import { useState } from "react";

export function CreateNotification() {
  const [notificationData, ] =
    useState<Partial<NotificationData>>();
  const handleSubmit = async () => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg">
          <Plus size={16} className="mr-2" />
          Nova Notificação
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar notificação</DialogTitle>
          <DialogDescription>
            Adicione uma nova notificação, não esqueça de programá-la.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Título"
            value={notificationData?.title}
          />

          <Textarea
            placeholder="Conteúdo da notificação"
            value={notificationData?.message}
          />

          <Select
            // onValueChange={() => handleChange}
            defaultValue={notificationData?.categoty}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo da categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OTHERS">OTHERS</SelectItem>
              <SelectItem value="ALERT">ALERT</SelectItem>
              <SelectItem value="NEW">NEW</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
              <SelectItem value="VRL">VRL</SelectItem>
              <SelectItem value="WARNING">WARNING</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSubmit} className="bg-green-500 text-white">
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
