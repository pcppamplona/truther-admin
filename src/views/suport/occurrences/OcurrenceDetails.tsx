import { useLocation } from "react-router-dom";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "@/components/info";
import {
  dateFormat,
  documentFormat,
  phoneFormat,
  timeFormat,
} from "@/lib/formatters";
import {
  FolderOpenDot,
  GitMerge,
  Link,
  Link2,
  MessageCircleMore,
  User,
} from "lucide-react";
import {
  useTicketAudit,
  useTicketComments,
  useTicketId,
} from "@/services/Tickets/useTickets";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/skeletons/skeletonCard";
import { AssignToMeDialog } from "./components/AssignToMeDialog";
import {
  actionColors,
  getColorRGBA,
  methodColors,
  statusColors,
} from "@/lib/utils";
import { ActionType } from "@/interfaces/AuditLogData";
import CreateCommentDialog from "./components/CreateCommentDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FinalizeTicketDialog } from "./components/FinalizeTicketDialog";
import { useAuthStore } from "@/store/auth";
import { Separator } from "@/components/ui/separator";
import { ChainTicketCard } from "./components/ChainTicketCard";

export default function OcurrenceDetails() {
  const location = useLocation();
  const ticketId = location.state?.ticketId;
  const { user } = useAuthStore();

  const { data: ticket, isLoading, isError } = useTicketId(ticketId);
  const { data: ticketComments } = useTicketComments(ticketId);
  const { data: ticketAudit } = useTicketAudit(ticketId);

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar ocorrência.</p>;
  if (!ticket) return <p>Ocorrência não encontrada.</p>;

  const canComment =
    ticket.assigned_user?.id === user?.id &&
    !["FINALIZADO", "FINALIZADO EXPIRADO"].includes(ticket.status);

  const canAssign = Boolean(!ticket.assigned_user?.id);

  return (
    <SidebarLayout
      breadcrumb={[
        { label: "Suporte", href: "/clients" },
        { label: "Ocorrências", href: "/ocurrences" },
      ]}
      current="Detalhes da Ocorrência"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="h-full max-h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                  <FolderOpenDot />
                  Informações da Ocorrência
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {ticket.status !== "FINALIZADO" ? (
                        <FinalizeTicketDialog ticket={ticket} />
                      ) : null}
                    </TooltipTrigger>

                    <TooltipContent>
                      {ticket.status === "FINALIZADO" ? (
                        <p>Iniciar o processo de finalização de ticket!</p>
                      ) : (
                        <p>Finalizar esse ticket!</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isLoading ? (
                <SkeletonCard />
              ) : isError || !ticket ? (
                <p className="text-sm text-muted-foreground italic">
                  Erro ao carregar os detalhes.
                </p>
              ) : (
                <>
                  <Info label="ID" value={ticket.id} />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div
                      className="w-fit text-sm font-semibold uppercase rounded-sm border-none px-2 py-1"
                      style={{
                        backgroundColor:
                          getColorRGBA?.(ticket.status, statusColors, 0.1) ??
                          "#eee",
                        color:
                          getColorRGBA?.(ticket.status, statusColors, 0.8) ??
                          "#000",
                      }}
                    >
                      {ticket.status}
                    </div>
                  </div>

                  <div className="flex flex-row gap-4 items-center">
                    <Info
                      label="Responsável"
                      value={ticket.assigned_user?.name ?? "Não atribuído"}
                    />

                    <AssignToMeDialog ticket={ticket} disabled={!canAssign} />
                  </div>
                  <Info
                    label="Data de Criação"
                    value={dateFormat(ticket.created_at)}
                  />
                  <Info label="Motivo" value={ticket.reason.reason} />
                  <Info label="Horário" value={timeFormat(ticket.created_at)} />
                  <Info label="Descrição" value={ticket.reason.description} />

                  <Info
                    label="Tempo de expiração"
                    value={`${ticket.reason.expired_at} horas`}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card className="h-full max-h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex flex-row justify-between gap-2">
                <div className="flex flex-row items-center gap-2">
                  <MessageCircleMore /> Comentários
                </div>
                {canComment && <CreateCommentDialog ticket={ticket} />}
                {/* <CreateCommentDialog ticket={ticket} /> */}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-full" />
                      {i < 2 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              ) : ticketComments && ticketComments.length > 0 ? (
                ticketComments.map((comment, index) => (
                  <>
                    <div
                      key={comment.id}
                      className="border-l-3 pl-2 border-l-border"
                    >
                      <p className="text-xs text-muted-foreground">
                        {dateFormat(comment.date ?? "-")} às{" "}
                        {timeFormat(comment.date ?? "-")}
                      </p>
                      <p className="text-sm font-semibold">{comment.author}</p>
                      <p className="text-sm">{comment.message}</p>
                    </div>
                    {index < ticketComments.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Nenhum comentário adicionado.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="h-full max-h-[250px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2">
                <User /> Dados do Solicitante
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isLoading ? (
                <SkeletonCard />
              ) : isError || !ticket?.client ? (
                <p className="text-sm text-muted-foreground italic">
                  Solicitante não informado.
                </p>
              ) : (
                <>
                  <Info label="ID" value={ticket.client?.id} />
                  <Info label="Nome" value={ticket.client?.name} />
                  <Info
                    label="Documento"
                    value={documentFormat(ticket.client?.document)}
                  />
                  <Info
                    label="Telefone"
                    value={phoneFormat(ticket.client?.phone)}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card className="h-full max-h-[250px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitMerge />
                Histórico da Ocorrência
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-full" />
                      {i < 2 && <div className="my-4 border-t border-muted" />}
                    </div>
                  ))}
                </div>
              ) : ticketAudit && ticketAudit.length > 0 ? (
                ticketAudit.map((audit, index) => (
                  <div key={audit.id}>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <p className="text-xs text-muted-foreground">
                        {dateFormat(audit.created_at)} às{" "}
                        {timeFormat(audit.created_at)}
                      </p>
                      <div
                        className={`px-3 w-fit min-w-18 flex border-l-[3px] text-sm uppercase font-semibold ${
                          actionColors[audit.action as ActionType]
                        }`}
                      >
                        {audit.action}
                      </div>
                    </div>

                    <p className="text-sm">
                      <span className="font-semibold">{audit.sender_name}</span>{" "}
                    </p>

                    <div className="flex flex-row items-center gap-2">
                      <p
                        className={`font-semibold uppercase tracking-wide text-xs ${
                          methodColors[audit.method]
                        }`}
                      >
                        {audit.method}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        – {audit.description}
                      </p>
                    </div>

                    {index < ticketAudit.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Nenhuma interação adicionada.
                </p>
              )}
            </CardContent>
          </Card>

          {ticket.chain_id_main ? (
            <ChainTicketCard
              id={ticket.chain_id_main}
              title="Ticket inicial da cadeia"
              icon={<Link2 />}
            />
          ) : null}

          {ticket.chain_id_last ? (
            <ChainTicketCard
              id={ticket.chain_id_last}
              title="Ticket anterior na cadeia"
              icon={<Link />}
            />
          ) : null}
        </div>
      </div>
    </SidebarLayout>
  );
}
