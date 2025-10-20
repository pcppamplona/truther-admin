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
import { Reason, TicketReasonResponse } from "@/interfaces/TicketData";
import {
  useAllTicketReasons,
  useTicketReasonsByIdFlow,
} from "@/services/Tickets/useReasons";
import {
  ArrowDown01,
  ChevronDown,
  ChevronUp,
  TriangleAlert,
} from "lucide-react";
import { useState, useEffect } from "react";
import { CreateReasonDialog } from "./CreateReasonDialog";
import { Info } from "@/components/info";

export function ReasonsView() {
  const { data: allTicketReasons, isLoading } = useAllTicketReasons();
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedReasonData, setSelectedReasonData] = useState<TicketReasonResponse | null>(null);

  useEffect(() => {
    if (allTicketReasons) setReasons(allTicketReasons);
  }, [allTicketReasons]);

  const handleRowClick = (reasonId: number) => {
    console.log("Selecionado:", reasonId);
    setExpandedId((prev) => (prev === reasonId ? null : reasonId));
  };

  const reasonDetailsQuery = useTicketReasonsByIdFlow(expandedId ?? 0);

  useEffect(() => {
    if (reasonDetailsQuery.data) {
      setSelectedReasonData(reasonDetailsQuery.data);
    }
  }, [reasonDetailsQuery.data]);

  return (
    <>
      <CardHeader className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">Reasons</CardTitle>
            <CardDescription>
              Aqui estão os motivos (reasons) utilizados na criação de tickets.
              <br />
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
              <TableHead>Categoria</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Expiração</TableHead>
              <TableHead>Descrição</TableHead>
              <TableCell></TableCell>
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
                <>
                  <TableRow
                    key={reason.id}
                    onClick={() => handleRowClick(reason.id ?? 0)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>{reason.id}</TableCell>
                    <TableCell>{reason.category_id}</TableCell>
                    <TableCell className="font-medium">{reason.reason} </TableCell>
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
                    <TableCell>
                      {expandedId === reason.id ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </TableCell>
                  </TableRow>

                  {expandedId === reason.id && (
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={8} className="p-6">
                        <div className="space-y-6">

                          {/* Dados do Reason */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Info label="ID" value={reasonDetailsQuery.data?.id} />
                            <Info label="Category ID" value={reasonDetailsQuery.data?.category_id} />
                            <Info label="Type" value={reasonDetailsQuery.data?.type} />
                            <Info label="Reason" value={reasonDetailsQuery.data?.reason} />
                            <Info label="Description" value={reasonDetailsQuery.data?.description} />
                            <Info label="Expired At" value={`${reasonDetailsQuery.data?.expired_at}h`} />
                            <Info label="Type Recipient" value={reasonDetailsQuery.data?.type_recipient} />
                            <Info label="Recipient" value={reasonDetailsQuery.data?.recipient} />
                          </div>

                          {/* Replies */}
                          {reasonDetailsQuery.data?.replies?.length ? (
                            <div className="space-y-4">
                              <h4 className="font-semibold text-sm uppercase tracking-wide text-zinc-400">
                                Replies
                              </h4>
                              {reasonDetailsQuery.data.replies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="border border-border rounded-lg bg-background/60 p-4 shadow-sm"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Info label="Reply ID" value={reply.id} />
                                    <Info label="Comment" value={reply.comment ? "Sim" : "Não"} />
                                    <Info label="Reply" value={reply.reply} />
                                  </div>

                                  {/* Actions */}
                                  {reply.actions?.length ? (
                                    <div className="mt-4 pl-4 border-l-2 border-border">
                                      <h5 className="font-medium text-sm mb-2 text-zinc-400 uppercase">
                                        Actions
                                      </h5>
                                      <div className="space-y-3">
                                        {reply.actions.map((action) => (
                                          <div
                                            key={action.id}
                                            className="border border-border rounded p-3 bg-muted/40"
                                          >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <Info label="Action Type ID" value={action.action_type_id} />
                                              <Info label="Email" value={action.data_email ?? "-"} />
                                              <Info
                                                label="New Ticket Reason ID"
                                                value={action.data_new_ticket_reason_id ?? "-"}
                                              />
                                              <Info
                                                label="Assign To Group"
                                                value={action.data_new_ticket_assign_to_group ?? "-"}
                                              />
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
