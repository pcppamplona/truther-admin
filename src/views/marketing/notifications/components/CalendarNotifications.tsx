import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/services/notifications/useNotifications";
import { format, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { dateFormat } from "@/lib/formatters";

export default function CalendarNotifications() {
  const { data: notifications = [] } = useNotifications();

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const monthStart = new Date(selectedYear, selectedMonth, 1);
  const monthEnd = endOfMonth(monthStart);

  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: monthStart,
      end: monthEnd,
    });
  }, [selectedMonth, selectedYear]);

  function getNotificationsForDay(day: Date) {
    return notifications.filter((n) => isSameDay(new Date(n.createdAt), day));
  }

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const years = Array.from(
    { length: currentDate.getFullYear() - 2000 + 1 },
    (_, i) => 2000 + i
  );

  const monthNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const createdAt = new Date(n.createdAt);
      return (
        createdAt.getFullYear() === selectedYear &&
        createdAt.getMonth() === selectedMonth
      );
    });
  }, [notifications, selectedYear, selectedMonth]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl font-bold text-gray-700">
            Calendário de Notificações
          </CardTitle>

          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <div className="grid grid-cols-7 gap-2 px-6 pb-6">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div
            key={day}
            className="text-center font-medium text-gray-500 text-sm"
          >
            {day}
          </div>
        ))}

        {daysInMonth.map((day) => {
          const dayNotifications = getNotificationsForDay(day);
          return (
            <div
              key={day.toISOString()}
              className="h-20 border rounded-md p-1 flex flex-col items-start justify-start text-xs overflow-hidden"
            >
              <div className="text-gray-600 font-bold">{format(day, "d")}</div>
              {dayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="mt-1 text-blue-600 font-medium truncate w-full"
                  title={notification.title}
                >
                  {notification.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Notificações deste mês:
        </h2>

        {monthNotifications.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhuma notificação encontrada.
          </p>
        ) : (
          <ul className="space-y-2">
            {monthNotifications.map((n) => (
              <li key={n.id} className="border rounded p-2 bg-gray-50">
                <div className="flex space-x-2">
                  <div>{dateFormat(n.createdAt)} -</div>
                  <div className="font-semibold">{n.title}</div>
                </div>
                <div className="text-xs text-gray-600">
                  {n.typeNotification} - {n.categoty}
                </div>
                <div className="text-sm text-gray-800">{n.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
