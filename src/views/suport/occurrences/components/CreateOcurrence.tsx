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
import { ChevronRight, CircleX, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getTicketInfoByTitle } from "./utilsOcurrences";
import { Textarea } from "@/components/ui/textarea";
import { useUserInfoDocument } from "@/services/clients/useUserinfo";
import { MaskInput } from "@/components/ui/maskInput";
import { UserInfoData } from "@/interfaces/userinfo-data";
import { documentFormat, getInitials } from "@/lib/formatters";

export function CreateOcurrence() {
  const { user } = useAuth();
  const [ticketData, setTicketData] = useState<Partial<TicketData>>({});

  const [document, setDocument] = useState("");
  const { data: userInfoData } = useUserInfoDocument(
    document.replace(/\D/g, "")
  );
  const [selectedUser, setSelectedUser] = useState<UserInfoData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (userInfoData && userInfoData.length > 0) {
      const user = userInfoData[0];
      handleChange("requester", {
        id: user.id,
        name: user.name,
        document: user.document,
        phone: user.phone,
      });
    }
  }, [userInfoData]);

  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));
  const handleReset = () => {
    setStep(1);
    setTicketData({});
  };

  const handleChange = (field: keyof TicketData, value: any) => {
    setTicketData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const payload: TicketData = {
      title: ticketData.title || "",
      description: ticketData.description || "",
      expiredAt: ticketData.expiredAt,
      status: {
        title: ticketData.status?.title,
        status: ticketData.status?.status,
        description: ticketData.status?.description,
      },
      groupSuport: user?.groupLevel,
      createdAt: new Date().toISOString(),
      createdBy: {
        id: user?.id || 0,
        name: user?.name || "",
        groupSuport: user?.groupLevel,
      },

      assignedTo: null,
      lastInteractedBy: undefined,
      requester: ticketData.requester || null,
      startedAt: "",
    };
    try {
      const newTicket = await useCreateTicket(payload);
      console.log("Ticket criado:", newTicket);

      // Auditoria de criação
      if (newTicket?.id) {
        const auditPayload: TicketAudit = {
          ticketId: newTicket.id,
          action: "Adicionou",
          performedBy: {
            id: user?.id || 0,
            name: user?.name || "",
            groupSuport: user?.groupLevel,
          },
          message: `um novo Ticket`,
          description: `Ticket criado por ${user?.name || "usuário desconhecido"}.`,
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
    2: "Informações do Requerente",
    3: "Revisão Final",
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
            value={(step / 3) * 100}
            className="bg-gray-200 dark:bg-gray-700 [&>div]:bg-primary mb-8"
          />
          <DialogTitle>{stepTitles[step]}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <Select
                onValueChange={(value) => {
                  const info = getTicketInfoByTitle(value);
                  handleChange("title", value);
                  handleChange("description", info.description);
                  handleChange("expiredAt", info.expiredAt);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={ticketData.title || "Título"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Erro de KYC">Erro de KYC</SelectItem>
                  <SelectItem value="N3 KYC ERROR">N3 KYC ERROR</SelectItem>
                  <SelectItem value="Retorno de KYC ERROR pro anterior">
                    Retorno de KYC ERROR pro anterior
                  </SelectItem>
                  <SelectItem value="Avaliação de tratativa de evento">
                    Avaliação de tratativa de evento
                  </SelectItem>
                  <SelectItem value="EMAIL AJUDA UNIVERSITARIOS">
                    EMAIL AJUDA UNIVERSITARIOS
                  </SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Descrição"
                value={ticketData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />

              <Input
                type="number"
                placeholder="Expiração(horas)"
                value={ticketData.expiredAt || ""}
                onChange={(e) => handleChange("expiredAt", e.target.value)}
                disabled
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
            </>
          )}

          {step === 2 && (
            <>
              <Select
                onValueChange={(value) => {
                  setSelectedOption(value);
                  if (value === "none") {
                    setSelectedUser(null);
                    handleChange("requester", null);
                  } else if (value === "client") {
                  } else if (value === "create") {
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de remetente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">
                    Remetente cliente Truther
                  </SelectItem>
                  <SelectItem value="none">Sem remetente</SelectItem>
                  <SelectItem value="create">Cadastrar remetente</SelectItem>
                </SelectContent>
              </Select>

              {selectedOption === "client" && (
                <>
                  <MaskInput
                    mask={
                      document.replace(/\D/g, "").length > 11
                        ? "99.999.999/9999-99"
                        : "999.999.999-99"
                    }
                    value={document}
                    onChange={(val) => {
                      setDocument(val);
                      setSelectedUser(null);
                      handleChange("requester", undefined);
                    }}
                    placeholder="Documento"
                  />

                  {/* FlashCard */}
                  {document.replace(/\D/g, "").length >= 11 &&
                    !selectedUser &&
                    Array.isArray(userInfoData) &&
                    userInfoData.length > 0 && (
                      <div className="bg-muted border rounded-md shadow-md hover:bg-input">
                        {userInfoData.map((user) => (
                          <div
                            key={user.id}
                            className="p-4 cursor-pointer space-y-4"
                            onClick={() => {
                              setSelectedUser(user);
                              handleChange("requester", {
                                id: user.id,
                                name: user.name,
                                document: user.document,
                                phone: user.phone,
                              });
                            }}
                          >
                            <div className="flex items-center rounded-lg">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary">
                                {getInitials(user.name)}
                              </div>
                              <div className="flex flex-col overflow-hidden ml-4">
                                <span className="truncate font-medium text-sm text-gray-900 dark:text-white">
                                  {user.name}
                                </span>
                                <span className="truncate text-xs ">
                                  {documentFormat(user.document)}
                                </span>
                              </div>
                              <ChevronRight className="ml-auto size-4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Dados do requerente fixados após seleção */}
                  {selectedUser && (
                    <div className="flex items-center rounded-lg border-l-2 border-l-primary p-4 cursor-pointer">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary">
                        {getInitials(selectedUser.name)}
                      </div>
                      <div className="flex flex-col overflow-hidden ml-4">
                        <span className="truncate font-medium text-sm">
                          {selectedUser.name}
                        </span>
                        <span className="truncate text-xs ">
                          {documentFormat(selectedUser.document)}
                        </span>
                      </div>
                      <CircleX
                        className="ml-auto size-4 text-destructive"
                        onClick={() => {
                          setSelectedUser(null);
                          setDocument("");
                          handleChange("requester", undefined);
                        }}
                      />
                    </div>
                  )}
                </>
              )}

              {selectedOption === "create" && (
                <div className="mt-4 text-muted-foreground italic">
                  Função de cadastro de remetente ainda não implementada.
                </div>
              )}
            </>
          )}

          {step === 3 && (
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
          {step < 3 ? (
            <Button onClick={handleNext}>Próximo</Button>
          ) : (
            <Button onClick={handleSubmit}>Criar ticket</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
