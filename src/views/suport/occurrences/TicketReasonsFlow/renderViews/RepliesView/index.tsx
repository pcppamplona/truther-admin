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
import { ArrowDown01, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import CreateReplyReasonDialog from "./CreateReplyReason";
import { Checkbox } from "@/components/ui/checkbox";

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
            <Button variant="outline" className="w-14 h-12">
              <ArrowDown01 size={18} />
            </Button>
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
              <TableHead>Reply</TableHead>
              <TableHead className="flex justify-center items-center">Comment</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : replies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center text-center">
                    <TriangleAlert className="text-muted-foreground mb-2" />
                    <p className="text-lg font-semibold">
                      Nenhuma resposta encontrada
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Não foi possível encontrar nenhuma reply. Tente atualizar
                      a página ou criar uma nova.
                    </p>
                  </div>
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
                  <TableCell className="font-medium">{reply.reply}</TableCell>
                  <TableCell className="flex justify-center items-center">
                    <Checkbox id="comment" checked={reply.comment} />
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
