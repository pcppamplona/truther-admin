import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar1Icon,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Funnel,
  MessageSquareText,
  MoveDown,
  MoveUp,
  Search,
  User2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPaginationSettings } from "@/lib/paginationStorage";
import { RenderPagination } from "@/components/RenderPagination";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { dateFormat, timeFormat } from "@/lib/formatters";
import { ActionType, methodType } from "@/interfaces/AuditLogData";
import { useAuditLog } from "@/services/audit/useAuditLog";
import { Info } from "@/components/info";

export default function ListAuditLog() {
  const { page: savedPage, limit: savedLimit } = getPaginationSettings("audit");
  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data, isLoading } = useAuditLog(page, limit, search);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const methodColors: Record<methodType, string> = {
    POST: "text-[#f4da7a]",
    DELETE: "text-[#d18785]",
    GET: "text-[#5aaa7a]",
    UPDATE: "text-[#73acf3]",
    PATCH: "text-[#ad98ca]",
  };

  const actionColors: Record<ActionType, string> = {
    alter: "border-[#3319c7]",
    listing: "border-[#9e3790]",
    crm: "border-[#a57b2c]",
    security: "border-[#1a6b80]",
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">
          Auditoria Geral
        </CardTitle>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center border border-border rounded-lg px-3 py-3 w-full max-w-lg">
            <Search size={16} className="mr-2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar transação"
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

      <div className="w-full px-4 lg:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>method</TableCell>
              <TableCell>data</TableCell>
              <TableCell>hora</TableCell>
              <TableCell>ação</TableCell>
              <TableCell>sender</TableCell>
              <TableCell>target</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : (
              data?.data?.map((audit) => (
                <>
                  <TableRow
                    key={audit.id}
                    className="cursor-pointer hover:bg-input transition"
                    onClick={() => toggleExpand(audit.id)}
                  >
                    <TableCell>{audit.id}</TableCell>
                    <TableCell
                      className={`font-semibold ${methodColors[audit.method]}`}
                    >
                      {audit.method}
                    </TableCell>
                    <TableCell>{dateFormat(audit.created_at)}</TableCell>
                    <TableCell>{timeFormat(audit.created_at)}</TableCell>
                    <TableCell>
                      <div
                        className={`px-3 py-1 w-fit min-w-18 flex border-l-[3px] text-sm uppercase font-semibold ${
                          actionColors[audit.action as ActionType]
                        }`}
                      >
                        {audit.action}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MoveUp size={18} color="#818181" />
                        {audit.sender_type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MoveDown size={18} color="#818181" />
                        {audit.target_type}
                      </div>
                    </TableCell>
                    <TableCell>
                      {expandedId === audit.id ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </TableCell>
                  </TableRow>

                  <AnimatePresence>
                    {expandedId === audit.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={8} className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden p-4 text-sm"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="border-l-2 border-[#818181] p-2">
                                <Info
                                  label={
                                    <span className="flex items-center gap-2">
                                      <User2 size={18} />
                                      <strong>Id</strong>
                                    </span>
                                  }
                                  value={audit.target_type + audit.target_id}
                                />
                              </div>

                               <div className="border-l-2 border-[#818181] p-2">
                                <Info
                                  label={
                                    <span className="flex items-center gap-2">
                                      <Calendar1Icon size={18} />
                                      <strong>Data</strong>
                                    </span>
                                  }
                                  value={audit.created_at}
                                />
                              </div>

                              <div className="border-l-2 border-[#818181] p-2">
                                <Info
                                  label={
                                    <span className="flex items-center gap-2">
                                      <MessageSquareText size={18} />
                                      <strong>Mensagem</strong>
                                    </span>
                                  }
                                  value={audit.message}
                                />
                              </div>

                              <div className="border-l-2 border-[#818181] p-2">
                                <Info
                                  label={
                                    <span className="flex items-center gap-2">
                                      <FileText size={18} />
                                      <strong>Descrição</strong>
                                    </span>
                                  }
                                  value={audit.description}
                                />
                              </div>

                             
                            </div>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4">
        <RenderPagination
          page={page}
          setPage={setPage}
          total={Number(data?.total)}
          limit={Number(data?.limit)}
          setLimit={setLimit}
        />
      </div>
    </>
  );
}
