import { useWalletDoc } from "@/services/wallets/useWallets";
import { UserInfoData } from "@/interfaces/userinfo-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinHouse, User, WalletCards } from "lucide-react";
import { documentFormat, getFlagUrl, phoneFormat } from "@/lib/formatters";
import { useEffect, useState } from "react";
import { AclwalletData } from "@/interfaces/aclwallets-data";

export function WalletView({ userinfo }: { userinfo: UserInfoData }) {
  const {
    data: wallets = [],
  } = useWalletDoc(userinfo.document);

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
              <div>
                <p className="text-[#475467]">ID</p>
                <strong>{walletAddress?.id}</strong>
              </div>

              <div>
                <p className="text-[#475467]">uuid</p>
                <strong>{walletAddress?.uuid}</strong>
              </div>

              <div>
                <p className="text-[#475467]">Documento</p>
                <strong>
                  <strong>{documentFormat(walletAddress?.document)}</strong>
                </strong>
              </div>

              <div>
                <p className="text-[#475467]">Telefone</p>
                <strong>{phoneFormat(walletAddress?.phone)}</strong>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2">
                <MapPinHouse /> Endereço de carteira
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[#475467]">CEP</p>
                <strong>{walletAddress?.zipCode}</strong>
              </div>

              <div>
                <p className="text-[#475467]">Rua</p>
                <strong>
                  {walletAddress?.address} - {walletAddress?.number}
                </strong>
              </div>

              <div>
                <p className="text-[#475467]">Rua</p>
                <strong>
                  {walletAddress?.address} - {walletAddress?.number}
                </strong>
              </div>

              <div>
                <p className="text-[#475467]">País</p>
                <strong className="flex items-center gap-2">
                  <img
                    src={getFlagUrl(walletAddress?.nacionality ?? "")}
                    alt={walletAddress?.nacionality}
                    className="w-6 h-5 rounded-lg"
                  />
                  {walletAddress?.nacionality}
                </strong>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WalletCards /> Carteiras
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                className="flex flex-col items-start gap-3 p-4 border rounded-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-8 h-8 object-contain"
                  />
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                </div>

                <div>
                  <p className="text-sm text-[#475467] mb-1">
                    Endereço da carteira
                  </p>
                  <strong className="break-all text-sm">{item.value}</strong>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
