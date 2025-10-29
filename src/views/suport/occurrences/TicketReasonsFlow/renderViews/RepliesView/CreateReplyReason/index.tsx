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
import { ListTree, Plus, Trash } from "lucide-react";
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
      data_new_ticket_assign_role: number | null;
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
        data_new_ticket_assign_role: null,
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
          <div className="flex flex-row justify-between gap-4">
            <div className="flex-1">
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
                <SelectTrigger className="w-full">
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

            <div className="flex-1">
              <Label className="mb-2 mt-6">Role de destino</Label>
              <Select
                value={
                  a.data_new_ticket_assign_role
                    ? String(a.data_new_ticket_assign_role)
                    : ""
                }
                onValueChange={(value) => {
                  handleChangeField(
                    i,
                    "data_new_ticket_assign_role",
                    Number(value)
                  );
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(groupHierarchy) as Group[]).map((g) => (
                    <SelectItem key={g} value={String(groupHierarchy[g])}>
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

      {/* <DialogContent className="max-h-[80vh] w-full overflow-y-auto p-6">
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
            <SelectTrigger className="w-full">
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

        <div className="flex flex-col mt-4 border border-border rounded-md p-3">
          <div className="flex justify-between items-center">
            <Label className="font-medium">
              <ListTree />
              Ações para esse Reply
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    onClick={() => setShowActionSelect((v) => !v)}
                  >
                    <Plus size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Adicionar Ação</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {showActionSelect && (
            <div className="flex gap-2 items-center mt-4">
              <Select
                value={newActionTypeId ? String(newActionTypeId) : ""}
                onValueChange={(v) => setNewActionTypeId(Number(v))}
              >
                <SelectTrigger className="w-full">
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
              <Button
                variant="outline"
                onClick={handleAddAction}
                disabled={!newActionTypeId}
              >
                Confirmar
              </Button>
            </div>
          )}
        </div>

        {actions.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4 border rounded-md mt-4">
            Nenhuma ação adicionada para este reply.
          </div>
        ) : (
          actions.map((a, i) => (
            <div
              key={i}
              className="border border-border border-l-primary border-l-3 p-4 rounded-md shadow-sm bg-background mt-4"
            >
              <div className="flex justify-between items-center">
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
              <div className="space-y-3">{renderActionFields(a, i)}</div>
            </div>
          ))
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={createReply.isPending}>
            {createReply.isPending ? "Salvando..." : "Salvar Reply"}
          </Button>
        </DialogFooter>
      </DialogContent> */}
      <DialogContent className="max-h-[80vh] w-full overflow-y-auto p-6 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Novo Reply
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Adicione um novo reply vinculado a um motivo existente.
          </DialogDescription>
        </DialogHeader>

        {/* Reason */}
        <div className="space-y-2">
          <Label className="font-medium">Reason</Label>
          <Select
            value={reasonId ? String(reasonId) : ""}
            onValueChange={(v) => setReasonId(Number(v))}
          >
            <SelectTrigger className="w-full">
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

        {/* Texto do Reply */}
        <div className="space-y-2">
          <Label className="font-medium">Texto do Reply</Label>
          <Input
            placeholder="Digite o texto da resposta"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </div>

        {/* Checkbox Comentário */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="comment"
            checked={comment}
            onCheckedChange={(checked) => setComment(!!checked)}
          />
          <Label htmlFor="comment">Precisa de comentário</Label>
        </div>

        {/* Ações */}
        <div className="border border-border rounded-md p-4 space-y-4">
          <div className="flex justify-between items-center">
            <Label className="font-semibold flex items-center gap-2 text-sm">
              <ListTree size={16} />
              Ações para este Reply
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white hover:bg-primary/90"
                    onClick={() => setShowActionSelect((v) => !v)}
                  >
                    <Plus size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Adicionar Ação</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {showActionSelect && (
            <div className="flex gap-2 items-center">
              <Select
                value={newActionTypeId ? String(newActionTypeId) : ""}
                onValueChange={(v) => setNewActionTypeId(Number(v))}
              >
                <SelectTrigger className="w-full">
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
              <Button
                variant="outline"
                onClick={handleAddAction}
                disabled={!newActionTypeId}
              >
                Confirmar
              </Button>
            </div>
          )}

          {actions.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4 border rounded-md bg-muted/10">
              Nenhuma ação adicionada para este reply.
            </div>
          ) : (
            actions.map((a, i) => (
              <div
                key={i}
                className="border border-border border-l-primary border-l-4 p-4 rounded-md bg-background shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <Label className="font-medium text-sm">
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
                <div className="space-y-3">{renderActionFields(a, i)}</div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
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
