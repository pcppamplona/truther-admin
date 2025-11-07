import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ReasonCategory } from "@/interfaces/TicketData";
import { useState, useEffect } from "react";
import { useAllReasonCategories } from "@/services/Tickets/useReasonCategories";
import { UpdateCategoryDialog } from "./components/UpdateCategoryDialog";
import { CreateCategoryDialog } from "./components/CreateCategoryDialog";
import { CardEmpty } from "@/components/CardEmpty";

export function CategoriesView() {
  const { data: allReasonCategories, isLoading } = useAllReasonCategories();
  const [reasons, setReasons] = useState<ReasonCategory[]>([]);

  useEffect(() => {
    if (allReasonCategories) setReasons(allReasonCategories);
  }, [allReasonCategories]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <CardHeader className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">
              Categorias
            </CardTitle>
            <CardDescription>
              Aqui estão as categorias dos seus Reason.
              <br />
              Todo Reason precisa estar dentro de umas das categorias listadas
              aqui.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <CreateCategoryDialog />
          </div>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-y-auto px-4 lg:px-6 mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Descrição</TableHead>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : reasons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <CardEmpty
                    title="Nenhuma categoria encontrado"
                    subtitle=" Não foi possível encontrar nenhuma categoria. Tente ajustar a pesquisa ou criar um novo."
                  />
                </TableCell>
              </TableRow>
            ) : (
              reasons.map((reason) => (
                <>
                  <TableRow
                    key={reason.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>{reason.id}</TableCell>
                    <TableCell>{reason.type}</TableCell>
                    <TableCell>{reason.description}</TableCell>
                    <TableCell>
                      <UpdateCategoryDialog category={reason} />
                    </TableCell>
                  </TableRow>
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
