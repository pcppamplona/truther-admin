import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllUsers } from "@/services/users/useUsers";
import { Group, TicketTyped, TypeRecipient } from "@/interfaces/TicketData";
import { getInitials } from "@/lib/formatters";
import { ChevronRight } from "lucide-react";
import { useTicketReasonsById } from "@/services/Tickets/useReasons";

interface StepRecipientProps {
  onChange: (field: keyof TicketTyped, value: any) => void;
  onBack: () => void;
  onSubmit: () => void;
  reasonId: number;
}

export function StepRecipient({
  onChange,
  onBack,
  onSubmit,
  reasonId,
}: StepRecipientProps) {
  const { data: reasonData, isLoading } = useTicketReasonsById(reasonId);

  const { data: usersData } = useAllUsers();
  const users = usersData ?? [];

  const [reasonTypeRecipient, setReasonTypeRecipient] =
    useState<TypeRecipient>();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedTypeAll, setSelectedTypeAll] = useState<"USER" | "GROUP" | "">(
    ""
  );

  useEffect(() => {
    if (!reasonData) return;

    const type = reasonData.type_recipient as TypeRecipient;
    setReasonTypeRecipient(type);
    onChange("reason_id", reasonData.id);

    if (type === "GROUP") {
      onChange("assigned_group", reasonData.recipient as Group);
      onChange("assigned_user", null);
    }
  }, [reasonData]);

  useEffect(() => {
    if (!selectedUserId) return;

    const selectedUser = users.find((u) => u.id === selectedUserId);
    if (!selectedUser) return;

    onChange("assigned_user", selectedUser.id);
    onChange("assigned_group", selectedUser.groupLevel as Group);
  }, [selectedUserId]);

  useEffect(() => {
    if (!selectedGroup) return;

    onChange("assigned_group", selectedGroup);
    onChange("assigned_user", null);
  }, [selectedGroup]);

  if (isLoading) return <div>Carregando motivo...</div>;

  return (
    <div className="space-y-4">
      {/* GROUP */}
      {reasonTypeRecipient === "GROUP" && (
        <div className="p-4 border rounded bg-muted">
          <p>
            O ticket será direcionado automaticamente para o grupo:{" "}
            <strong>{reasonData?.recipient}</strong>
          </p>
        </div>
      )}

      {/* USER */}
      {reasonTypeRecipient === "USER" && (
        <div className="p-4 rounded border bg-muted space-y-2">
          <p className="text-sm">Selecione o usuário destinatário:</p>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {users.map((user) => {
              const isSelected = selectedUserId === user.id;

              return (
                <div
                  key={user.id}
                  className={`flex items-center rounded-lg p-2 cursor-pointer transition hover:bg-muted-foreground/10 ${
                    isSelected ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setSelectedGroup(user.groupLevel as Group);
                  }}
                >
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full ${
                      isSelected
                        ? "bg-white text-primary"
                        : "bg-primary text-white"
                    }`}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="flex flex-col overflow-hidden ml-4">
                    <span className="truncate font-medium text-sm">
                      {user.name}
                    </span>
                    <span className="truncate text-xs">{user.username}</span>
                  </div>
                  <ChevronRight className="ml-auto size-4" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ALL */}
      {reasonTypeRecipient === "ALL" && (
        <div className="p-4 border rounded bg-muted space-y-4">
          <p>Escolha se deseja direcionar para um grupo ou usuário:</p>

          <Select
            onValueChange={(value) =>
              setSelectedTypeAll(value as "GROUP" | "USER")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar tipo de destinatário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">Usuário</SelectItem>
              <SelectItem value="GROUP">Grupo</SelectItem>
            </SelectContent>
          </Select>

          {selectedTypeAll === "USER" && (
            <div className="p-4 rounded border bg-muted space-y-2">
              <p className="text-sm">Selecione o usuário destinatário:</p>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {users.map((user) => {
                  const isSelected = selectedUserId === user.id;

                  return (
                    <div
                      key={user.id}
                      className={`flex items-center rounded-lg p-2 cursor-pointer transition hover:bg-muted-foreground/10 ${
                        isSelected ? "bg-primary text-white" : ""
                      }`}
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setSelectedGroup(user.groupLevel as Group);
                        onChange("assigned_user", user.id);
                        onChange("assigned_group", user.groupLevel as Group);
                      }}
                    >
                      <div
                        className={`flex items-center justify-center h-10 w-10 rounded-full ${
                          isSelected
                            ? "bg-white text-primary"
                            : "bg-primary text-white"
                        }`}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="flex flex-col overflow-hidden ml-4">
                        <span className="truncate font-medium text-sm">
                          {user.name}
                        </span>
                        <span className="truncate text-xs">
                          {user.username}
                        </span>
                      </div>
                      <ChevronRight className="ml-auto size-4" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedTypeAll === "GROUP" && (
            <Select onValueChange={(value) => setSelectedGroup(value as Group)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
              <SelectContent>
                {["N1", "N2", "N3", "PRODUTO", "MKT", "ADMIN"].map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button
          variant="default"
          onClick={onSubmit}
          disabled={
            (reasonTypeRecipient === "USER" && !selectedUserId) ||
            (reasonTypeRecipient === "ALL" && selectedTypeAll === "") ||
            (reasonTypeRecipient === "ALL" &&
              selectedTypeAll === "USER" &&
              !selectedUserId) ||
            (reasonTypeRecipient === "ALL" &&
              selectedTypeAll === "GROUP" &&
              !selectedGroup)
          }
        >
          Cadastrar
        </Button>
      </div>
    </div>
  );
}
