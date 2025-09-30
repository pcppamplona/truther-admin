import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  getTicketCategories,
  useTicketReasonsByCategory,
} from "@/services/Tickets/useReasons";
import { Reason } from "@/interfaces/TicketData";

interface Category {
  id: number;
  type: string;
}

interface StepCategoryProps {
  onChange: (field: any, value: any) => void;
  onNext: () => void;
}

export function StepCategory({ onChange, onNext }: StepCategoryProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const { data: ticketReasons, isLoading: reasonsLoading } = useTicketReasonsByCategory(selectedCategoryId ?? 0);

  useEffect(() => {
    getTicketCategories().then(setCategories);
  }, []);

  const handleSelectCategory = (value: string) => {
    const categoryId = Number(value);
    setSelectedCategoryId(categoryId);

    onChange("reason_id", undefined);
    onChange("category_id", categoryId);
  };

  return (
    <div className="space-y-4">
      <Select onValueChange={handleSelectCategory}>
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

      {selectedCategoryId && (
        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Motivo do Ticket
          </label>
          <Select
            onValueChange={(value) => onChange("reason_id", Number(value))}
            disabled={reasonsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o motivo" />
            </SelectTrigger>
            <SelectContent>
              {ticketReasons?.map((reason: Reason) => (
                <SelectItem key={reason.id} value={String(reason.id)}>
                  {reason.reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!selectedCategoryId || !ticketReasons?.length}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
