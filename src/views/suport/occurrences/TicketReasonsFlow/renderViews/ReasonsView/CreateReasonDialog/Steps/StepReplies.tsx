import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import { ReplyReason } from "@/interfaces/TicketData";
import { Checkbox } from "@/components/ui/checkbox";

interface StepRepliesProps {
  replies: ReplyWithActions[];
  onChange: (replies: ReplyWithActions[]) => void;
  onNext: () => void;
  onBack: () => void;
}

// interface ReplyWithActions extends ReplyReason {
//   actions: any[];
// }
interface ReplyWithActions extends Omit<ReplyReason, "reason_id"> {
  reason_id?: number;
  actions: any[];
}


export function StepReplies({
  replies,
  onChange,
  onBack,
  onNext,
}: StepRepliesProps) {
  const addReply = () => {
    const updated = [
      ...replies,
      { reason_id: 0, reply: "", comment: false, actions: [] },
    ];
    onChange(updated);
  };

  const updateReply = <K extends keyof ReplyWithActions>(
    index: number,
    field: K,
    value: ReplyWithActions[K]
  ) => {
    const updated = [...replies];
    updated[index][field] = value;
    onChange(updated);
  };

  const removeReply = (index: number) => {
    const updated = replies.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {replies.map((r, i) => (
        <div
          key={i}
          className="border border-l-3 border-l-primary p-3 rounded-md space-y-3"
        >
          <div className="flex items-center justify-between">
            <Label className="font-medium">{i + 1}º Reply</Label>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeReply(i)}
              className="text-destructive hover:text-destructive"
            >
              <Trash size={16} />
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={r.reply}
              onChange={(e) => updateReply(i, "reply", e.target.value)}
              placeholder="Título do seu reply"
            />

            <div className="flex items-center gap-2">
              <Checkbox
                id={`comment-${i}`}
                checked={r.comment}
                onCheckedChange={(checked) =>
                  updateReply(i, "comment", Boolean(checked))
                }
              />
              <Label>Precisa de comentário para a finalizar?</Label>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addReply}>
        + Adicionar Reply
      </Button>

      <div className="flex justify-between mt-10">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>

        <Button
          onClick={onNext}
          disabled={
            replies.length === 0 || replies.some((r) => !r.reply.trim())
          }
        >
          Avançar
        </Button>
      </div>
    </div>
  );
}
