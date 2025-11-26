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
  FolderOpen,
  MapPinHouse,
  User,
} from "lucide-react";
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
import { SkeletonTableFull } from "@/components/skeletons/skeletonTableFull";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { DataUser } from "@/interfaces/DataUser";
import { SkeletonCardLine } from "@/components/skeletons/skeletonCardline";

export interface UserInfoProps {
  userInfo: DataUser | undefined;
  loading?: boolean;
}

export default function UserInfo({ userInfo, loading }: UserInfoProps) {
  const page = 1;
  const limit = 5;

  const { data, isLoading, isError, refetch } = useUserTransactions(
    userInfo?.res.document ?? "",
    page,
    limit
  );

  const transactions = data?.data ?? [];

  const isLoadingContent = loading || isLoading;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              <User /> Informações Pessoais
            </CardTitle>
            <CardDescription>
              Dados de identificação e registro vinculados ao cliente.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoadingContent ? (
              <SkeletonCardLine />
            ) : (
              <>
                <Info label="Nome" value={userInfo?.res.name} />
                <Info label="E-mail" value={userInfo?.res.email} />
                <Info
                  label="Documento"
                  value={documentFormat(userInfo?.res.document)}
                />
                <Info
                  label="Telefone"
                  value={phoneFormat(userInfo?.res.phone)}
                />
                <Info label="Nascimento" value={userInfo?.res.birthday} />
                <Info label="Nome da Mãe" value={userInfo?.res.mothersName} />

                <div>
                  <p className="text-muted-foreground">País</p>
                  <strong className="flex items-center gap-2">
                    <img
                      src={getFlagUrl(userInfo?.res.nationality ?? "")}
                      alt={userInfo?.res.nationality}
                      className="w-6 h-5 rounded-lg"
                    />
                    {userInfo?.res.nationality}
                  </strong>
                </div>
                <Info label="uuid" value={userInfo?.res.uuid} />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              <MapPinHouse /> Endereço
            </CardTitle>
            <CardDescription>
              Detalhes do local de residência ou correspondência do cliente.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoadingContent ? (
              <SkeletonCardLine />
            ) : (
              <>
                <Info label="CEP" value={userInfo?.res.cep} />
                <Info
                  label="Rua"
                  value={`${userInfo?.res.street} - ${userInfo?.res.houseNumber}`}
                />
                <Info label="Bairro" value={userInfo?.res.neighborhood} />
                <Info label="Cidade" value={userInfo?.res.city} />
                <Info
                  label="Estado"
                  value={userInfo?.res.state?.toUpperCase()}
                />

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${userInfo?.res.location.replace(
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
                    <strong className="uppercase">
                      {userInfo?.res.location}
                    </strong>
                  </div>
                </a>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row items-center gap-2">
            <ArrowLeftRight /> Transações
          </CardTitle>
          <CardDescription>
            Últimas 5 transações efetuadas por{" "}
            <strong className="bold">{userInfo?.res.name}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 lg:px-6 pt-0 pb-4">
          {isLoading ? (
            <SkeletonTableFull rows={5} columns={8} />
          ) : isError ? (
            <p>Erro ao carregar transações.</p>
          ) : transactions.length === 0 ? (
            <EmptyState
              title="Nenhuma transação encontrada"
              description="Não há registros de movimentações para este usuário. Tente ajustar o período ou filtros."
              icon={<FolderOpen className="w-10 h-10 text-muted-foreground" />}
              actions={
                <Button variant="outline" onClick={() => refetch()}>
                  Recarregar
                </Button>
              }
            />
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
                        <ChevronsUp />
                      ) : (
                        <ChevronsDown className="text-green-500" />
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
                              BITCOIN: "/bitcoin.png",
                              BTC: "/bitcoin.png",
                              ETH: "/eth.png",
                              BRL: "/brl.png",
                              VRL: "/vrl.png",
                            }[tx.symbol?.toUpperCase() ?? ""] || "/brl.png"
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
