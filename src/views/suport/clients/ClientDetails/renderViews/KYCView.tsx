import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  dateFormat,
  documentFormat,
  phoneFormat,
  timeFormat,
} from "@/lib/formatters";
import { ClientInfoProps } from "..";
import { Button } from "@/components/ui/button";
import { ModalImage } from "./components/modalImage";
import { Info } from "@/components/info";
import { ImageOff, Image, UserRound } from "lucide-react";
import { DataUserUser } from "@/interfaces/DataUser";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ApproveKycDialog } from "./components/ApproveKycDialog";
import { RejectKycDialog } from "./components/RejectKycDialog";
import { RetryKycDialog } from "./components/RetryKycDialog";
import { DisinterestKycDialog } from "./components/DisinterestDialog";

export function KYCView({ userInfo }: ClientInfoProps) {
  const selfie = userInfo?.paht.find((p) => p.type === "selfie");
  const front = userInfo?.paht.find((p) => p.type === "documentFront");
  const back = userInfo?.paht.find((p) => p.type === "documentBack");

  function getStageLabel(data: DataUserUser): string {
    if (data.disinterest) return "Banido";

    switch (data.stage_kyc) {
      case 0:
        return "Não começou o KYC";
      case 1:
        return "Formulário preenchido (pendente)";
      case 2:
        return "Aprovado automaticamente";
      case 3:
        return "Desinteresse";
      case 4:
        return data?.kyc_approved && data?.banking_enable
          ? "Decisão manual: Aprovado"
          : "Decisão manual: Reprovado";
      case 5:
        return "Em análise manual";
      case 6:
        return "Abertura temporária de KYC";
      case 7:
        return "Stage inválido";
      case 8:
        return "Usuário legado";
      default:
        return "Desconhecido";
    }
  }

  function getStageClass(data: DataUserUser): string {
    if (data.disinterest) return "text-red-700";

    switch (data.stage_kyc) {
      case 0:
        return "text-gray-500";
      case 1:
        return "text-yellow-600";
      case 2:
        return "text-green-600";
      case 3:
        return "text-red-600";
      case 4:
        return data?.kyc_approved && data?.banking_enable
          ? "text-green-700"
          : "text-red-700";
      case 5:
        return "text-blue-600";
      case 6:
        return "text-purple-600";
      case 7:
        return "text-gray-400";
      case 8:
        return "text-gray-600";
      default:
        return "text-gray-400";
    }
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              <UserRound />
              Informações sobre o <strong className="text-foreground font-bold">KYC</strong>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <Info label="Nome do Cliente" value={userInfo?.res.user.name} />
            <Info label="E-mail" value={userInfo?.res.email} />
            <Info
              label="Tipo-Documento"
              value={documentFormat(userInfo?.res.document)}
            />
            <Info
              label="Documento"
              value={documentFormat(userInfo?.res.document)}
            />
            <Info label="Telefone" value={phoneFormat(userInfo?.res.phone)} />
            <Info label="Ip de criação" value={userInfo?.res.user.ipCreate} />
            <Info
              label="Data criação"
              value={`${dateFormat(
                userInfo?.res.user.createdAt ?? ""
              )} às ${timeFormat(userInfo?.res.user.createdAt ?? "")}`}
            />
            <Info label="Provider" value={userInfo?.res.user.providerKyc} />
            <Info label="Tentativas" value={userInfo?.res.user.retryKyc} />
            {userInfo && (
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Estágio</p>

                <div
                  className={`text-sm w-full min-w-0 break-words whitespace-pre-wrap ${getStageClass(
                    userInfo.res.user
                  )}`}
                >
                  {getStageLabel(userInfo.res.user)}
                </div>
              </div>
            )}

            <Info label="Comentário" value={userInfo?.res.user.comment_kyc} />

            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="kyc-approved"
                checked={userInfo?.res.user.kyc_approved ?? false}
              />
              <Label htmlFor="kyc-approved">Kyc-approved</Label>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="banking-enable"
                checked={userInfo?.res.user.banking_enable ?? false}
              />
              <Label htmlFor="banking-enable">Banking Enable</Label>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="desinteresse"
                checked={userInfo?.res.user.disinterest ?? false}
              />
              <Label htmlFor="desinteresse">Desinteresse</Label>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="restrict"
                checked={userInfo?.res.user.restrict ?? false}
              />
              <Label htmlFor="restrict">Restrict</Label>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="canTransact"
                checked={userInfo?.res.user.canTransact ?? false}
              />
              <Label htmlFor="canTransact">CanTransact</Label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="regenerateKyc"
                checked={userInfo?.res.user.regenerateKyc ?? false}
              />
              <Label htmlFor="regenerateKyc">RegenerateKyc</Label>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="override_instant_pay"
                checked={userInfo?.res.user.override_instant_pay ?? false}
              />
              <Label htmlFor="override_instant_pay">Override_instant_pay</Label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="master_instant_pay"
                checked={userInfo?.res.user.master_instant_pay ?? false}
              />
              <Label htmlFor="master_instant_pay">Master_instant_pay</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              <Image />
              Mídias enviadas por <strong className="text-foreground font-bold">{userInfo?.res.name}</strong>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between space-y-4 h-full">
            <div className="flex flex-row justify-between gap-6 w-full">
              <div className="flex flex-col space-y-2 w-full">
                <p>Selfie</p>
                {selfie?.path ? (
                  <div className="w-full h-full overflow-hidden rounded-md">
                    <ModalImage
                      src={selfie.path}
                      alt="Selfie"
                      className="w-full h-full overflow-hidden rounded-md object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded border border-border h-[280px] object-cover w-full items-center flex flex-col justify-center">
                    <ImageOff className="text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Não enviada</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2 w-full">
                <p>Documento - Frente</p>
                {front?.path ? (
                  <div className="w-full h-full overflow-hidden rounded-md">
                    <ModalImage
                      src={front.path}
                      alt="Documento Frente"
                      className="w-full h-full overflow-hidden rounded-md object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded border border-border h-[280px] object-cover w-full items-center flex flex-col justify-center">
                    <ImageOff className="text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Não enviada</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2 w-full">
                <p>Documento - Verso</p>
                {back?.path ? (
                  <div className="w-full h-full overflow-hidden rounded-md">
                    <ModalImage
                      src={back.path}
                      alt="Documento Verso"
                      className="w-full h-full overflow-hidden rounded-md object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded border border-border h-[280px] object-cover w-full items-center flex flex-col justify-center">
                    <ImageOff className="text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Não enviada</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-row justify-between gap-4 sm:col-span-2">
              <ApproveKycDialog
                document={userInfo?.res.document ?? ""}
                trigger={
                  <Button
                    className="flex-1 bg-primary"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#00cf74")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#00E588")
                    }
                  >
                    Aprovar
                  </Button>
                }
              />

              <RejectKycDialog
                document={userInfo?.res.document ?? ""}
                trigger={
                  <Button
                    className="flex-1 bg-destructive text-white"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#d75252")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#EA6565")
                    }
                  >
                    Rejeitar
                  </Button>
                }
              />

              <RetryKycDialog
                document={userInfo?.res.document ?? ""}
                trigger={
                  <Button
                    className="flex-1 bg-chart-3"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#cc8300")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#E59500")
                    }
                  >
                    Refazer
                  </Button>
                }
              />

              <DisinterestKycDialog
                document={userInfo?.res.document ?? ""}
                trigger={
                  <Button className="flex-1 bg-chart-2 hover:bg-gray-900">
                    Desinteresse
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
