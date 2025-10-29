import { ReplyReason } from "@/interfaces/TicketData";
import { useAllReplies } from "@/services/Tickets/useReplies";
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
import CreateReplyReasonDialog from "./CreateReplyReason";
import { CardEmpty } from "@/components/CardEmpty";
import { Check, X } from "lucide-react";

export function RepliesView() {
  const { data: allReplies, isLoading } = useAllReplies();

  const [replies, setReplies] = useState<ReplyReason[]>([]);

  useEffect(() => {
    if (allReplies) setReplies(allReplies);
  }, [allReplies]);

  return (
    <>
      <CardHeader className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">Replies</CardTitle>
            <CardDescription>
              Aqui estão as respostas (replies) associadas aos motivos de
              ticket. Cada resposta pode estar vinculada a um motivo específico.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <CreateReplyReasonDialog />
          </div>
        </div>
      </CardHeader>

      <div className="w-full px-4 lg:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Reason ID</TableHead>
              <TableHead>Reason Name</TableHead>
              <TableHead>Reply</TableHead>
              <TableHead className="flex justify-center items-center">
                Comment
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : replies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64">
                  <CardEmpty
                    title="Nenhum reposta encontrado"
                    subtitle=" Não foi possível encontrar nenhum reposta. Tente ajustar a pesquisa ou criar um novo."
                  />
                </TableCell>
              </TableRow>
            ) : (
              replies.map((reply) => (
                <TableRow
                  key={reply.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell>{reply.id}</TableCell>
                  <TableCell>{reply.reason_id}</TableCell>
                  <TableCell>{reply.reason_name}</TableCell>
                  <TableCell className="font-medium">{reply.reply}</TableCell>
                  <TableCell className="flex justify-center items-center gap-2">
                    {reply.comment ? (
                      <Check className="text-primary" />
                    ) : (
                      <X className="text-destructive" />
                    )}
                    {reply.comment ? "Sim" : "Não"}
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
