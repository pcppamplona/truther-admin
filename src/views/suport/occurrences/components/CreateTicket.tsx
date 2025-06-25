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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/store/auth";
import { ChevronRight, CircleX, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { MaskInput } from "@/components/ui/maskInput";
import { UserInfoData } from "@/interfaces/userinfo-data";
import { documentFormat, getInitials } from "@/lib/formatters";
import { useUserInfoDocument } from "@/services/clients/useUserinfo";
import {
  useCreateTicket,
  useCreateTicketAudit,
} from "@/services/Tickets/useTickets";
import {
  TicketData,
  Reason,
  Group,
  groupHierarchy,
  TicketAudit,
} from "@/interfaces/ticket-data";
import {
  getReasonsByCategory,
  getTicketCategories,
} from "@/services/Tickets/useReasons";
import { useUsers } from "@/services/users/useUsers";

export function CreateTicket() {
  const { user } = useAuth();
  const [ticketData, setTicketData] = useState<Partial<TicketData>>({});
  const [document, setDocument] = useState("");
  const { data: userInfoData } = useUserInfoDocument(
    document.replace(/\D/g, "")
  );

  const { data: users } = useUsers();

  const [selectedUser, setSelectedUser] = useState<UserInfoData | null>(null);
  const [selectedOption, setSelectedOption] = useState<
    "user" | "group" | null | string
  >(null);

  const [step, setStep] = useState(1);

  const [categories, setCategories] = useState<{ id: number; type: string }[]>(
    []
  );
  const [reasons, setReasons] = useState<Reason[]>([]);

  useEffect(() => {
    getTicketCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (userInfoData && userInfoData.length > 0) {
      const selected = userInfoData[0];
      handleChange("client", {
        id: selected.id,
        name: selected.name,
        document: selected.document,
        phone: selected.phone,
        createdAt: new Date().toISOString(),
      });
    }
  }, [userInfoData]);

  const handleChange = (field: keyof TicketData, value: any) => {
    setTicketData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));
  const handleReset = () => {
    setStep(1);
    setTicketData({});
    setDocument("");
    setSelectedUser(null);
    setSelectedOption(null);
    setReasons([]);
  };

  const handleSubmit = async () => {
    if (!ticketData.reason || !user) return;

    const payload: TicketData = {
      createdBy: {
        id: user.id,
        name: user.name,
        group: user.groupLevel as any,
      },
      client: ticketData.client || null,
      assignedTo: ticketData.assignedTo || null,
      reason: ticketData.reason,
      status: "PENDENTE",
      createdAt: new Date().toISOString(),
    };

    try {
      const newTicket = await useCreateTicket(payload);

      if (newTicket?.id) {
        const auditPayload: TicketAudit = {
          ticketId: newTicket.id,
          action: "Adicionou",
          performedBy: {
            id: user.id,
            name: user.name,
            group: user.groupLevel,
          },
          message: `Novo ticket criado`,
          description: `Ticket criado por ${user.name}.`,
          date: new Date().toISOString(),
        };
        await useCreateTicketAudit(auditPayload);
      }

      handleReset();
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
    }
  };

  const stepTitles: Record<number, string> = {
    1: "Categoria e Motivo",
    2: "Informações do Cliente",
    3: "Confirmação do Receptor",
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
          <DialogDescription>Criar novo ticket</DialogDescription>
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
                  console.log("Categoria selecionada:", value);

                  handleChange("reason", undefined);

                  getReasonsByCategory(Number(value)).then((reasons) => {
                    const reasonsParsed = reasons.map((r) => ({
                      ...r,
                      id: Number(r.id),
                      categoryId: String(r.categoryId),
                      expiredAt: String(r.expiredAt),
                    }));
                    setReasons(reasonsParsed);
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {reasons.length > 0 && (
                <Select
                  onValueChange={(value) => {
                    console.log(
                      "Valor recebido no onValueChange do motivo:",
                      value
                    );
                    const selected = reasons.find(
                      (r) => String(r.id) === value
                    );
                    console.log("Motivo encontrado:", selected);

                    if (selected) {
                      handleChange("reason", selected);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map((reason) => (
                      <SelectItem key={reason.id} value={String(reason.id)}>
                        {reason.reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {ticketData.reason && (
                <Textarea
                  value={ticketData.reason.description}
                  placeholder="Descrição"
                />
              )}
            </>
          )}

          {step === 2 && (
            <>
              <Select
                onValueChange={(value) => {
                  setSelectedOption(value);
                  if (value === "none") {
                    setSelectedUser(null);
                    handleChange("client", null);
                  } else if (value === "client") {
                  } else if (value === "create") {
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo do client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Cliente Truther</SelectItem>
                  <SelectItem value="none">Sem remetente</SelectItem>
                  <SelectItem value="create">Cadastrar cliente</SelectItem>
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
                      handleChange("client", undefined);
                    }}
                    placeholder="Documento"
                  />

                  {document.replace(/\D/g, "").length >= 11 &&
                    !selectedUser &&
                    Array.isArray(userInfoData) &&
                    userInfoData.length > 0 && (
                      <div className="bg-muted border rounded-md">
                        {userInfoData.map((user) => (
                          <div
                            key={user.id}
                            className="p-4 cursor-pointer space-y-4"
                            onClick={() => {
                              setSelectedUser(user);
                              handleChange("client", {
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
                                <span className="truncate font-medium text-sm">
                                  {user.name}
                                </span>
                                <span className="truncate text-xs">
                                  {documentFormat(user.document)}
                                </span>
                              </div>
                              <ChevronRight className="ml-auto size-4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

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
                          handleChange("client", undefined);
                        }}
                      />
                    </div>
                  )}
                </>
              )}

              {selectedOption === "create" && (
                <div className="mt-4 text-muted-foreground italic">
                  Cadastro de cliente ainda não implementado.
                </div>
              )}
            </>
          )}

          {step === 3 && ticketData.reason && (
            <>
              {ticketData.reason.typeRecipient === "GROUP" &&
                typeof ticketData.reason.recipient === "string" && (
                  <div className="p-4 rounded border bg-muted">
                    <p className="text-sm">
                      O ticket será encaminhado automaticamente para o grupo:{" "}
                      <strong>{ticketData.reason.recipient}</strong>
                    </p>
                  </div>
                )}

              {ticketData.reason.typeRecipient === "USER" && (
                <div className="p-4 rounded border bg-muted space-y-2">
                  <p className="text-sm">Selecione o usuário destinatário:</p>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {users?.map((user) => {
                      const userObj = {
                        id: user.id,
                        name: user.name,
                        group: user.groupLevel,
                      };

                      const isSelected =
                        ticketData.assignedTo !== null &&
                        typeof ticketData.assignedTo === "object" &&
                        "id" in ticketData.assignedTo &&
                        ticketData.assignedTo.id === user.id;

                      return (
                        <div
                          key={user.id}
                          className={`flex items-center rounded-lg p-2 cursor-pointer transition hover:bg-muted-foreground/10 ${
                            isSelected ? "bg-primary text-white" : ""
                          }`}
                          onClick={() => {
                            handleChange("assignedTo", userObj);
                            handleChange("reason", {
                              ...ticketData.reason!,
                              recipient: "USER",
                            });
                          }}
                        >
                          <div
                            className={`flex items-center justify-center h-10 w-10 rounded-full ${
                              isSelected
                                ? "bg-white text-primary"
                                : "bg-primary text-white"
                            }`}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div className="flex flex-col overflow-hidden ml-4">
                            <span className="truncate font-medium text-sm">
                              {user.name}
                            </span>
                            <span className="truncate text-xs">
                              {user.username}
                            </span>
                          </div>
                          <ChevronRight className="ml-auto size-4" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {ticketData.reason.typeRecipient === "ALL" && (
                <>
                  <Select
                    onValueChange={(value) => {
                      if (value === "USER") {
                        setSelectedOption("user");
                        handleChange("reason", {
                          ...ticketData.reason!,
                          recipient: null,
                        });
                        handleChange("assignedTo", undefined);
                      } else {
                        setSelectedOption("group");
                        handleChange("reason", {
                          ...ticketData.reason!,
                          recipient: value as Group,
                        });
                        handleChange("assignedTo", undefined);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha destinatário: grupo ou usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Selecionar Usuário</SelectItem>
                      {Object.keys(groupHierarchy).map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedOption === "user" && (
                    <div className="p-4 rounded-lg border space-y-2 mt-4">
                      <p className="text-sm">
                        Selecione o usuário destinatário:
                      </p>

                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {users?.map((user) => {
                          const userObj = {
                            id: user.id,
                            name: user.name,
                            group: user.groupLevel,
                          };

                          const isSelected =
                            ticketData.assignedTo !== null &&
                            typeof ticketData.assignedTo === "object" &&
                            "id" in ticketData.assignedTo &&
                            ticketData.assignedTo.id === user.id;

                          return (
                            <div
                              key={user.id}
                              className={`flex items-center rounded-lg p-2 cursor-pointer transition hover:bg-muted-foreground/10 ${
                                isSelected ? "bg-primary text-white" : ""
                              }`}
                              onClick={() => {
                                handleChange("assignedTo", userObj);
                                handleChange("reason", {
                                  ...ticketData.reason!,
                                  recipient: userObj,
                                });
                              }}
                            >
                              <div
                                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                                  isSelected
                                    ? "bg-white text-primary"
                                    : "bg-primary text-white"
                                }`}
                              >
                                {getInitials(user.name)}
                              </div>
                              <div className="flex flex-col overflow-hidden ml-4">
                                <span className="truncate font-medium text-sm">
                                  {user.name}
                                </span>
                                <span className="truncate text-xs">
                                  {user.username}
                                </span>
                              </div>
                              <ChevronRight className="ml-auto size-4" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedOption === "group" &&
                    typeof ticketData.reason.recipient === "string" && (
                      <div className="p-2 mt-2 rounded bg-muted">
                        <p className="text-sm">
                          Grupo selecionado:{" "}
                          <strong>{ticketData.reason.recipient}</strong>
                        </p>
                      </div>
                    )}
                </>
              )}
            </>
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
            <Button
              onClick={() => {
                console.log("Ticket Data no passo:", ticketData);
                handleNext();
              }}
              disabled={!ticketData.reason}
            >
              Próximo
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Criar ticket</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
