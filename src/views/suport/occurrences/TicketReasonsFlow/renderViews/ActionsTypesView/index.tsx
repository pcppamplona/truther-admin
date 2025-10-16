import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActionsType } from "@/interfaces/TicketData";
import { dateFormat } from "@/lib/formatters";
import { useActionTypes } from "@/services/Tickets/useActionTypes";
import { ArrowDown01, Plus, TriangleAlert } from "lucide-react";
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
              Aqui estão os motivos ActionTypes. As ações que podem ser associadas a um reply, quando o mesmo for finalizado.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="w-14 h-12">
              <ArrowDown01 size={18} />
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="w-14 h-12" onClick={() => {}}>
                    <Plus size={18} color="#fff" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Criar novo reason</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
  
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : actionsType.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center text-center">
                    <TriangleAlert className="text-muted-foreground mb-2" />
                    <p className="text-lg font-semibold">
                      Nenhum Ação encontrado
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Não foi possível encontrar nenhuma ação. Tente atualizar
                      a página ou criar uma nova.
                    </p>
                  </div>
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
                
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
