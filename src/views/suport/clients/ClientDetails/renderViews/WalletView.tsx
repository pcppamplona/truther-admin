import { useWalletDoc } from "@/services/wallets/useWallets";
import { UserInfoData } from "@/interfaces/UserInfoData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinHouse, PiggyBank, User, WalletCards } from "lucide-react";
import { documentFormat, getFlagUrl, phoneFormat } from "@/lib/formatters";
import { useEffect, useState } from "react";
import { AclwalletData } from "@/interfaces/AclwalletData";
import { Info } from "@/components/info";
import { WalletSendGas } from "./components/walletSendGas";

export function WalletView({ userinfo }: { userinfo: UserInfoData }) {
  const { data: wallets = [] } = useWalletDoc(userinfo.document);

  const [walletAddress, setWalletAddress] = useState<AclwalletData | null>(
    null
  );

  useEffect(() => {
    if (wallets.length > 0) {
      setWalletAddress(wallets[0]);
    }
  }, [wallets]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2">
                <User />
                Portador
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="ID" value={walletAddress?.id} />
              <Info label="uuid" value={walletAddress?.uuid} />
              <Info
                label="Documento"
                value={documentFormat(walletAddress?.document)}
              />
              <Info
                label="Telefone"
                value={phoneFormat(walletAddress?.phone)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2">
                <MapPinHouse /> Endereço Portador
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="CEP" value={walletAddress?.zipCode} />
              <Info
                label="Rua"
                value={`${walletAddress?.address} - ${walletAddress?.number}`}
              />
              <Info label="País" value={walletAddress?.nacionality} />

              <div className="flex items-center gap-2">
                <img
                  src={getFlagUrl(walletAddress?.nacionality ?? "")}
                  alt={walletAddress?.nacionality}
                  className="w-6 h-5 rounded-lg"
                />
                <strong>{walletAddress?.nacionality}</strong>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WalletCards /> Carteiras
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {[
              {
                name: "Polygon",
                img: "/polygon.png",
                value: walletAddress?.wallet,
              },
              {
                name: "Liquid",
                img: "/liquid.png",
                value: walletAddress?.liquidWallet ?? "Não aplicado",
              },
              {
                name: "Bitcoin",
                img: "/bitcoin.png",
                value: walletAddress?.btcWallet ?? "Não aplicado",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-md"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-10 h-10 object-contain"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-xs">Endereço</p>
                  <strong className="text-xs break-all">{item.value}</strong>
                </div>
                <WalletSendGas
                  network={item?.name}
                  userName={walletAddress?.name}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank /> Saldo nas carteiras
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-row gap-4 justify-between">
            {[
              {
                name: "VRL",
                img: "/vrl.png",
                value: "$ 1200",
              },
              {
                name: "TETHER",
                img: "/usdt.png",
                value: "$ 00.00",
              },
              {
                name: "Bitcoin",
                img: "/bitcoin.png",
                value: "$ 00.00",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="w-full flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-md shadow-sm"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-10 h-10 object-contain"
                />
                <h3 className="text-sm font-semibold text-center">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground">Valor</p>
                <strong className="text-sm text-center">{item.value}</strong>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
