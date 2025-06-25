import { useLocation } from "react-router-dom";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "@/components/info";
import {
  useTicketAuditId,
  useTicketComments,
  useTickets,
} from "@/services/Tickets/useTickets";
import { dateFormat, timeFormat } from "@/lib/formatters";
import { FolderOpenDot, GitMerge, MessageCircleMore, User } from "lucide-react";
import CreateComment from "./components/Createcomment";
import {
  auditActionColors,
  getColorRGBA,
  statusColors,
} from "./components/utilsOcurrences";
import { TicketStatusDropdown } from "./components/TicketStatusDropdown";
import { AssignToMeDialog } from "./components/AssignToMeDialog";
import { useAuth } from "@/store/auth";
import { Group, groupHierarchy, TicketData } from "@/interfaces/ticket-data";

export default function OcurrenceDetails() {
  const location = useLocation();
  const ticketId = location.state?.id;
  const { user } = useAuth();

  const { data: audits } = useTicketAuditId(ticketId);
  const { data: commentsData } = useTicketComments(ticketId);
  const { data: tickets } = useTickets();

  const ticket: TicketData | undefined = tickets?.find(
    (t) => t.id === ticketId
  );

  if (!ticket) {
    return <p>Ocorrência não encontrada.</p>;
  }

  const canComment = (() => {
    const assigned = ticket.assignedTo;
    if (!assigned) return true;

    if (typeof assigned !== "string" && assigned.id === user?.id) {
      return true;
    }

    const userLevel = groupHierarchy[user?.groupLevel as Group];
    const assignedLevel =
      typeof assigned === "string"
        ? groupHierarchy[assigned as Group]
        : groupHierarchy[assigned.group as Group];

    return userLevel > assignedLevel;
  })();

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
          {/* Card - Informações */}
          <Card className="h-full max-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2">
                <FolderOpenDot />
                Informações da Ocorrência
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="ID" value={ticket.id} />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <TicketStatusDropdown
                  ticket={ticket}
                  statusColors={statusColors}
                  getColorRGBA={getColorRGBA}
                />
              </div>

              <Info label="Motivo" value={ticket.reason.reason} />
              <Info
                label="Tempo de expiração"
                value={`${ticket.reason.expiredAt} horas`}
              />
              <Info label="Descrição" value={ticket.reason.description} />
              {/* <Info label="Receptor" value={ticket.reason.recipient} /> */}
              <Info
                label="Data de Criação"
                value={dateFormat(ticket.createdAt)}
              />
              <Info label="Horário" value={timeFormat(ticket.createdAt)} />
              <div className="flex flex-row gap-4 items-center">
                <Info
                  label="Responsável"
                  value={
                    typeof ticket.assignedTo === "object" &&
                    ticket.assignedTo !== null
                      ? ticket.assignedTo.name
                      : ticket.assignedTo ?? "Não atribuído"
                  }
                />

                <AssignToMeDialog ticket={ticket} />
              </div>
            </CardContent>
          </Card>

          {/* Card - Auditoria */}
          <Card className="h-full max-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitMerge />
                Auditoria da Ocorrência
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pb-2">
              {audits?.map((audit, index) => (
                <div key={audit.id}>
                  <p className="text-sm">
                    <span className="font-semibold">
                      {audit.performedBy.name}
                    </span>{" "}
                    <span
                      className="px-2 py-1 m-1 rounded-sm text-sm font-semibold lowercase"
                      style={{
                        backgroundColor: getColorRGBA(
                          audit.action,
                          auditActionColors,
                          0.2
                        ),
                        color: getColorRGBA(
                          audit.action,
                          auditActionColors,
                          0.9
                        ),
                      }}
                    >
                      {audit.action}
                    </span>
                    {audit.message}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {audit.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dateFormat(audit.date)} às {timeFormat(audit.date)}
                  </p>
                  {index < audits.length - 1 && (
                    <div className="my-4 border-t border-muted" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card - Dados Remetente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2">
                <User /> Dados do Solicitante
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ticket.createdBy ? (
                <>
                  <Info label="ID" value={ticket.client?.id} />
                  <Info label="Nome" value={ticket.client?.name} />
                  <Info label="Grupo" value={ticket.client?.document} />
                  <Info label="Grupo" value={ticket.client?.phone} />
                </>
              ) : (
                <div className="col-span-2 text-muted-foreground italic">
                  Solicitante não disponível
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card - Comentários */}
          <Card className="h-full max-h-[300px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-row items-center gap-2">
                  <MessageCircleMore /> Comentários
                </div>
                {canComment && <CreateComment ticket={ticket} />}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {commentsData && commentsData.length > 0 ? (
                commentsData.map((comment, index) => (
                  <div key={comment.id}>
                    <p className="text-xs text-muted-foreground">
                      {dateFormat(comment.date)} às {timeFormat(comment.date)}
                    </p>
                    <p className="text-sm font-semibold">{comment.author}</p>
                    <p className="text-sm">{comment.message}</p>
                    {index < commentsData.length - 1 && (
                      <div className="my-4 border-t border-muted" />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Nenhum comentário adicionado.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
