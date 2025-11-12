import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown01,
  ArrowUp01,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUsers } from "@/services/users/useUsers";
import { RenderPagination } from "@/components/RenderPagination";
import {
  getPaginationSettings,
  setPaginationSettings,
} from "@/lib/paginationStorage";
import { useEffect, useState } from "react";
import { UserData } from "@/interfaces/UserData";
import { useNavigate } from "react-router-dom";

export default function ListClients() {
  const navigate = useNavigate();

  const { page: savedPage, limit: savedLimit } = getPaginationSettings("users");

  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    setPaginationSettings("users", page, limit);
  }, [page, limit]);

  const { data, isLoading } = useUsers(page, limit, search, sortBy, sortOrder);

  const handleRowClick = (user: UserData) => {
    navigate("/userDetails", { state: { user } });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">
          Todos os Usuários
        </CardTitle>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center border border-border rounded-lg px-3 py-3 w-full max-w-lg">
            <Search size={16} className="mr-2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar usuários"
              className="outline-none text-sm w-full"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-12 h-10"
                    onClick={() =>
                      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")
                    }
                  >
                    {sortOrder === "ASC" ? (
                      <ArrowUp01 size={18} />
                    ) : (
                      <ArrowDown01 size={18} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ordenar clientes</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="w-12 h-10">
                    <Download size={16} color="#fff" />
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

      <div className="flex-1 overflow-y-auto px-4 lg:px-6 mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell
                onClick={() => {
                  setSortBy("id");
                  setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
                }}
              >
                ID
              </TableCell>
              <TableCell
                onClick={() => {
                  setSortBy("name");
                  setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
                }}
              >
                Nome
              </TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>uuid</TableCell>
              <TableCell>Role</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : (
              data?.data.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer hover:bg-input transition"
                  onClick={() => handleRowClick(user)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          user.active ? "bg-primary" : "bg-destructive"
                        }`}
                      />
                      {user.id}
                    </div>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>

                  <TableCell>{user.uuid}</TableCell>
                  <TableCell>{user.role_id}</TableCell>
                  <TableCell>
                    <ChevronRight size={18} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center">
        <RenderPagination
          page={page}
          setPage={setPage}
          total={Number(data?.total)}
          limit={Number(data?.limit)}
          setLimit={setLimit}
        />
      </div>
    </div>
  );
}
