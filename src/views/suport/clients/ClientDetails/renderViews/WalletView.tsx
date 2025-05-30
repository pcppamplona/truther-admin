import { useWalletDoc } from "@/services/wallets/useWallets";
import { UserInfoData } from "@/interfaces/userinfo-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinHouse, User, WalletCards } from "lucide-react";
import { documentFormat, getFlagUrl, phoneFormat } from "@/lib/formatters";
import { useEffect, useState } from "react";
import { AclwalletData } from "@/interfaces/aclwallets-data";
import { Info } from "@/components/info";

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

              {/* Para mostrar a bandeira junto, faça fora do Info: */}
              <div className="flex items-center gap-2 text-[#475467]">
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
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-md"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-8 h-8 object-contain"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-xs text-[#475467]">Endereço</p>
                  <strong className="text-xs break-all">{item.value}</strong>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
