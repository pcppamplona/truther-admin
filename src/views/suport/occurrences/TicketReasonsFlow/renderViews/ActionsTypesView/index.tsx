import { CardEmpty } from "@/components/CardEmpty";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ActionsType } from "@/interfaces/TicketData";
import { dateFormat } from "@/lib/formatters";
import { useActionTypes } from "@/services/Tickets/useActionTypes";
import { useState, useEffect } from "react";

export function ActionsTypesView() {
  const { data: allActionsType, isLoading } = useActionTypes();
  const [actionsType, setActionsType] = useState<ActionsType[]>([]);

  useEffect(() => {
    if (allActionsType) setActionsType(allActionsType);
  }, [allActionsType]);

  return (
    <>
      <CardHeader className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">Ações</CardTitle>
            <CardDescription>
              Aqui estão os motivos ActionTypes. As ações que podem ser
              associadas a um reply, quando o mesmo for finalizado.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className="w-full px-4 lg:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Criação</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : actionsType.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64">
                  <CardEmpty
                    title="Nenhuma ação encontrado"
                    subtitle=" Não foi possível encontrar nenhuma ação. Tente ajustar a pesquisa ou criar um novo."
                  />
                </TableCell>
              </TableRow>
            ) : (
              actionsType.map((action) => (
                <TableRow
                  key={action.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell>{action.id}</TableCell>
                  <TableCell className="font-medium">{action.type}</TableCell>
                  <TableCell>{dateFormat(action?.created_at ?? "")}</TableCell>
                  <TableCell>{action.description_action}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
