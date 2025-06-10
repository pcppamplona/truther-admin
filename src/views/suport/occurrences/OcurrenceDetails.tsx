import { useLocation } from "react-router-dom";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "@/components/info";
import {
  updateTicket,
  useCreateTicketAudit,
  useTicketAuditId,
  useTicketComments,
  useTickets,
} from "@/services/Tickets/useTickets";
import { TicketAudit, TicketData } from "@/interfaces/ocurrences-data";
import {
  dateFormat,
  documentFormat,
  phoneFormat,
  timeFormat,
} from "@/lib/formatters";
import {
  Bookmark,
  BookmarkCheck,
  FolderOpenDot,
  GitMerge,
  MessageCircleMore,
  User,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/store/auth";
import CreateComment from "./components/Createcomment";
import {
  auditActionColors,
  getColorRGBA,
  statusColors,
} from "./components/utilsOcurrences";

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

  const handleAssignToMe = async () => {
    if (!ticket || !user) return;

    try {
      await updateTicket(ticketId, {
        assignedTo: {
          id: user.id,
          name: user.name,
          groupSuport: user.groupLevel,
        },
      });

      const auditPayload: TicketAudit = {
        ticketId: ticketId,
        action: "Atribuíu",
        performedBy: {
          id: user.id,
          name: user.name,
          groupSuport: user.groupLevel,
        },
        message: `um ticket`,
        description: `Ocorrência ${ticketId} atribuída a ${user.name}.`,
        date: new Date().toISOString(),
      };

      await useCreateTicketAudit(auditPayload);
    } catch (err) {
      console.error("Erro ao atribuir ocorrência ou registrar auditoria:", err);
    }
  };

  return (
    <SidebarLayout
      breadcrumb={[
        { label: "Suporte", href: "/clients" },
        { label: "Ocorrências", href: "/ocurrences" },
      ]}
      current={"Detalhes da Ocorrência"}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div
                  className="px-3 py-1 rounded-sm text-sm font-semibold lowercase"
                  style={{
                    backgroundColor: getColorRGBA(
                      ticket.status.status,
                      statusColors,
                      0.2
                    ),
                    color: getColorRGBA(
                      ticket.status.status,
                      statusColors,
                      0.9
                    ),
                    width: "fit-content",
                  }}
                >
                  {ticket.status.status}
                </div>
              </div>
              <Info label="Título" value={ticket.title} />

              <Info
                label="Tempo de expiração"
                value={ticket.expiredAt + " horas"}
              />
              <Info label="Descrição" value={ticket.description} />
              <Info label="Grupo" value={ticket.groupSuport} />

              <Info
                label="Data de Criação"
                value={dateFormat(ticket.createdAt)}
              />
              <Info label="Horário" value={timeFormat(ticket.createdAt)} />
              <div className="flex flex-row gap-4 items-center">
                <Info
                  label="Responsável"
                  value={ticket.assignedTo?.name ?? "Não atribuído"}
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleAssignToMe}
                      disabled={ticket.assignedTo?.id === user?.id}
                      className="flex items-center gap-1"
                    >
                      {ticket.assignedTo ? (
                        <>
                          <BookmarkCheck className="text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">
                            Atribuído
                          </span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="text-primary" />
                          <span className="text-primary text-sm">
                            Atribuir a mim
                          </span>
                        </>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {ticket.assignedTo
                        ? "Este ticket já possui responsável"
                        : "Atribuir este ticket a você"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full max-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitMerge />
                Auditoria da Ocorrência
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {audits?.map((audit) => (
                <div key={audit.id} className="border-b py-4">
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
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2">
                <User /> Dados Remetente
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ticket.requester != null ? (
                <>
                  <Info label="ID" value={ticket.requester.id} />
                  <Info label="Nome" value={ticket.requester.name} />
                  <Info
                    label="Documento"
                    value={documentFormat(ticket.requester.document)}
                  />
                  <Info
                    label="Telefone"
                    value={phoneFormat(ticket.requester.phone)}
                  />
                </>
              ) : (
                <div className="col-span-2 text-muted-foreground italic">
                  Remetente não atribuído
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="h-full max-h-[300px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-row items-center gap-2">
                  <MessageCircleMore /> Comentários
                </div>
                <CreateComment ticketId={ticketId} />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4">
              {commentsData && commentsData.length > 0 ? (
                commentsData.map((comment) => (
                  <div key={comment.id}>
                    <p className="text-sm font-semibold">{comment.author}</p>
                    <p className="text-sm">{comment.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {dateFormat(comment.date)} às {timeFormat(comment.date)}
                    </p>
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
