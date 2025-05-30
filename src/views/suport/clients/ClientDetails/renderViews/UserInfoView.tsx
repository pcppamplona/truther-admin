import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { documentFormat, getFlagUrl, phoneFormat } from "@/lib/formatters";
import { ExternalLink, MapPinHouse, User } from "lucide-react";
import { ClientInfoProps } from "..";

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
            <div>
              <p className="text-[#475467]">Nome</p>
              <strong>{userInfo?.name}</strong>
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
              <p className="text-[#475467]">Nascimento</p>
              <strong>{userInfo?.birthday}</strong>
            </div>

            <div>
              <p className="text-[#475467]">Nome da Mãe</p>
              <strong>{userInfo?.mothersName}</strong>
            </div>

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
            <div>
              <p className="text-[#475467]">CEP</p>
              <strong>{userInfo?.cep}</strong>
            </div>

            <div>
              <p className="text-[#475467]">Rua</p>
              <strong>
                {userInfo?.street} - {userInfo?.house_number}
              </strong>
            </div>

            <div>
              <p className="text-[#475467]">Bairro</p>
              <strong>{userInfo?.neighborhood}</strong>
            </div>

            <div>
              <p className="text-[#475467]">Cidade</p>
              <strong>{userInfo?.city}</strong>
            </div>

            <div>
              <p className="text-[#475467]">Estado</p>
              <strong className="uppercase">{userInfo?.state}</strong>
            </div>

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
