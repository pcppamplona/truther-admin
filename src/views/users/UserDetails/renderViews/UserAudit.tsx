import { UserData } from "@/interfaces/UserData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function UserAudit({ user }: { user: UserData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity /> Auditoria
        </CardTitle>
        <CardDescription>
          Registro das atividades e alterações associadas a este usuário.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Em breve: histórico de ações e logs vinculados ao usuário <strong>{user.name}</strong>.
        </p>
      </CardContent>
    </Card>
  );
}