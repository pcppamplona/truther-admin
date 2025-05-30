import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { documentFormat, getFlagUrl, phoneFormat } from "@/lib/formatters";
import { ExternalLink, MapPinHouse, User } from "lucide-react";
import { ClientInfoProps } from "..";
import { Info } from "@/components/info";

export default function UserInfo({ userInfo }: ClientInfoProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              <User /> Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Info label="Nome" value={userInfo?.name} />
            <Info label="E-mail" value={userInfo?.email} />
            <Info
              label="Documento"
              value={documentFormat(userInfo?.document)}
            />
            <Info label="Telefone" value={phoneFormat(userInfo?.phone)} />
            <Info label="Nascimento" value={userInfo?.birthday} />
            <Info label="Nome da Mãe" value={userInfo?.mothersName} />

            <div>
              <p className="text-[#475467]">País</p>
              <strong className="flex items-center gap-2">
                <img
                  src={getFlagUrl(userInfo?.nationality ?? "")}
                  alt={userInfo?.nationality}
                  className="w-6 h-5 rounded-lg"
                />
                {userInfo?.nationality}
              </strong>
            </div>

            <div>
              <p className="text-[#475467]">uuid</p>
              <strong>{userInfo?.uuid}</strong>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              <MapPinHouse /> Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Info label="CEP" value={userInfo?.cep} />
            <Info
              label="Rua"
              value={`${userInfo?.street} - ${userInfo?.house_number}`}
            />
            <Info label="Bairro" value={userInfo?.neighborhood} />
            <Info label="Cidade" value={userInfo?.city} />
            <Info label="Estado" value={userInfo?.state?.toUpperCase()} />

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${userInfo?.location.replace(
                " / ",
                ","
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="cursor-pointer">
                <p className="text-[#475467] flex items-center">
                  Localização
                  <ExternalLink size={14} className="ml-2" />
                </p>
                <strong className="uppercase">{userInfo?.location}</strong>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
