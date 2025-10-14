import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReplyReason } from "@/interfaces/TicketData";

interface StepRepliesProps {
  onChange: (field: any, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ReplyWithActions extends ReplyReason {
  actions: any[];
}

export function StepReplies({ onChange, onBack, onNext }: StepRepliesProps) {
  // const [replies, setReplies] = useState<
  //   { reply: string; comment: boolean; actions: any[] }[]
  // >([]);

  // const addReply = () => {
  //   setReplies([...replies, { reply: "", comment: false, actions: [] }]);
  // };

  // const updateReply = (index: number, field: string, value: any) => {
  //   const updated = [...replies];
  //   updated[index][field] = value;
  //   setReplies(updated);
  //   onChange("replies", updated);
  // };
  const [replies, setReplies] = useState<ReplyWithActions[]>([]);

  const addReply = () => {
    setReplies((prev) => [
      ...prev,
      { reason_id: 0, reply: "", comment: false, actions: [] },
    ]);
  };

  const updateReply = <K extends keyof ReplyWithActions>(
    index: number,
    field: K,
    value: ReplyWithActions[K]
  ) => {
    const updated = [...replies];
    updated[index][field] = value;
    setReplies(updated);
    onChange("replies", updated);
  };

  return (
    <div className="space-y-4">
      {replies.map((r, i) => (
        <div key={i} className="border p-3 rounded-md space-y-2">
          <Label className="mb-2">Reply #{i + 1}</Label>

          <Label className="mb-2 mt-6">Titulo</Label>
          <Input
            value={r.reply}
            onChange={(e) => updateReply(i, "reply", e.target.value)}
            placeholder="Titulo do seu reply"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={r.comment}
              onChange={(e) => updateReply(i, "comment", e.target.checked)}
            />
            <Label>Gera comentário</Label>
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
        <Button onClick={onNext}>Avançar</Button>
      </div>
    </div>
  );
}
