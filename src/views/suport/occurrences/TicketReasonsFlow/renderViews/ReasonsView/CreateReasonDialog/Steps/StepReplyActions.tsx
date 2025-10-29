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
import { ReplyAction, RoleId } from "@/interfaces/TicketData";
import { Plus, Trash2, Play } from "lucide-react";
import { useAllTicketReasons } from "@/services/Tickets/useReasons";

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
  const { data: reasons } = useAllTicketReasons();

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

  const handleChangeField = (
    index: number,
    field: keyof (typeof actions)[number],
    value: any
  ) => {
    setActions((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  };

  return (
    <div className="relative border-t border-border pt-6 mt-6">
      <div className="border border-l-3 border-l-primary rounded-lg p-4 shadow-sm">
        <div className="font-semibold text-sm text-zinc-200">
          <div className="flex flex-row items-center gap-2 mb-3">
            <Play size={15} />
            Reply {replyIndex + 1} -{" "}
            <span className="text-zinc-400">{reply.reply}</span>
          </div>

          <div className="space-y-5 my-4">
            {actions.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4 border rounded-md">
                Nenhuma ação adicionada para este reply.
              </div>
            ) : (
              actions.map((a, i) => (
                <div
                  key={i}
                  className="border border-l-6 border-muted p-4 rounded-md space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <Label className="text-sm">
                      {i + 1}º Ação para este reply
                    </Label>
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
                    onValueChange={(v) =>
                      updateAction(i, "action_type_id", Number(v))
                    }
                  >
                    <SelectTrigger className="w-full">
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
                    <div>
                      <Label className="mb-2 mt-6">Email do destinatário</Label>
                      <Input
                        placeholder="E-mail"
                        value={a.data_email ?? ""}
                        onChange={(e) =>
                          updateAction(i, "data_email", e.target.value)
                        }
                      />
                    </div>
                  )}

                  {a.action_type_id === 2 && (
                    <div className="flex flex-row justify-between gap-4">
                      <div className="flex-1">
                        <Label className="mb-2 mt-6">
                          Reason do novo ticket
                        </Label>
                        <Select
                          value={
                            a.data_new_ticket_reason_id
                              ? String(a.data_new_ticket_reason_id)
                              : ""
                          }
                          onValueChange={(v) =>
                            handleChangeField(
                              i,
                              "data_new_ticket_reason_id",
                              Number(v)
                            )
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
                          onValueChange={(v) => {
                            handleChangeField(
                              i,
                              "data_new_ticket_assign_role",
                              Number(v)
                            );
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o grupo" />
                          </SelectTrigger>
                          <SelectContent>
                            {RoleId.map((g) => (
                              <SelectItem key={g.id} value={g.id.toString()}>
                                {g.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center mt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={addAction}
                    className="w-8 h-8 rounded-full bg-primary hover:bg-primary-foreground text-white flex items-center justify-center shadow-md"
                  >
                    <Plus size={18} strokeWidth={2.5} />
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
      </div>
    </div>
  );
}
