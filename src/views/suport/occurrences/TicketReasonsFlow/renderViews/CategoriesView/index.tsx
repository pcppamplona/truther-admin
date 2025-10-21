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
import { TriangleAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { useAllReasonCategories } from "@/services/Tickets/useReasonCategories";
import { UpdateCategoryDialog } from "./components/UpdateCategoryDialog";
import { CreateCategoryDialog } from "./components/CreateCategoryDialog";

export function CategoriesView() {
  const { data: allReasonCategories, isLoading } = useAllReasonCategories();
  const [reasons, setReasons] = useState<ReasonCategory[]>([]);

  useEffect(() => {
    if (allReasonCategories) setReasons(allReasonCategories);
  }, [allReasonCategories]);

  return (
    <>
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

      <div className="w-full px-4 lg:px-6">
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
                  <div className="flex flex-col items-center justify-center text-center">
                    <TriangleAlert className="text-muted-foreground mb-2" />
                    <p className="text-lg font-semibold">
                      Nenhuma categoria encontrada
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Não foi possível encontrar nenhuma categoria. Tente
                      atualizar a página ou criar um novo.
                    </p>
                  </div>
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
    </>
  );
}
