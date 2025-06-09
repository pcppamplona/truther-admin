import { useLocation } from "react-router-dom";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "@/components/info";
import { useTicketAuditId, useTickets } from "@/services/Tickets/useTickets";
import { TicketData } from "@/interfaces/ocurrences-data";
import {
  dateFormat,
  documentFormat,
  phoneFormat,
  timeFormat,
} from "@/lib/formatters";
import { FolderOpenDot, User } from "lucide-react";
import { getStatusColorRGBA } from "./components/utilsOcurrences";

export default function OcurrenceDetails() {
  const location = useLocation();
  const ticketId = location.state?.id;
  const { data: audits } = useTicketAuditId(ticketId);
  console.log(">>>>>", audits);

  const { data: tickets } = useTickets();

  const ticket: TicketData | undefined = tickets?.find(
    (t) => t.id === ticketId
  );

  if (!ticket) {
    return <p>Ocorrência não encontrada.</p>;
  }

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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2">
                <User /> Dados Cliente
              </CardTitle>
            </CardHeader>
            {/* <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="ID" value={ticket.requester.id } />
              <Info label="Nome" value={ticket.client.name} />
              <Info
                label="Documento"
                value={documentFormat(ticket.client.document)}
              />
              <Info label="Telefone" value={phoneFormat(ticket.client.phone)} />
            </CardContent> */}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
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

          {/* Card de Auditoria */}
          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle>Auditoria da Ocorrência</CardTitle>
            </CardHeader>
            <CardContent>
              {audits?.map((audit) => (
                <div key={audit.id} className="border-b pb-2">
                  <p className="text-sm">
                    <span className="font-semibold">
                      {audit.performedBy.name}
                    </span>{" "}
                    realizou a ação{" "}
                    <span className="font-semibold">{audit.action}</span>
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
        </div>
      </div>
    </SidebarLayout>
  );
}
