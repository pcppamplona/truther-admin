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
import { Reason } from "@/interfaces/TicketData";
import { useAllTicketReasons } from "@/services/Tickets/useReasons";
import { ArrowDown01, TriangleAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { CreateReasonDialog } from "./CreateReasonDialog";

export function ReasonsView() {
  const { data: allTicketReasons, isLoading } = useAllTicketReasons();
  const [reasons, setReasons] = useState<Reason[]>([]);

  useEffect(() => {
    if (allTicketReasons) setReasons(allTicketReasons);
  }, [allTicketReasons]);

  const handleRowClick = (reason: Reason) => {
    console.log("Selecionado:", reason);
  };

  return (
    <>
      <CardHeader className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">Reasons</CardTitle>
            <CardDescription>
              Aqui estão os motivos (reasons) utilizados na criação de tickets.<br />
              Cada motivo pode conter respostas e ações associadas.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="w-14 h-12">
              <ArrowDown01 size={18} />
            </Button>
            <CreateReasonDialog />
          </div>
        </div>
      </CardHeader>

      <div className="w-full px-4 lg:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Expiração</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : reasons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center text-center">
                    <TriangleAlert className="text-muted-foreground mb-2" />
                    <p className="text-lg font-semibold">
                      Nenhum motivo encontrado
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Não foi possível encontrar nenhum motivo. Tente atualizar
                      a página ou criar um novo.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reasons.map((reason) => (
                <TableRow
                  key={reason.id}
                  onClick={() => handleRowClick(reason)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell>{reason.id}</TableCell>
                  <TableCell className="font-medium">{reason.reason}</TableCell>
                  <TableCell>{reason.type}</TableCell>
                  <TableCell>
                    {reason.type_recipient === "GROUP"
                      ? `Grupo: ${reason.recipient}`
                      : reason.type_recipient === "USER"
                      ? `Usuário: ${reason.recipient}`
                      : "Todos"}
                  </TableCell>
                  <TableCell>{reason.expired_at}h</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {reason.description}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
