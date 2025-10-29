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
import { Reason, RoleId, TicketReasonResponse } from "@/interfaces/TicketData";
import {
  useAllTicketReasons,
  useTicketReasonsByIdFlow,
} from "@/services/Tickets/useReasons";
import { ChevronDown, ChevronUp, CornerDownRight } from "lucide-react";
import { useState, useEffect } from "react";
import { CreateReasonDialog } from "./CreateReasonDialog";
import { Info } from "@/components/info";
import { CardEmpty } from "@/components/CardEmpty";

export function ReasonsView() {
  const { data: allTicketReasons, isLoading } = useAllTicketReasons();
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedReasonData, setSelectedReasonData] =
    useState<TicketReasonResponse | null>(null);

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
                <TableCell colSpan={7} className="h-64">
                  <CardEmpty
                    title="Nenhum motivo encontrado"
                    subtitle=" Não foi possível encontrar nenhum motivo. Tente ajustar a pesquisa ou criar um novo."
                  />
                </TableCell>
              </TableRow>
            ) : (
              reasons.map((reason) => (
                <>
                  <TableRow
                    key={reason.id}
                    onClick={() => handleRowClick(reason.id ?? 0)}
                    className="cursor-pointer transition-colors"
                  >
                    <TableCell>{reason.id}</TableCell>
                    <TableCell>{reason.category_id}</TableCell>
                    <TableCell className="font-medium">
                      {reason.reason}{" "}
                    </TableCell>
                    <TableCell>
                      {reason.type_recipient === "GROUP"
                        ? (() => {
                            const role = RoleId.find(
                              (r) => r.id === Number(reason.recipient)
                            );
                            return role ? `Grupo: ${role.name}` : "Grupo: -";
                          })()
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

                  {expandedId === reason.id ? (
                    <TableRow className="bg-secondary">
                      <TableCell colSpan={8} className="p-6">
                        <div className="space-y-6">
                          {reasonDetailsQuery.data?.replies?.length ? (
                            <div className="space-y-4">
                              <h4 className="flex flex-row items-center font-semibold text-sm uppercase tracking-wide gap-2">
                                <CornerDownRight size={18} />
                                Replies do reason {reason.id}
                              </h4>
                              {reasonDetailsQuery.data.replies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="border border-l-primary border-l-3 rounded-lg bg-background p-4 shadow-sm space-y-4"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Info label="Reply ID" value={reply.id} />
                                    <Info
                                      label="Necessário comentário?"
                                      value={reply.comment ? "Sim" : "Não"}
                                    />
                                    <Info label="Reply" value={reply.reply} />
                                  </div>

                                  {reply.actions?.length ? (
                                    <>
                                      {reply.actions.map((action) => (
                                        <div
                                          key={action.id}
                                          className="space-y-2"
                                        >
                                          <div className="border border-l-muted-foreground border-l-3 rounded p-3 bg-muted/40">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <Info
                                                label="Action Type"
                                                value={
                                                  action.action_type?.type ??
                                                  "-"
                                                }
                                              />
                                              <Info
                                                label="Description"
                                                value={
                                                  action.action_type
                                                    ?.description_action
                                                }
                                              />
                                              {action.action_type?.type ===
                                                "send_email" && (
                                                <Info
                                                  label="Email"
                                                  value={
                                                    action.data_email ?? "-"
                                                  }
                                                />
                                              )}

                                              {action.action_type?.type ===
                                                "new_ticket" && (
                                                <>
                                                  <Info
                                                    label="New Ticket Reason ID"
                                                    value={
                                                      action.data_new_ticket_reason_id ??
                                                      "-"
                                                    }
                                                  />
                                                  <Info
                                                    label="Assign Role"
                                                    value={
                                                      action.data_new_ticket_assign_role ??
                                                      "-"
                                                    }
                                                  />
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </>
                                  ) : (
                                    <div className="mt-4 pl-4 border-l-muted-foreground border-l-3 text-sm italic text-muted-foreground">
                                      Nenhuma ação cadastrada para este reason.
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-4 pl-4 border-l-2 border-border text-sm italic text-muted-foreground">
                              Nenhuma ação cadastrada para este reason.
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
