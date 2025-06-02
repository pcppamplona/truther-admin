import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  dateFormat,
  documentFormat,
  getFlagUrl,
  phoneFormat,
} from "@/lib/formatters";
import { ArrowLeftRight, ExternalLink, MapPinHouse, User } from "lucide-react";
import { ClientInfoProps } from "..";
import { Info } from "@/components/info";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const data = [
  {
    id: "1",
    createdAt: "2025-05-30T08:15:00Z",
    typeNotification: "BLOCKCHAIN",
    origin: "0x1aB3fD91fABc1234567890",
    destiny: "0x9cE5Df12aBCe9876543210",
    coin: "USDT"
  },
  {
    id: "2",
    createdAt: "2025-05-30T09:45:00Z",
    typeNotification: "BLOCKCHAIN",
    origin: "0x3bC6eF72aDEF2233445566",
    destiny: "0x6fD4aE31bCCa1122334455",
    coin: "BTC"
  },
  {
    id: "3",
    createdAt: "2025-05-30T10:30:00Z",
    typeNotification: "TRANSFERÊNCIA",
    origin: "Banco 237 - Conta 123456-7",
    destiny: "Banco 001 - Conta 987654-3",
    coin: "BRL"
  },
  {
    id: "4",
    createdAt: "2025-05-30T11:00:00Z",
    typeNotification: "PIX",
    origin: "julio@email.com",
    destiny: "cpf: 123.456.789-00",
    coin: "BRL"
  },
  {
    id: "5",
    createdAt: "2025-05-30T11:30:00Z",
    typeNotification: "BLOCKCHAIN",
    origin: "0x7eA1B92CcEf45678901234",
    destiny: "0x4fC3D12bBAcD5678901234",
    coin: "ETH"
  },
  {
    id: "6",
    createdAt: "2025-05-30T12:00:00Z",
    typeNotification: "TRANSFERÊNCIA",
    origin: "Banco 104 - Conta 000112-0",
    destiny: "Banco 033 - Conta 998877-1",
    coin: "BRL"
  }

];

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
      <Card>
        
        <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              <ArrowLeftRight /> Transações
            </CardTitle>
            <CardDescription>Todas as transações efetuadas por {userInfo?.name}</CardDescription>
          </CardHeader>
        <CardContent className="px-4 lg:px-6 pt-0 pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-semibold text-gray-500">
                  ID
                </TableCell>
                <TableCell className="font-semibold text-gray-500">
                  Data
                </TableCell>
                <TableCell className="font-semibold text-gray-500">
                  Tipo
                </TableCell>
                <TableCell className="font-semibold text-gray-500">
                  Origem
                </TableCell>
                <TableCell className="font-semibold text-gray-500">
                  Destino
                </TableCell>
                <TableCell className="font-semibold text-gray-500">
                  Moeda
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((notification) => (
                <TableRow
                  key={notification.id}
                  className="cursor-pointer hover:bg-gray-50 transition"
                >
                  <TableCell>{notification.id}</TableCell>
                  <TableCell>{dateFormat(notification.createdAt)}</TableCell>
                  <TableCell>{notification.typeNotification}</TableCell>
                  <TableCell>{notification.origin}</TableCell>
                  <TableCell>{notification.destiny}</TableCell>
                  <TableCell>{notification.coin}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
