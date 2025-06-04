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
import { SquareUserRound } from "lucide-react";

export function KYCView({ client, userInfo }: ClientInfoProps) {
  function getStageLabel(client: any): string {
    if (client?.disinterest) return "Banido";

    switch (client?.stage_kyc) {
      case 0:
        return "Não começou o KYC";
      case 1:
        return "Formulário preenchido (pendente)";
      case 2:
        return "Aprovado automaticamente";
      case 3:
        return "Rejeitado";
      case 4:
        if (client.kyc_approved && client.banking_enable) {
          return "Decisão manual: Aprovado";
        } else {
          return "Decisão manual: Reprovado";
        }
      default:
        return "Desconhecido";
    }
  }

  function getStageClass(client: any): string {
    if (client?.disinterest) return "text-red-700";

    switch (client?.stage_kyc) {
      case 0:
        return "text-gray-500";
      case 1:
        return "text-yellow-600";
      case 2:
        return "text-green-600";
      case 3:
        return "text-red-600";
      case 4:
        if (client.kyc_approved && client.banking_enable) {
          return "text-green-700";
        } else {
          return "text-red-700";
        }
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
              <SquareUserRound />
              Informações sobre o <strong>KYC</strong>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Info label="Nome do Cliente" value={client?.name} />
            <Info label="E-mail" value={userInfo?.email} />
            <Info
              label="Documento"
              value={documentFormat(userInfo?.document)}
            />
            <Info label="Telefone" value={phoneFormat(userInfo?.phone)} />
            <Info label="Ip de criação" value={client?.ipCreate} />
            <Info
              label="Data criação"
              value={`${dateFormat(client?.created_at)} às ${timeFormat(
                client?.created_at
              )}`}
            />
            <Info label="Provider" value={client?.providerKyc} />
            <Info label="Tentativas" value={client?.retryKyc} />
            <Info
              label="Estágio"
              value={
                <span className={getStageClass(client)}>
                  {getStageLabel(client)}
                </span>
              }
            />
            <Info label="Comentário" value={client?.comment_kyc} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Mídias enviadas por <strong>{client?.name}</strong>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <p>Selfie</p>
              <ModalImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2_oO4KOIumgPrZL2XNvR7Krj5qHEfyRy1pQ&s"
                alt="Selfie"
              />
            </div>
            <div className="space-y-2">
              <p>Documento - Frente</p>

              <ModalImage
                src="https://files.readme.io/f2dfedb-us-template-front.png"
                alt="Selfie"
              />
            </div>

            <div className="space-y-2">
              <p>Documento - Verso</p>
              <ModalImage
                src="https://files.readme.io/6c18515-us-template-back.png"
                alt="Selfie"
              />
            </div>

            <div className="items-start sm:col-span-2 flex flex-wrap gap-4">
              <Button
                className="bg-primary"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#00cf74")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#00E588")
                }
              >
                Aprovar
              </Button>

              <Button
                className="bg-destructive"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#d75252")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#EA6565")
                }
              >
                Rejeitar
              </Button>

              <Button
                className="bg-chart-3"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#cc8300")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#E59500")
                }
              >
                Refazer
              </Button>

              <Button className="bg-chart-2 hover:bg-gray-900">
                Desinteresse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
