import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { useState } from "react";
import { FileText, FileUser, Tag, Workflow } from "lucide-react";
import { ReasonsView } from "./renderViews/ReasonsView";
import { RepliesView } from "./renderViews/RepliesView";
import { ReplyActionsView } from "./renderViews/ReplyActionsView";
import { ActionsTypesView } from "./renderViews/ActionsTypesView";


export default function TicketReasonsFlow() {
  const [view, setView] = useState<"Reasons" | "Replies" | "ReplyActions" | "ActionsTypes">("Reasons");

  return (
    <SidebarLayout
      breadcrumb={[
        { label: "Suporte", href: "/support" },
        { label: "Ocorrências", href: "/ocurrences" },
      ]}
      current={
        <>
          Gerenciamento de <strong>Ticket Reasons</strong>
        </>
      }
    >
      <div className="flex flex-col md:flex-row flex-wrap gap-2 w-full max-w-4xl border-b">
        {[
          { label: "Reasons", icon: <Tag size={18} /> },
          { label: "Replies", icon: <FileUser size={18} /> },
          { label: "ReplyActions", icon: <Workflow size={18} /> },
          { label: "ActionsTypes", icon: <FileText size={18} /> },
        ].map((tab) => {
          const isActive = view === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() =>
                setView(tab.label as "Reasons" | "Replies" | "ReplyActions" | "ActionsTypes")
              }
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors
                ${
                  isActive
                    ? "text-primary border-primary font-semibold"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {view === "Reasons" && <ReasonsView />}
      {view === "Replies" && <RepliesView />}
      {view === "ReplyActions" && <ReplyActionsView />}
      {view === "ActionsTypes" && <ActionsTypesView />}
    </SidebarLayout>
  );
}