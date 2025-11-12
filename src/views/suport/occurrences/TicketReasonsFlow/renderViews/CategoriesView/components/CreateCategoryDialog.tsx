import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useCreateReasonCategory } from "@/services/Tickets/useReasonCategories";
import { ReasonCategory } from "@/interfaces/TicketData";

export function CreateCategoryDialog() {
  const createCategory = useCreateReasonCategory();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<ReasonCategory, "id">>({
    type: "",
    description: "",
  });

  const handleChange = (field: keyof Omit<ReasonCategory, "id">, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.type) {
      toast.warning("O campo Categoria é obrigatório.");
      return;
    }

    try {
      await createCategory.mutateAsync(form);
      setOpen(false);
      setForm({ type: "", description: "" });
      toast.success("Categoria criada com sucesso!");
    } catch {
      toast.error("Erro ao criar categoria.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-12 h-10">
          <Plus size={18} color="#fff" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Categoria</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="mb-2 mt-6">Categoria</Label>
            <Input
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              placeholder="Nome da categoria"
            />
          </div>

          <div>
            <Label className="mb-2 mt-6">Descrição</Label>
            <Input
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Descrição opcional"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Criar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
