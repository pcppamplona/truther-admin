import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Funnel, Search } from "lucide-react";
import { TransactionsData } from "@/views/suport/clients/ClientDetails/renderViews/UserInfoView";
import { dateFormat } from "@/lib/formatters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ListCashout() {
  const data = TransactionsData;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold tabular-nums @[650px]/card:text-2xl">
          Saques
          <div className="flex flex-row items-center py-4 gap-x-4">
            <div className="flex flex-1 items-center border border-border rounded-lg px-3 py-2">
              <Search size={16} className="mr-2" />
              <input
                type="text"
                placeholder="Pesquisar saque"
                className="outline-none text-sm w-full"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Default">Default</SelectItem>
                <SelectItem value="Default">New</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
        <div className="flex justify-self-end items-center space-x-4 mt-4">
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg">
            <Funnel size={16} className="mr-2" />
            Filtrar
          </button>

          <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg">
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
                className="cursor-pointer hover:bg-input transition"
              >
                <TableCell>{notification.id}</TableCell>
                <TableCell>{dateFormat(notification.createdAt)}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <img
                    src={
                      {
                        BLOCKCHAIN: "/blockchain.png",
                        TRANSFERÊNCIA: "/transfer.png",
                        PIX: "/pix.png",
                      }[notification.typeNotification] || "/default.png"
                    }
                    alt={notification.typeNotification}
                    className="w-6 h-6 object-contain"
                  />
                  {notification.typeNotification}
                </TableCell>
                <TableCell>{notification.origin}</TableCell>
                <TableCell>{notification.destiny}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <img
                    src={
                      {
                        USDT: "/usdt.png",
                        BTC: "/bitcoin.png",
                        ETH: "/eth.png",
                        BRL: "/brl.png",
                      }[notification.coin] || "/default.png"
                    }
                    alt={notification.coin}
                    className="w-6 h-6 object-contain"
                  />
                  {notification.coin}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
