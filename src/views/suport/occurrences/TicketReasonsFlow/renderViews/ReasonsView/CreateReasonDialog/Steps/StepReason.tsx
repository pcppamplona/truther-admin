import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Group, groupHierarchy } from "@/interfaces/TicketData";
import { useAllReasonCategories } from "@/services/Tickets/useReasonCategories";

interface StepReasonProps {
  onChange: (field: any, value: any) => void;
  onNext: () => void;
}

export function StepReason({ onChange, onNext }: StepReasonProps) {
  const { data: categories = [] } = useAllReasonCategories();

  const [form, setForm] = useState({
    category_id: "",
    type: "",
    reason: "",
    expired_at: "",
    description: "",
    type_recipient: "USER",
    recipient: "",
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "type_recipient") {
        if (value === "ALL") updated.recipient = "N1";
        else if (value === "USER") updated.recipient = "USER";
        else updated.recipient = "";
      }

      onChange(field, value);
      if (field === "type_recipient") onChange("recipient", updated.recipient);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 mt-6">Categoria</Label>
        <Select
          value={form.category_id}
          onValueChange={(v) => handleChange("category_id", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 mt-6">Tipo</Label>
        <Input
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value)}
          placeholder="Ex: Novo fluxo"
        />
      </div>

      <div>
        <Label className="mb-2 mt-6">Reason</Label>
        <Input
          value={form.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          placeholder="Título do reason"
        />
      </div>

      <div>
        <Label className="mb-2 mt-6">Tempo de expiração (Horas)</Label>
        <Select
          value={String(form.expired_at)}
          onValueChange={(v) => handleChange("expired_at", parseInt(v))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione as horas" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((hour) => (
              <SelectItem key={hour} value={String(hour)}>
                {hour} hora{hour > 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 mt-6">Descrição</Label>
        <Textarea
          placeholder="Escreva seu comentário aqui..."
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="min-h-[60px] whitespace-pre-wrap break-words resize-none"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label className="mb-2 mt-6">Tipo de Destinatário</Label>
          <Select
            value={form.type_recipient}
            onValueChange={(v) => handleChange("type_recipient", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">Usuário</SelectItem>
              <SelectItem value="GROUP">Grupo</SelectItem>
              <SelectItem value="ALL">Todos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {form.type_recipient === "GROUP" && (
          <div>
            <Label className="mb-2 mt-6">Destinatário (Grupo)</Label>
            <Select
              value={form.recipient}
              onValueChange={(v) => handleChange("recipient", v)}
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
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext}>Avançar</Button>
      </div>
    </div>
  );
}
