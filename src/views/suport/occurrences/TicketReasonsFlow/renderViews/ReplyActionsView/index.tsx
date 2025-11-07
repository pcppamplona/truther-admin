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
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { CardEmpty } from "@/components/CardEmpty";

export function ReplyActionsView() {
  const { data: allReplyActions, isLoading } = useAllReplyActions();

  const [replyActions, setReplyActions] = useState<ReplyAction[]>([]);

  useEffect(() => {
    if (allReplyActions) setReplyActions(allReplyActions);
  }, [allReplyActions]);

  const handleRowClick = () => {};

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <CardHeader className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">
              Ticket Reasons
            </CardTitle>
            <CardDescription>
              Aqui estão os ticket reasons. Aqui mostramos os replys conectados
              aos seus actions. <br />
              Aqui tambem mostra o data dos items a serem feito pelas actions
              types.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-y-auto px-4 lg:px-6 mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Reply ID</TableHead>
              <TableHead>Action Type</TableHead>
              <TableHead>Data Email</TableHead>
              <TableHead>Data Ticket Reason</TableHead>
              <TableHead>Data Ticket Assign Role</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : replyActions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64">
                  <CardEmpty
                    title="Nenhum ação encontrado"
                    subtitle=" Não foi possível encontrar nenhum ação. Tente ajustar a pesquisa ou criar um novo."
                  />
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
                  <TableCell>{reason.data_new_ticket_assign_role}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
