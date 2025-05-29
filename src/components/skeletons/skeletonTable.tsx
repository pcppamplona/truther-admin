import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTable({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="w-7 h-7" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-32 h-4" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-24 h-4" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-24 h-4" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-16 h-4" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
