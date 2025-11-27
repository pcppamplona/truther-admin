import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tooltip, TooltipProvider, TooltipContent } from "@/components/ui/tooltip";
import {
  useDeleteUserBlockLevel,
  useGetBlockLevels,
  useSetUserBlockLevel,
} from "@/services/clients/block-level/useBlockLevel";
import { ShieldAlert } from "lucide-react";

interface Props {
  userId: number;
}

export function BlockLevelDialog({ userId }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState("none");

  const { data: blockLevels, refetch } = useGetBlockLevels();
  const setBlockLevel = useSetUserBlockLevel();
  const deleteBlockLevel = useDeleteUserBlockLevel();

  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  const handleSubmit = () => {
    if (!userId) return;

    if (selectedTag === "none") {
      deleteBlockLevel.mutate(
        { user_id: String(userId) },
        { onSuccess: () => setOpen(false) }
      );
      return;
    }

    setBlockLevel.mutate(
      {
        user_id: String(userId),
        tag: selectedTag,
        payload: {},
      },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
      {/* BOTÃO + TOOLTIP (FUNCIONA) */}
      <TooltipProvider>
        <Tooltip>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-10 w-10">
              <ShieldAlert className="h-4 w-4" />
            </Button>
          </DialogTrigger>

          <TooltipContent side="top">
            <p>Gerenciar Block Level</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Block Level</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <label className="text-sm font-medium">Block level</label>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>

              {blockLevels?.map((item) => (
                <SelectItem key={item.tag} value={item.tag}>
                  {item.tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>

          <Button
            className="bg-primary"
            onClick={handleSubmit}
            disabled={setBlockLevel.isPending || deleteBlockLevel.isPending}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
