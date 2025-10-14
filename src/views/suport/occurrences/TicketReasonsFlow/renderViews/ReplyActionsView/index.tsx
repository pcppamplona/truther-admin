import { ReplyAction } from "@/interfaces/TicketData";
import { useAllReplyActions } from "@/services/Tickets/useReplyActions";
import { useEffect, useState } from "react";
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
import { ArrowDown01, Plus, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";

export function ReplyActionsView() {
  const { data: allReplyActions, isLoading } = useAllReplyActions();

  const [replyActions, setReplyActions] = useState<ReplyAction[]>([]);

  useEffect(() => {
    if (allReplyActions) setReplyActions(allReplyActions);
  }, [allReplyActions]);

  const handleRowClick = () => {};

  return (
    <>
      <CardHeader className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">
              Ticket Reasons
            </CardTitle>
            <CardDescription>
              Aqui estão os ticket reasons. Aqui mostramos os replys conectados
              aos seus actions. <br />Aqui tambem mostra o data dos items a serem
              feito pelas actions types.
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
                  <p>Criar novo reply reason</p>
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
              <TableHead>Reply ID</TableHead>
              <TableHead>Action Type</TableHead>
              <TableHead>Data Email</TableHead>
              <TableHead>Data Ticket Reason</TableHead>
              <TableHead>Data Ticket Assign Group</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : replyActions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center text-center">
                    <TriangleAlert className="text-muted-foreground mb-2" />
                    <p className="text-lg font-semibold">
                      Nenhum motivo encontrado
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Não foi possível encontrar nenhum reply action. Tente
                      atualizar a página ou criar um novo.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              replyActions.map((reason) => (
                <TableRow
                  key={reason.id}
                  onClick={() => handleRowClick()}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell>{reason.id}</TableCell>
                  <TableCell className="font-medium">
                    {reason.reply_id}
                  </TableCell>
                  <TableCell>{reason.action_type_id}</TableCell>
                  <TableCell>{reason.data_email}</TableCell>
                  <TableCell>{reason.data_new_ticket_reason_id}</TableCell>
                  <TableCell>
                    {reason.data_new_ticket_assign_to_group}
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
