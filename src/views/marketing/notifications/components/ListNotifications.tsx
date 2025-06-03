import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCheck, Funnel, Search } from "lucide-react";
import { useNotifications } from "@/services/notifications/useNotifications";
import { dateFormat } from "@/lib/formatters";
import { useState } from "react";
import { Info } from "@/components/info";
import { CreateNotification } from "./modais/CreateNotification";

export default function ListNotifications() {
  const { data, isLoading } = useNotifications();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold tabular-nums @[650px]/card:text-2xl">
          Todas as Notificações
          <div className="flex items-center border border-border rounded-lg px-3 py-2 mt-4">
            <Search size={16} className="mr-2" />
            <input
              type="text"
              placeholder="Pesquisar notificação"
              className="outline-none text-sm w-full"
            />
          </div>
        </CardTitle>
        <div className="flex justify-self-end items-center space-x-4 mt-4">
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg">
            <Funnel size={16} className="mr-2" />
            Filtrar
          </button>
          <CreateNotification />
        </div>
      </CardHeader>

      <div className="w-full px-4 lg:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-semibold text-gray-500">ID</TableCell>
              <TableCell className="font-semibold text-gray-500">
                Tipo
              </TableCell>
              <TableCell className="font-semibold text-gray-500">
                Categoria
              </TableCell>
              <TableCell className="font-semibold text-gray-500">
                Título
              </TableCell>
              <TableCell className="font-semibold text-gray-500">
                Data
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : (
              data?.map((notification) => (
                <>
                  <TableRow
                    key={notification.id}
                    onClick={() => toggleExpand(notification.id)}
                    className="cursor-pointer hover:bg-input transition"
                  >
                    <TableCell>{notification.id}</TableCell>
                    <TableCell>{notification.typeNotification}</TableCell>
                    <TableCell>{notification.categoty}</TableCell>
                    <TableCell>{notification.title}</TableCell>
                    <TableCell>{dateFormat(notification.createdAt)}</TableCell>
                  </TableRow>

                  {expandedId === notification.id && (
                    <TableRow className="bg-input">
                      <TableCell
                        colSpan={5}
                        className="py-4 text-sm "
                      >
                        <div className="grid gap-2 ">
                          <Info label="Mensagem" value={notification.message} />

                          <Info
                            label="Lida"
                            value={
                              notification.read ? (
                                <span className="flex items-center gap-2 text-blue-600">
                                  Sim <CheckCheck size={16} />
                                </span>
                              ) : (
                                "Não"
                              )
                            }
                          />

                          <Info
                            label="Ativa"
                            value={
                              <span className="flex items-center gap-x-2">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    notification.active
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                />
                                {notification.active ? "Sim" : "Não"}
                              </span>
                            }
                          />

                          <Info label="UUID" value={notification.uuid} />
                          <Info label="User ID" value={notification.userId} />
                          <Info
                            label="Atualizada em"
                            value={dateFormat(notification.updatedAt)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
