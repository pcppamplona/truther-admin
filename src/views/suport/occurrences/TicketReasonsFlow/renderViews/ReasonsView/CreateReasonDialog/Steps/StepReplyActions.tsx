import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionTypes } from "@/services/Tickets/useActionTypes";
import { Group, ReplyAction } from "@/interfaces/TicketData";
import { Plus, Trash2 } from "lucide-react";

interface StepReplyActionsProps {
  reply: { reply: string; comment: boolean; actions: ReplyAction[] };
  replyIndex: number;
  onUpdateActions: (index: number, actions: ReplyAction[]) => void;
  onBack?: () => void;
  onNext?: () => void;
  hideNavigation?: boolean;
}

export function StepReplyActions({
  reply,
  replyIndex,
  onUpdateActions,
  onBack,
  onNext,
  hideNavigation,
}: StepReplyActionsProps) {
  const { data: actionsType } = useActionTypes();
  const [actions, setActions] = useState<ReplyAction[]>(reply.actions || []);

  const addAction = () =>
    setActions([...actions, { action_type_id: 0 } as ReplyAction]);

  const updateAction = (i: number, field: string, value: any) => {
    const updated = [...actions];
    (updated[i] as any)[field] = value;
    setActions(updated);
  };

    const removeAction = (i: number) =>
    setActions(actions.filter((_, index) => index !== i));


  useEffect(() => {
    onUpdateActions(replyIndex, actions);
  }, [actions]);

  return (
    <div className="space-y-5 mt-3">
      {actions.map((a, i) => (
        <div
          key={i}
          className="border border-l-6 border-muted p-4 rounded-md space-y-3"
        >
          <div className="flex justify-between items-center">
          <Label className="text-sm">{i + 1}º Ação para este reply</Label>
           <Button
              variant="ghost"
              size="icon"
              onClick={() => removeAction(i)}
              className="text-destructive"
              >
              <Trash2 size={16} />
            </Button>
              </div>
          <Select
            value={a.action_type_id ? String(a.action_type_id) : ""}
            onValueChange={(v) => updateAction(i, "action_type_id", Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a ação" />
            </SelectTrigger>
            <SelectContent>
              {actionsType?.map((act) => (
                <SelectItem key={act.id} value={String(act.id)}>
                  {act.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {a.action_type_id === 1 && (
            <Input
              placeholder="E-mail"
              value={a.data_email ?? ""}
              onChange={(e) => updateAction(i, "data_email", e.target.value)}
            />
          )}

          {a.action_type_id === 2 && (
            <Input
              placeholder="Reason ID para novo ticket"
              type="number"
              value={a.data_new_ticket_reason_id ?? ""}
              onChange={(e) =>
                updateAction(
                  i,
                  "data_new_ticket_reason_id",
                  Number(e.target.value)
                )
              }
            />
          )}

          {a.action_type_id === 3 && (
            <Select
              value={a.data_new_ticket_assign_to_group ?? ""}
              onValueChange={(v) =>
                updateAction(i, "data_new_ticket_assign_to_group", v as Group)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N1">N1</SelectItem>
                <SelectItem value="N2">N2</SelectItem>
                <SelectItem value="N3">N3</SelectItem>
                <SelectItem value="PRODUTO">PRODUTO</SelectItem>
                <SelectItem value="MKT">MKT</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      ))}

      <div className="w-full flex justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-10 h-10 rounded-full" onClick={addAction}>
                <Plus size={16} color="#fff" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adicionar uma ação</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {!hideNavigation && (
        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={onBack}>
            Voltar
          </Button>
          <Button
            onClick={() => {
              onUpdateActions(replyIndex, actions);
              onNext?.();
            }}
          >
            Finalizar
          </Button>
        </div>
      )}
    </div>
  );
}
