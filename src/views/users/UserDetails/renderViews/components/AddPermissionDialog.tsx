import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Shield, ShieldBan } from "lucide-react";
import { usePermissions } from "@/services/permissions/usePermissions";
import {
  useUserPermissions,
  useCreateUserPermission,
  useDeleteUserPermission,
} from "@/services/permissions/useUserPermissions";
import { useRolePermissions } from "@/services/permissions/useRolePermissions";
import { useState, useMemo, useEffect } from "react";
import { UserData } from "@/interfaces/UserData";
import { toast } from "sonner";
import { PermissionsSkeleton } from "@/components/skeletons/skeletonPermission";

interface Props {
  user: UserData;
}

export function AddPermissionDialog({ user }: Props) {
  const { data: allPermissions = [], isLoading } = usePermissions();
  const { data: rolePermissions = [] } = useRolePermissions(user.role_id);
  const {
    data: userPermissions = [],
    isLoading: loadingUser,
  } = useUserPermissions(user.id);

  const { mutateAsync: createPermission } = useCreateUserPermission();
  const { mutateAsync: deletePermission } = useDeleteUserPermission();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // IDs herdados da role (bloqueados)
  const inheritedIds = useMemo(
    () => rolePermissions.map((p) => Number(p.id)),
    [rolePermissions]
  );

  // Sincroniza o estado local com as permissões reais do usuário
  useEffect(() => {
    if (userPermissions.length > 0) {
      setSelected(new Set(userPermissions.map((p) => Number(p.id))));
    }
  }, [userPermissions]);

  const togglePermission = (id: number) => {
    if (inheritedIds.includes(id)) {
      toast.error("Ação não permitida", {
        description:
          "Não é possível remover ou alterar permissões vinculadas à role.",
        duration: 2000,
      });
      return;
    }

    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSave = async () => {
    const currentIds = userPermissions.map((p) => Number(p.id));
    const toAdd = [...selected].filter((id) => !currentIds.includes(id));
    const toRemove = currentIds.filter((id) => !selected.has(id));

    try {
      await Promise.all([
        ...toAdd.map((permission_id) =>
          createPermission({
            user_id: Number(user.id),
            permission_id,
          })
        ),
        ...toRemove.map((permission_id) =>
          deletePermission({
            user_id: Number(user.id),
            permission_id,
          })
        ),
      ]);

      toast.success("Permissões atualizadas", {
        description: "As permissões do usuário foram atualizadas com sucesso.",
        duration: 2000,
      });
      setOpen(false);
    } catch {
      toast.error("Erro ao atualizar", {
        description: "Não foi possível atualizar as permissões.",
        duration: 2000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-10 text-white" size="icon">
          <Plus size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield />
            Gerenciar Permissões
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Gerencie as permissões de <strong>{user.name}</strong>. Permissões
            herdadas da role estão bloqueadas para edição.
          </DialogDescription>
        </DialogHeader>

        {isLoading || loadingUser ? (
          <PermissionsSkeleton rows={10} />
        ) : (
          <div className="border rounded-md divide-y divide-border">
            {allPermissions.map((perm) => {
              const id = Number(perm.id);
              const isInherited = inheritedIds.includes(id);
              const isChecked = selected.has(id) || isInherited;

              return (
                <div
                  key={id}
                  className={`flex items-center justify-between gap-2 px-2 py-2 rounded transition-colors ${
                    isInherited
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-muted/40"
                  }`}
                  onClick={() => togglePermission(id)}
                >
                  <div className="flex items-center gap-4">
                    <Checkbox checked={isChecked} disabled={isInherited} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {id} — {perm.key_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {perm.description ?? "Sem descrição"}
                      </span>
                    </div>
                  </div>

                  {isInherited && (
                    <div className="flex items-center gap-1">
                      <ShieldBan color="red" size={18} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
