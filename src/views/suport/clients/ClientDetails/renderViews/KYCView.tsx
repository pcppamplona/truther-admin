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
            <CardTitle>
              Informações sobre o <strong>KYC</strong>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[#475467]">Nome do Cliente</p>
              <strong>{client?.name}</strong>
            </div>

            <div>
              <p className="text-[#475467]">E-mail</p>
              <strong>{userInfo?.email}</strong>
            </div>

            <div>
              <p className="text-[#475467]">Documento</p>
              <strong>{documentFormat(userInfo?.document)}</strong>
            </div>

            <div>
              <p className="text-[#475467]">Telefone</p>
              <strong>{phoneFormat(userInfo?.phone)}</strong>
            </div>

            <div>
              <p className="text-[#475467]">Ip de criação</p>
              <strong>{client?.ipCreate}</strong>
            </div>

            <div>
              <p className="text-[#475467]">Data criação</p>
              <strong>
                {dateFormat(client?.created_at)}{" "}
                <span className="text-[#475467] font-medium">às</span>{" "}
                {timeFormat(client?.created_at)}
              </strong>
            </div>

            <div>
              <p className="text-[#475467]">Provider</p>
              <strong>{client?.providerKyc}</strong>
            </div>

            <div>
              <p className="text-[#475467]">Tentativas</p>
              <strong>{client?.retryKyc}</strong>
            </div>

            <div>
              <p className="text-[#475467]">Estágio</p>
              <strong className={getStageClass(client)}>
                {getStageLabel(client)}
              </strong>
            </div>

            <div>
              <p className="text-[#475467]">Comentário</p>
              <strong>{client?.comment_kyc}</strong>
            </div>
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
              <p className="text-[#475467]">Selfie</p>
              <ModalImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2_oO4KOIumgPrZL2XNvR7Krj5qHEfyRy1pQ&s"
                alt="Selfie"
              />
            </div>
            <div className="space-y-2">
              <p className="text-[#475467]">Documento - Frente</p>

              <ModalImage
                src="https://files.readme.io/f2dfedb-us-template-front.png"
                alt="Selfie"
              />
            </div>

            <div className="space-y-2">
              <p className="text-[#475467]">Documento - Verso</p>
              <ModalImage
                src="https://files.readme.io/6c18515-us-template-back.png"
                alt="Selfie"
              />
            </div>

            <div className="items-start sm:col-span-2 flex flex-wrap gap-4">
              <Button
                className="text-white bg-[#00E588]"
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
                className="text-white bg-[#EA6565]"
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
                className="text-white bg-[#E59500]"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#cc8300")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#E59500")
                }
              >
                Refazer
              </Button>

              <Button className="text-white bg-gray-800 hover:bg-gray-900">
                Desinteresse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
