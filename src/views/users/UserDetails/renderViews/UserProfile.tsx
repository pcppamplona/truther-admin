import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { UserData } from "@/interfaces/UserData";
import { dateFormat, timeFormat } from "@/lib/formatters";
import { getRoleNameById } from "@/lib/utils";
import { Info } from "@/components/info";

interface Props {
  user: UserData;
}

export function UserProfile({ user }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              <User /> Informações Pessoais
            </CardTitle>
            <CardDescription>
              Dados de identificação e registro vinculados ao usuário.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Info label="ID" value={user.id} />
            <Info label="UUID" value={user.uuid} />
            <Info label="Nome" value={user.name} />
            <Info label="Role" value={getRoleNameById(user.role_id)} />
            <Info label="E-mail" value={user.username} />

            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Status</span>
              <span
                className={`font-medium ${
                  user.active ? "text-green-600" : "text-red-600"
                }`}
              >
                {user.active ? "Ativo" : "Inativo"}
              </span>
            </div>

            <Info label="Data de Criação" value={dateFormat(user.created_at)} />
            <Info label="Hora" value={timeFormat(user.created_at)} />
            <Info label="Tipo de Autenticação" value={user.type_auth} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
