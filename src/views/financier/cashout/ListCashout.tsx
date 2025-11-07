import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Funnel, Search } from "lucide-react";
import { dateFormat } from "@/lib/formatters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { TransactionsData } from "..";

export default function ListCashout() {
  const data = TransactionsData;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">Saques</CardTitle>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center border border-border rounded-lg px-3 py-3 w-full max-w-lg">
            <Search size={16} className="mr-2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar saque"
              className="outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select>
               <SelectTrigger className="bg-red-400" size="xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Default">Default</SelectItem>
                <SelectItem value="Default">New</SelectItem>
              </SelectContent>
            </Select>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="w-14 h-12 bg-blue-500">
                    <Funnel size={18} color="#fff" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filtros</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="w-14 h-12">
                    <Download size={18} color="#fff" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Baixar lista em CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <div className="w-full px-4 lg:px-6 h-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Origem</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Moeda</TableCell>
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
