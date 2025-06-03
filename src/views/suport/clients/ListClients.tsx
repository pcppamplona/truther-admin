import { useClients } from "@/services/clients/useClients";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Funnel, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClientsData } from "@/interfaces/clients-data";

export default function ListClients() {
  const navigate = useNavigate();
  const { data, isLoading } = useClients();

  const handleRowClick = (client: ClientsData) => {
    navigate("/clientDetails", { state: { clientId: client.id } });
  };
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold tabular-nums @[650px]/card:text-2xl">
          Todos os Clientes
          <div className="flex items-center border border-border rounded-lg px-3 py-2 mt-4">
            <Search size={16} className="mr-2" />
            <input
              type="text"
              placeholder="Pesquisar clientes"
              className="outline-none text-sm w-full"
            />
          </div>
        </CardTitle>
        <div className="flex justify-self-end items-center space-x-4 mt-4">
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg">
            <Funnel size={16} className="mr-2" />
            Filtrar
          </button>

          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg">
            <Download size={16} className="mr-2" />
            Baixar CSV
          </button>
        </div>
      </CardHeader>
      <div className="w-full px-4 lg:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-semibold text-gray-500">ID</TableCell>
              <TableCell className="font-semibold text-gray-500">
                Nome
              </TableCell>
              <TableCell className="font-semibold text-gray-500">
                uuid
              </TableCell>

              <TableCell className="font-semibold text-gray-500">
                role
              </TableCell>
              <TableCell className="font-semibold text-gray-500">KYC</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : (
              data?.map((client) => (
                <TableRow
                  key={client.id}
                  onClick={() => handleRowClick(client)}
                >
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.name ?? "n/a"}</TableCell>
                  <TableCell>{client.uuid}</TableCell>
                  <TableCell>{client.role}</TableCell>

                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          client.kyc_approved ? "bg-[#00E588]" : "bg-[#EA6565]"
                        }`}
                      />
                      <span className="font-medium">
                        {client.kyc_approved ? "Sim" : "Não"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
