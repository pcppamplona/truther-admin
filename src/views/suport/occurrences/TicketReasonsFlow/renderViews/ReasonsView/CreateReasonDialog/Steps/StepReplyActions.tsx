import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionTypes } from "@/services/Tickets/useActionTypes";
import { Group, ReplyAction } from "@/interfaces/TicketData";

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

  useEffect(() => {
    onUpdateActions(replyIndex, actions);
  }, [actions]);

  return (
    <div className="space-y-4">
      {actions.map((a, i) => (
        <div
          key={i}
          className="border border-zinc-800 p-4 rounded-md space-y-3 bg-zinc-950/40"
        >
          <Label className="text-sm text-zinc-300">Ação para este reply</Label>
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

      <Button variant="secondary" onClick={addAction}>
        Adicionar ação
      </Button>

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
