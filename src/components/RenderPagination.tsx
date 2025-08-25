import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface RenderPaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  total: number;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}


export function RenderPagination({
  page,
  setPage,
  total,
  limit,
  setLimit,
}: RenderPaginationProps) {
  const totalPages = Math.ceil(total / limit);

  const handleChangeLimit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="w-full px-5 mt-6 flex items-center justify-between space-x-6 text-sm">
      <div className="flex items-center space-x-2">
        <span className="text-foreground">Linhas</span>
        <select
          value={limit}
          onChange={handleChangeLimit}
          className="border rounded px-2 py-1 text-sm bg-secondary"
        >
          {[10, 20, 50, 100].map((num) => (
            <option key={num} value={num} className="focus:bg-secondary">
              {num}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-1">
        <span className="text-foreground mr-6 font-bold">
          {page} de {totalPages}
        </span>
        <button
          onClick={() => goToPage(1)}
          disabled={page === 1}
          className="p-2 rounded border disabled:opacity-50"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-md border disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className="p-2 rounded-md border disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => goToPage(totalPages)}
          disabled={page === totalPages}
          className="p-2 rounded-md border disabled:opacity-50"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
