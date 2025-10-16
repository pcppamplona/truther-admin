import { useTicketId } from "@/services/Tickets/useTickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { TicketData } from "@/interfaces/TicketData";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "@/components/info";
import { getColorRGBA, statusColors } from "@/lib/utils";

interface ChainTicketCardProps {
  id?: number;
  title: string;
  icon: React.ReactNode;
}

export const ChainTicketCard = ({ id, title, icon }: ChainTicketCardProps) => {
  const navigate = useNavigate();
  const { data: ticketData, isLoading } = useTicketId(id ?? 0);

  const handleExternalTicket = (ticket: TicketData) => {
    navigate("/ocurrenceDetails", { state: { ticketId: ticket.id } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            {icon}
            {title}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!ticketData}
                  onClick={() => ticketData && handleExternalTicket(ticketData)}
                >
                  <MoveUpRight />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Abrir esse Ticket {ticketData?.id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : !ticketData ? (
          <p className="text-muted-foreground italic">
            Nenhum dado disponível.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Info label="ID" value={ticketData.id} />

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div
                className="w-fit text-sm font-semibold uppercase rounded-sm border-none px-2 py-1"
                style={{
                  backgroundColor:
                    getColorRGBA?.(ticketData.status, statusColors, 0.1) ??
                    "#eee",
                  color:
                    getColorRGBA?.(ticketData.status, statusColors, 0.8) ??
                    "#000",
                }}
              >
                {ticketData.status}
              </div>
            </div>

            <Info
              label="Usuário (Responsável)"
              value={
                ticketData.assigned_user
                  ? `${ticketData.assigned_user.id} - ${ticketData.assigned_user.name}`
                  : "Não atribuído"
              }
            />

            <Info
              label="Motivo"
              value={`${ticketData.reason.id} - ${ticketData.reason.reason}`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
