import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../api";
import {
  FinalizeTicketPayload,
  TicketComment,
  TicketData,
  TicketTyped,
  UpdateTicketInput,
} from "@/interfaces/TicketData";
import { PaginateData } from "@/interfaces/PaginateData";
import { AuditLog } from "@/interfaces/AuditLogData";

export const useTickets = (
  page: number,
  limit: number,
  search?: string,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  onlyAssigned?: boolean,
  assignedRole?: number,
  status?: string,
) => {
  return useQuery<PaginateData<TicketData>, any>({
    queryKey: [
      "tickets",
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      onlyAssigned,
      assignedRole,
      status
    ],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (search) params.append("search", search);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortOrder) params.append("sortOrder", sortOrder);
        if (onlyAssigned !== undefined) params.append("onlyAssigned", String(onlyAssigned));
        if (assignedRole !== undefined && assignedRole !== null) params.append("assignedRole", String(assignedRole));
        if (status) params.append("status", status); 

        const { data } = await api.get<PaginateData<TicketData>>(
          `tickets/paginated?${params.toString()}`
        );
        return data;
      } catch (err: any) {
        throw err.response?.data || err;
      }
    },
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
  });
};


export const useTicketId = (id: number) => {
  return useQuery({
    queryKey: ["tickets-id", id],
    queryFn: async (): Promise<TicketData> => {
      const { data } = await api.get<TicketData>(`tickets/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<TicketTyped>) => {
      const { data } = await api.post("tickets", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useTicketComments = (ticket_id: number) => {
  return useQuery({
    queryKey: ["tickets-comments", ticket_id],
    queryFn: async (): Promise<TicketComment[]> => {
      const { data } = await api.get<TicketComment[]>(
        `tickets/comments/${ticket_id}`
      );
      return data;
    },
    enabled: !!ticket_id,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  const updateTicket = async ({ id, data }: UpdateTicketInput): Promise<TicketTyped> => {
    const response = await api.patch<TicketTyped>(`/tickets/${id}`, data);
    console.log("response:", response.data);
    return response.data;
  };

  return useMutation({
    mutationFn: updateTicket,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-id", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tickets-audit", variables.id] }); 
    },
  });
}

export function useFinalizeTicket() {
  const queryClient = useQueryClient();

  const updateTicket = async (payload: FinalizeTicketPayload): Promise<TicketTyped> => {
    const { id, ...data } = payload;
    const response = await api.patch<TicketTyped>(`/tickets/${id}/finalize`, data);
    return response.data;
  };

  return useMutation({
    mutationFn: updateTicket,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-id", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tickets-audit", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tickets-comments", variables.id]});
    },
  });
}


export const useCreateTicketComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TicketComment) => {
      const { data } = await api.post("tickets/comments", payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-id", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tickets-comments", variables.ticket_id]});
      queryClient.invalidateQueries({ queryKey: ["tickets-audit", variables.ticket_id]});
    },
  });
};

export const useTicketAudit = (ticket_id: number) => {
  return useQuery({
    queryKey: ["tickets-audit", ticket_id],
    queryFn: async (): Promise<AuditLog[]> => {
      const { data } = await api.get<AuditLog[]>(
        `audit-logs/ticket/${ticket_id}`
      );
      return data;
    },
    enabled: !!ticket_id,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};