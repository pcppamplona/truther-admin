import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { toast } from "sonner";

import { useUpdateReasonCategory } from "@/services/Tickets/useReasonCategories";
import { ReasonCategory } from "@/interfaces/TicketData";

interface UpdateCategoryDialogProps {
  category: ReasonCategory;
}

export function UpdateCategoryDialog({ category }: UpdateCategoryDialogProps) {
  const updateCategory = useUpdateReasonCategory();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(category.description || "");

  const handleSubmit = async () => {
    try {
      await updateCategory.mutateAsync({ id: category.id!, payload: { description } });
      setOpen(false);
      toast.success("Categoria atualizada com sucesso!");
    } catch {
      toast.error("Erro ao atualizar categoria.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-background">
          <Edit />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogDescription>Atualizar descrição da Categoria</DialogDescription>
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="mb-2 mt-6">Categoria</Label>
            <Input value={category.type} disabled />
          </div>

          <div>
            <Label className="mb-2 mt-6">Descrição</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Atualizar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
