import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { useCreateReply } from "@/services/Tickets/useReplies";
import { useAllTicketReasons } from "@/services/Tickets/useReasons";
import { useActionTypes } from "@/services/Tickets/useActionTypes";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateReplyAction } from "@/services/Tickets/useReplyActions";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Group, groupHierarchy } from "@/interfaces/TicketData";

export default function CreateReplyReasonDialog() {
  const [open, setOpen] = useState(false);
  const [reasonId, setReasonId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [comment, setComment] = useState(false);
  const [actions, setActions] = useState<
    {
      action_type_id: number;
      data_email: string | null;
      data_new_ticket_reason_id: number | null;
      data_new_ticket_assign_to_group: string | null;
    }[]
  >([]);

  const [newActionTypeId, setNewActionTypeId] = useState<number | null>(null);
  const [showActionSelect, setShowActionSelect] = useState(false);

  const createReply = useCreateReply();
  const { data: reasons } = useAllTicketReasons();
  const { data: actionTypes } = useActionTypes();
  const createReplyAction = useCreateReplyAction();

  const handleAddAction = () => {
    if (!newActionTypeId) return;
    setActions((prev) => [
      ...prev,
      {
        action_type_id: newActionTypeId,
        data_email: null,
        data_new_ticket_reason_id: null,
        data_new_ticket_assign_to_group: null,
      },
    ]);
    setNewActionTypeId(null);
    setShowActionSelect(false);
  };

  const handleRemoveAction = (index: number) => {
    setActions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeField = (
    index: number,
    field: keyof (typeof actions)[number],
    value: any
  ) => {
    setActions((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  };

  const handleSubmit = async () => {
    if (!reasonId || replyText.trim() === "") return;

    try {
      const newReply = await createReply.mutateAsync({
        reason_id: reasonId,
        reply: replyText,
        comment,
      });

      for (const action of actions) {
        await createReplyAction.mutateAsync({
          reply_id: newReply.id!,
          ...action,
        });
      }

      toast.success("Novo reply adicionado!", {
        description: `Reply vinculado ao reason ${reasonId}`,
        duration: 3000,
      });

      setOpen(false);
      setReasonId(null);
      setReplyText("");
      setComment(false);
      setActions([]);
    } catch (err) {
      console.error("Erro ao criar reply:", err);
      toast.error("Não foi possível criar o reply!", {
        description: "Falha na criação do reply ou actions.",
        duration: 3000,
      });
    }
  };

  const renderActionFields = (a: any, i: number) => {
    const typeName = actionTypes?.find((t) => t.id === a.action_type_id)?.type;

    switch (typeName?.toLowerCase()) {
      case "enviar email":
      case "send_email":
        return (
          <div className="space-y-2">
            <Label className="mb-2 mt-6">Email do destinatário</Label>
            <Input
              placeholder="ex: cliente@empresa.com"
              value={a.data_email ?? ""}
              onChange={(e) =>
                handleChangeField(i, "data_email", e.target.value)
              }
            />
          </div>
        );

      case "criar novo ticket":
      case "new_ticket":
        return (
          <div className="space-y-3">
            <div>
              <Label className="mb-2 mt-6">Reason do novo ticket</Label>
              <Select
                value={
                  a.data_new_ticket_reason_id
                    ? String(a.data_new_ticket_reason_id)
                    : ""
                }
                onValueChange={(v) =>
                  handleChangeField(i, "data_new_ticket_reason_id", Number(v))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um reason" />
                </SelectTrigger>
                <SelectContent>
                  {reasons?.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 mt-6">Grupo de destino</Label>
              <Select
                value={a.data_new_ticket_assign_to_group ?? ""}
                onValueChange={(value) =>
                  handleChangeField(
                    i,
                    "data_new_ticket_assign_to_group",
                    value as Group
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(groupHierarchy) as Group[]).map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return (
          <p className="text-muted-foreground text-sm">
            Nenhum campo adicional necessário.
          </p>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-14 h-12">
          <Plus size={18} color="#fff" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] w-full overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>Novo Reply</DialogTitle>
          <DialogDescription>
            Adicione um novo reply vinculado a um motivo existente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          <Label>Reason</Label>
          <Select
            value={reasonId ? String(reasonId) : ""}
            onValueChange={(v) => setReasonId(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um reason" />
            </SelectTrigger>
            <SelectContent>
              {reasons?.map((r) => (
                <SelectItem key={r.id} value={String(r.id)}>
                  {r.reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 mt-4">
          <Label>Texto do Reply</Label>
          <Input
            placeholder="Digite o texto da resposta"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Checkbox
            id="comment"
            checked={comment}
            onCheckedChange={(checked) => setComment(!!checked)}
          />
          <Label htmlFor="comment">Precisa de comentário</Label>
        </div>

        {actions.map((a, i) => (
          <div
            key={i}
            className="border border-l-4 border-l-primary p-3 mt-6 rounded-md space-y-3"
          >
            <div className="flex items-center justify-between">
              <Label className="font-medium">
                Ação {i + 1} —{" "}
                {actionTypes?.find((t) => t.id === a.action_type_id)?.type}
              </Label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveAction(i)}
                className="text-destructive hover:text-destructive"
              >
                <Trash size={16} />
              </Button>
            </div>

            {renderActionFields(a, i)}
          </div>
        ))}

        <div className="flex items-center gap-2 mt-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  className="w-12 h-12"
                  onClick={() => setShowActionSelect((v) => !v)}
                >
                  <Plus size={18} color="#fff" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Adicionar Ação</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {showActionSelect && (
            <Select
              value={newActionTypeId ? String(newActionTypeId) : ""}
              onValueChange={(v) => setNewActionTypeId(Number(v))}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Selecione uma ação" />
              </SelectTrigger>
              <SelectContent>
                {actionTypes?.map((act) => (
                  <SelectItem key={act.id} value={String(act.id)}>
                    {act.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {showActionSelect && (
            <Button variant="outline" onClick={handleAddAction}>
              Adicionar
            </Button>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={createReply.isPending}>
            {createReply.isPending ? "Salvando..." : "Salvar Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
