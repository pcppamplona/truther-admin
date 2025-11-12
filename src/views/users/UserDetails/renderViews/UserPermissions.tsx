import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, ShieldUser } from "lucide-react";
import { UserData } from "@/interfaces/UserData";
import { useRolePermissions } from "@/services/permissions/useRolePermissions";
import { useUserPermissions } from "@/services/permissions/useUserPermissions";
import { PermissionsSkeleton } from "@/components/skeletons/skeletonPermission";
import { AddPermissionDialog } from "./components/AddPermissionDialog";

export function UserPermissions({ user }: { user: UserData }) {
  const { data: userPermissions = [], isLoading: loadingUser } = useUserPermissions(user.id);
  const { data: rolePermissions = [], isLoading: loadingRole } = useRolePermissions(user.role_id);

  console.log("userPermissions", userPermissions)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldUser /> Permissões do Usuário
            </CardTitle>
            <CardDescription>
              Lista de permissões atribuídas diretamente a este usuário.
            </CardDescription>
          </div>

          <AddPermissionDialog user={user} />
        </CardHeader>

        <CardContent>
          {loadingUser ? (
            <PermissionsSkeleton rows={6} />
          ) : userPermissions.length > 0 ? (
            <div className="border rounded-md divide-y divide-border">
              {userPermissions.map((perm) => (
                <div
                  key={perm.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {perm.id} — {perm.key_name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {perm.description ?? "Sem descrição"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma permissão associada a este usuário.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Permissões herdadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield /> Permissões da Role
          </CardTitle>
          <CardDescription>
            Permissões herdadas da função associada ao usuário.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loadingRole ? (
            <PermissionsSkeleton rows={6} />
          ) : rolePermissions.length > 0 ? (
            <div className="border rounded-md divide-y divide-border">
              {rolePermissions.map((perm) => (
                <div
                  key={perm.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {perm.id} — {perm.key_name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {perm.description ?? "Sem descrição"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma permissão associada à role.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
