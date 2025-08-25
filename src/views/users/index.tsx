import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dateFormat } from "@/lib/formatters";
import { useUsers } from "@/services/users/useUsers";
import { Edit, Funnel, Plus, Search, Trash } from "lucide-react";

export default function Users() {
  const { data } = useUsers();
  return (
    <SidebarLayout current="Usuários">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tabular-nums @[650px]/card:text-2xl">
              Usuários Truther
              <div className="flex items-center border border-border rounded-lg px-3 py-2 mt-4">
                <Search size={16} className="mr-2" />
                <input
                  type="text"
                  placeholder="Pesquisar funcionário"
                  className="outline-none text-sm w-full"
                />
              </div>
            </CardTitle>
            <div className="flex justify-self-end items-center space-x-4 mt-4">
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg">
                <Funnel size={16} className="mr-2" />
                Filtrar
              </button>

              <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg">
                <Plus size={16} className="mr-2" />
                Novo usuário
              </button>
            </div>
          </CardHeader>
          <div className="w-full px-4 lg:px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>
                    ID
                  </TableCell>
                  <TableCell>
                    Nome
                  </TableCell>
                  <TableCell>
                    E-mail
                  </TableCell>
                  <TableCell>
                    Data Criação
                  </TableCell>
                  <TableCell>
                    Role
                  </TableCell>
                  <TableCell>
                    uuid
                  </TableCell>
                  <TableCell>
                    Remover
                  </TableCell>

                  <TableCell>
                    Editar
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-input transition"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            user.active ? "bg-[#00E588]" : "bg-[#EA6565]"
                          }`}
                        />
                        {user.id}
                      </div>
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>

                    <TableCell>{dateFormat(user.createdAt)}</TableCell>
                    <TableCell>{user.typeAuth}</TableCell>
                    <TableCell>{user.uuid}</TableCell>
                    <TableCell>
                      <Button className="bg-destructive text-background">
                        <Trash />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button className="text-background">
                        <Edit />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
