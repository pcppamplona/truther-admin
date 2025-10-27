import { ShieldX } from "lucide-react";

export function ForbiddenCard({ permission }: { permission: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 border rounded-lg m-6">
      <ShieldX className="text-destructive mb-2" />
      <p className="text-xl font-semibold text-destructive">Acesso negado</p>
      <p className="text-sm max-w-md mt-2">
        Você não possui permissão para acessar esta funcionalidade.
        <br />
        Permissão requerida: <strong>{permission}</strong>
      </p>
    </div>
  );
}
