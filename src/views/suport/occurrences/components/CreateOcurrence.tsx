import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketAudit, TicketData } from "@/interfaces/ocurrences-data";
import {
  useCreateTicket,
  useCreateTicketAudit,
} from "@/services/Tickets/useTickets";
import { useAuth } from "@/store/auth";
import { Plus } from "lucide-react";
import { useState } from "react";

export function CreateOcurrence() {
  const { user } = useAuth();
  const [ticketData, setTicketData] = useState<Partial<TicketData>>({
    comments: [],
    replies: [],
  });
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 5));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));
  const handleReset = () => {
    setStep(1);
    setTicketData({ comments: [], replies: [] });
  };

  const handleChange = (field: keyof TicketData, value: any) => {
    setTicketData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCommentChange = (index: number, field: string, value: any) => {
    const updated = [...(ticketData.comments || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleChange("comments", updated);
  };

  const handleReplyChange = (index: number, field: string, value: any) => {
    const updated = [...(ticketData.replies || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleChange("replies", updated);
  };

  const addComment = () => {
    handleChange("comments", [
      ...(ticketData.comments || []),
      { author: "", message: "", date: "" },
    ]);
  };

  const addReply = () => {
    handleChange("replies", [
      ...(ticketData.replies || []),
      { author: "", message: "", date: "", visibleToCustomer: false },
    ]);
  };

  const handleSubmit = async () => {
    const payload: TicketData = {
      title: ticketData.title || "",
      description: ticketData.description || "",
      status: {
        title: ticketData.status?.status || "PENDENTE",
        status: ticketData.status?.status || "PENDENTE",
        description: "Status criado pelo usuário",
      },
      assignedTo: {
        id: user?.id || 0,
        name: user?.name || "",
        groupSuport: user?.groupLevel || "N1",
      },
      createdBy: {
        id: user?.id || 0,
        name: user?.name || "",
        groupSuport: user?.groupLevel  || "N1",
      },
      lastInteractedBy: undefined,
      client: ticketData.client || {
        id: 0,
        name: "",
        document: "",
        phone: "",
      },
      createdAt: new Date().toISOString(),
      startedAt: "",
      expiredAt: ticketData.expiredAt,
      comments: ticketData.comments || [],
      replies: ticketData.replies || [],
      groupSuport: ticketData.groupSuport || "N1",
    };
    try {
      const newTicket = await useCreateTicket(payload);
      console.log("Ticket criado:", newTicket);

      // Auditoria de criação
      if (newTicket?.id) {
        const auditPayload: TicketAudit = {
          ticketId: newTicket.id,
          action: "CRIADO",
          performedBy: {
            id: user?.id || 0,
            name: user?.name || "",
            groupSuport: user?.groupLevel  || "N1",
          },
          message: `Ticket criado por ${user?.name || "usuário desconhecido"}.`,
          date: new Date().toISOString(),
        };

        await useCreateTicketAudit(auditPayload);
        console.log("Auditoria de criação registrada.");
      }

      handleReset();
    } catch (error) {
      console.error("Erro ao criar ticket ou auditoria:", error);
    }
  };

  const stepTitles: Record<number, string> = {
    1: "Ocorrência",
    2: "Informações do Cliente",
    3: "Comentários e Respostas",
    4: "Revisão Final",
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg">
          <Plus size={16} className="mr-2" />
          Novo Ticket
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] w-full overflow-y-auto p-6">
        <DialogHeader>
          <DialogDescription>Criar novo ticket Ocorrência</DialogDescription>
          <Progress
            value={(step / 4) * 100}
            className="bg-gray-200 dark:bg-gray-700 [&>div]:bg-primary mb-8"
          />
          <DialogTitle>{stepTitles[step]}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <Input
                type="text"
                placeholder="Título"
                value={ticketData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <Input
                type="text"
                placeholder="Descrição"
                value={ticketData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
              <Select
                onValueChange={(value) =>
                  handleChange("status", { status: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      ticketData.status?.status || "Selecione o status"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDENTE">PENDENTE</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) => handleChange("groupSuport", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={ticketData.groupSuport || "Grupo de Suporte"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N1">N1</SelectItem>
                  <SelectItem value="N2">N2</SelectItem>
                  <SelectItem value="N3">N3</SelectItem>
                  <SelectItem value="PRODUTO">PRODUTO</SelectItem>
                  <SelectItem value="MKT">MKT</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Expiração(horas)"
                value={ticketData.expiredAt || ""}
                onChange={(e) => handleChange("expiredAt", e.target.value)}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Input
                type="text"
                placeholder="Nome do cliente"
                value={ticketData.client?.name || ""}
                onChange={(e) =>
                  handleChange("client", {
                    ...ticketData.client,
                    name: e.target.value,
                  })
                }
              />
              <Input
                type="text"
                placeholder="Documento"
                value={ticketData.client?.document || ""}
                onChange={(e) =>
                  handleChange("client", {
                    ...ticketData.client,
                    document: e.target.value,
                  })
                }
              />
              <Input
                type="text"
                placeholder="Telefone"
                value={ticketData.client?.phone || ""}
                onChange={(e) =>
                  handleChange("client", {
                    ...ticketData.client,
                    phone: e.target.value,
                  })
                }
              />
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <p className="font-semibold mb-2">Comentários</p>
                {(ticketData.comments || []).map((comment, index) => (
                  <div
                    key={index}
                    className="space-y-2 p-1 mb-4 bg-secondary rounded-lg"
                  >
                    <Input
                      placeholder="Autor"
                      value={user?.name}
                      disabled
                      className="bg-background"
                      onChange={(e) =>
                        handleCommentChange(index, "author", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Mensagem"
                      className="bg-background"
                      value={comment.message}
                      onChange={(e) =>
                        handleCommentChange(index, "message", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Data"
                      className="bg-background"
                      type="date"
                      value={comment.date}
                      onChange={(e) =>
                        handleCommentChange(index, "date", e.target.value)
                      }
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addComment}>
                  Adicionar Comentário
                </Button>
              </div>

              <div>
                <p className="font-semibold mb-2 mt-6">Respostas</p>
                {(ticketData.replies || []).map((reply, index) => (
                  <div
                    key={index}
                    className="space-y-2 p-1 mb-4 bg-secondary rounded-lg"
                  >
                    <Input
                      placeholder="Autor"
                      className="bg-background"
                      value={reply.author}
                      onChange={(e) =>
                        handleReplyChange(index, "author", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Mensagem"
                      className="bg-background"
                      value={reply.message}
                      onChange={(e) =>
                        handleReplyChange(index, "message", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Data"
                      className="bg-background"
                      type="date"
                      value={reply.date}
                      onChange={(e) =>
                        handleReplyChange(index, "date", e.target.value)
                      }
                    />
                    <Select
                      onValueChange={(value) =>
                        handleReplyChange(
                          index,
                          "visibleToCustomer",
                          value === "true"
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            reply.visibleToCustomer
                              ? "Visível ao cliente"
                              : "Oculto do cliente"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Visível ao cliente</SelectItem>
                        <SelectItem value="false">Oculto do cliente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addReply}>
                  Adicionar Resposta
                </Button>
              </div>
            </>
          )}

          {step === 4 && (
            <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
              {JSON.stringify(ticketData, null, 2)}
            </pre>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleReset}
            variant="destructive"
            className="mr-auto"
          >
            Cancelar
          </Button>
          {step > 1 && (
            <Button onClick={handleBack} variant="outline">
              Voltar
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={handleNext}>Próximo</Button>
          ) : (
            <Button onClick={handleSubmit}>Criar ticket</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
