import { useLocation } from "react-router-dom";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "@/components/info";
import { dateFormat, timeFormat } from "@/lib/formatters";
import { FolderOpenDot, GitMerge, MessageCircleMore, User } from "lucide-react";

import { useTicketComments, useTicketId } from "@/services/Tickets/useTickets";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/skeletons/skeletonCard";
import React from "react";
import { useAuthStore } from "@/store/auth";
// import CreateComment from "./components/Createcomment";
import { AssignToMeDialog } from "./components/AssignToMeDialog";
import CreateComment from "./components/Createcomment";

export default function OcurrenceDetails() {
  const location = useLocation();
  const ticketId = location.state?.ticketId;

  const { data: ticket, isLoading, isError } = useTicketId(ticketId);
  const { data: ticketComments } = useTicketComments(ticketId);


  // const canComment = React.useMemo(() => {
  //   if (!ticket || !user) return false;

  //   const { status, assigned_user } = ticket;

  //   if (status === "FINALIZADO" || status === "FINALIZADO EXPIRADO") {
  //     return false;
  //   }

  //   if (!assigned_user) return true;

  //   if (typeof assigned_user !== "string" && assigned_user.id === user.id) {
  //     return true;
  //   }

  //   const userLevel = groupHierarchy[user.groupLevel as Group];
  //   const assignedLevel =
  //     typeof assigned_user === "string"
  //       ? groupHierarchy[assigned_user as Group]
  //       : groupHierarchy[assigned_user.group_level as Group];

  //   return userLevel > assignedLevel;
  // }, [ticket, user]);

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar ocorrência.</p>;
  if (!ticket) return <p>Ocorrência não encontrada.</p>;

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
          <Card className="h-full max-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2">
                <FolderOpenDot />
                Informações da Ocorrência
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
                    {/* <FinalizeTicketDialog ticket={ticket} /> */}
                  </div>

                  <div className="flex flex-row gap-4 items-center">
                    <Info
                      label="Responsável"
                      value={ticket.assigned_user?.name ?? "Não atribuído"}
                    />
                    <AssignToMeDialog ticket={ticket} />
                    {/* <DialogCloseButton ticket={ticket} /> */}
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
                    value={`${ticket.reason.expiredAt} horas`}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card className="h-full max-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitMerge />
                Histórico da Ocorrência
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pb-2"></CardContent>
          </Card>
          <Card>
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
                  <Info label="Documento" value={ticket.client?.document} />
                  <Info label="Telefone" value={ticket.client?.phone} />
                </>
              )}
            </CardContent>
          </Card>

          <Card className="h-full max-h-[300px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-row items-center gap-2">
                  <MessageCircleMore /> Comentários
                </div>
                {/* {canComment && <CreateComment ticket={ticket} />} */}
                <CreateComment ticket={ticket} />
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
              ) : ticketComments && ticketComments.length > 0 ? (
                ticketComments.map((comment, index) => (
                  <div key={comment.id}>
                    <p className="text-xs text-muted-foreground">
                      {dateFormat(comment.date)} às {timeFormat(comment.date)}
                    </p>
                    <p className="text-sm font-semibold">{comment.author}</p>
                    <p className="text-sm">{comment.message}</p>
                    {index < ticketComments.length - 1 && (
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
