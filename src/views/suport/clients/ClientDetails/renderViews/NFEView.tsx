import { ClientsData } from "@/interfaces/ClientsData";

export function NFEView({ client }: { client: ClientsData }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">NFE</h2>
      <p>Status: {client.kyc_approved ? "Aprovado" : "Não aprovado"}</p>
      {/* Outros dados relevantes */}
    </div>
  );
}
