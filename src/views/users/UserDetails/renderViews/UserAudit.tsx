import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Calendar1Icon,
  ChevronDown,
  ChevronUp,
  FileText,
  MessageSquareText,
  MoveDown,
  MoveUp,
  User2,
  Hash,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuditLogFilters } from "@/components/audit/AuditLogFilters";
import { getPaginationSettings } from "@/lib/paginationStorage";
import { RenderPagination } from "@/components/RenderPagination";
import { SkeletonTable } from "@/components/skeletons/skeletonTable";
import { dateFormat, timeFormat } from "@/lib/formatters";
import { ActionType, methodType } from "@/interfaces/AuditLogData";
import { Info } from "@/components/info";
import { actionColors, methodColors, severityColors } from "@/lib/utils";
import { ForbiddenCard } from "@/components/ForbiddenCard";
import { useI18n } from "@/i18n";
import { UserData } from "@/interfaces/UserData";
import { useUserAuditLogs } from "@/services/audit/useAuditLog";

export function UserAudit({ user }: { user: UserData }) {
  const { t } = useI18n();
  const { page: savedPage, limit: savedLimit } =
    getPaginationSettings("audit-user");
  const [page, setPage] = useState(savedPage);
  const [limit, setLimit] = useState(savedLimit);
  const [search, setSearch] = useState("");
  const [descriptionSearch, setDescriptionSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<methodType | "">("");
  const [selectedAction, setSelectedAction] = useState<ActionType | "">("");
  const [createdBefore, setCreatedBefore] = useState<string | undefined>();
  const [createdAfter, setCreatedAfter] = useState<string | undefined>();
  const [selectedSeverity, setSelectedSeverity] = useState<"" | "low" | "medium" | "high">("");

  const { data, isLoading, isError, error } = useUserAuditLogs(
    user.id,
    page,
    limit,
    search,
    descriptionSearch,
    selectedMethod as methodType | "",
    selectedAction,
    createdBefore,
    createdAfter,
    selectedSeverity
  );

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col h-[calc(95vh-120px)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Activity size={20} /> Auditoria de {user.name}
        </CardTitle>
        <CardDescription>
          Registro das atividades e alterações associadas a este usuário.
        </CardDescription>

        <div className="flex items-center justify-end gap-4">
          <AuditLogFilters
            search={search}
            setSearch={setSearch}
            descriptionSearch={descriptionSearch}
            setDescriptionSearch={setDescriptionSearch}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
            selectedSeverity={selectedSeverity}
            setSelectedSeverity={setSelectedSeverity}
            createdBefore={createdBefore}
            setCreatedBefore={setCreatedBefore}
            createdAfter={createdAfter}
            setCreatedAfter={setCreatedAfter}
            setPage={setPage}
            methodColors={methodColors}
          />
        </div>
      </CardHeader>

      {!isError && (
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>{t("audit.table.headers.id")}</TableCell>
                <TableCell>{t("audit.table.headers.method")}</TableCell>
                <TableCell>{t("audit.table.headers.date")}</TableCell>
                <TableCell>{t("audit.table.headers.time")}</TableCell>
                <TableCell>{t("audit.table.headers.action")}</TableCell>
                <TableCell>{t("audit.table.headers.severity")}</TableCell>
                <TableCell>{t("audit.table.headers.sender")}</TableCell>
                <TableCell>{t("audit.table.headers.target")}</TableCell>
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
                        <div
                          className={`px-3 py-1 w-fit min-w-18 flex text-sm uppercase font-semibold ${
                            audit.severity ? severityColors[audit.severity as "low" | "medium" | "high"] : "text-muted-foreground"
                          }`}
                        >
                          {audit.severity ? t(`audit.filters.severity.options.${audit.severity}`) : "-"}
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
                          <TableCell colSpan={10} className="p-0">
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
                                        <strong>ID alvo</strong>
                                      </span>
                                    }
                                    value={`${audit.target_type} ${audit.target_id}`}
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

                                <div className="border-l-2 border-[#818181] p-2">
                                  <Info
                                    label={
                                      <span className="flex items-center gap-2">
                                        <Hash size={18} />
                                        <strong>ID Externo</strong>
                                      </span>
                                    }
                                    value={audit.target_external_id ?? "-"}
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
      )}

      {!isError && (
        <div className="flex justify-center items-center">
          <RenderPagination
            page={page}
            setPage={setPage}
            total={Number(data?.total)}
            limit={Number(data?.limit)}
            setLimit={setLimit}
          />
        </div>
      )}

      {isError && error?.code === "PERMISSION_DENIED" && (
        <ForbiddenCard permission={error.requiredPermission} />
      )}
    </div>
  );
}
