import { NotificationData } from "@/interfaces/notification-data";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<NotificationData[]> => {
      const response = await api.get("notifications");
      return await response.json<NotificationData[]>();
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
  });
};


export async function useCreateNotifications(notificationData: NotificationData) {
  try {
    const newNotification: NotificationData = await api
      .post("notifications", { json: notificationData })
      .json();
    return newNotification;
  } catch (error) {
    console.error("Erro ao criar notification:", error);
    return null;
  }
}
