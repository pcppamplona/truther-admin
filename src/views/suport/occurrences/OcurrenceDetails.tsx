import { useLocation } from "react-router-dom";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "@/components/info";
import {
  updateTicket,
  useCreateTicketAudit,
  useTicketAuditId,
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
  auditActionColors,
  getStatusColorRGBA,
} from "./components/utilsOcurrences";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/store/auth";
import CreateComment from "./components/Createcomment";

export default function OcurrenceDetails() {
  const location = useLocation();
  const ticketId = location.state?.id;
  const { user } = useAuth();

  const { data: audits } = useTicketAuditId(ticketId);

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
        action: "ATRIBUÍDO",
        performedBy: {
          id: user.id,
          name: user.name,
          groupSuport: user.groupLevel,
        },
        message: `Ocorrência ${ticketId} atribuída a ${user.name}.`,
        date: new Date().toISOString(),
      };

      await useCreateTicketAudit(auditPayload);
      console.log("Auditoria de atribuição registrada.");
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
          <Card>
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
                  className="px-3 py-1 rounded-lg text-sm font-semibold lowercase"
                  style={{
                    backgroundColor: getStatusColorRGBA(
                      ticket.status.status,
                      0.2
                    ),
                    color: getStatusColorRGBA(ticket.status.status, 0.9),
                    width: "fit-content",
                  }}
                >
                  {ticket.status.status}
                </div>
              </div>
              <Info label="Título" value={ticket.title} />

              <Info
                label="Tempo de expiração(horas)"
                value={ticket.expiredAt}
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

          {/* Card de Auditoria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2">
                <GitMerge />
                Auditoria da Ocorrência
              </CardTitle>
            </CardHeader>
            <CardContent>
              {audits?.map((audit) => (
                <div key={audit.id} className="border-b py-2">
                  <p className="text-sm">
                    <span className="font-semibold">
                      {audit.performedBy.name}
                    </span>{" "}
                    realizou a ação{" - "}
                    <span
                      className="font-semibold"
                      style={{ color: auditActionColors[audit.action] }}
                    >
                      {audit.action}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {audit.message}
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

          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-row items-center gap-2">
                  <MessageCircleMore /> Comentários
                </div>
                <CreateComment />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ticket.comments?.length ? (
                ticket.comments.map((comment) => (
                  <div key={comment.id}>
                    <p className="text-sm font-semibold">{comment.author}</p>
                    <p className="text-sm">{comment.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {dateFormat(comment.date)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
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
