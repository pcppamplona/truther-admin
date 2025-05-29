import { ClientsData } from "@/interfaces/clients-data";

export function WalletView({ client }: { client: ClientsData }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Wallet</h2>
      <p>Status: {client.kyc_approved ? "Aprovado" : "Não aprovado"}</p>
      {/* Outros dados relevantes */}
    </div>
  );
}
