import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  dateFormat,
  documentFormat,
  getFlagUrl,
  phoneFormat,
  timeFormat,
} from "@/lib/formatters";
import {
  ArrowLeftRight,
  ChevronsDown,
  ChevronsUp,
  ExternalLink,
  MapPinHouse,
  User,
} from "lucide-react";
import { ClientInfoProps } from "..";
import { Info } from "@/components/info";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserTransactions } from "@/services/transactions/useUserTransactions";
import { getColorRGBA, txStatusColors } from "@/lib/utils";

export default function UserInfo({ userInfo }: ClientInfoProps) {
  const page = 1;
  const limit = 5;

  const { data, isLoading, isError } = useUserTransactions(
    userInfo?.document ?? "",
    page,
    limit
  );

  const transactions = data?.data ?? [];

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
            <Info label="Nome da Mãe" value={userInfo?.mothers_name} />

            <div>
              <p className="text-muted-foreground">País</p>
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
              <p className="text-muted-foreground">uuid</p>
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
                <p className="text-muted-foreground flex items-center">
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
          <CardDescription>
            Últimas 5 transações efetuadas por <strong className="bold">{userInfo?.name}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 lg:px-6 pt-0 pb-4">
          {isLoading ? (
            <p>Carregando transações...</p>
          ) : isError ? (
            <p>Erro ao carregar transações.</p>
          ) : transactions.length === 0 ? (
            <p>Nenhuma transação encontrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Flow</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Origem</TableCell>
                  <TableCell>Destino</TableCell>
                  <TableCell>Moeda</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className="cursor-pointer hover:bg-input transition"
                  >
                    <TableCell>{tx.id}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      {tx.flow === "IN" ? (
                        <ChevronsUp  />
                      ) : (
                        <ChevronsDown className="text-green-500"/>
                      )}
                      {tx.flow}
                    </TableCell>
                    <TableCell>{dateFormat(tx.created_at)}</TableCell>
                    <TableCell>{timeFormat(tx.created_at)}</TableCell>
                    <TableCell>
                      <div
                        className="px-3 py-2 rounded-lg text-xs font-semibold uppercase text-center w-full"
                        style={{
                          backgroundColor: getColorRGBA(
                            tx.status ?? "",
                            txStatusColors,
                            0.1
                          ),
                          color: getColorRGBA(
                            tx.status ?? "",
                            txStatusColors,
                            0.9
                          ),

                          width: "fit-content",
                        }}
                      >
                        {tx.status}
                      </div>
                    </TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.from_address}</TableCell>
                    <TableCell>{tx.to_address}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            {
                              USDT: "/usdt.png",
                              BTC: "/bitcoin.png",
                              ETH: "/eth.png",
                              BRL: "/brl.png",
                              VRL: "/vrl.png",
                            }[tx.symbol?.toUpperCase() ?? ""] || "/default.png"
                          }
                          alt={tx.symbol ?? "token"}
                          className="w-5 h-5 object-contain"
                        />
                        <span className="uppercase">{tx.symbol ?? "-"}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
