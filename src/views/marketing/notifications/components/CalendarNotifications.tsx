import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/services/notifications/useNotifications";
import { format, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { dateFormat } from "@/lib/formatters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CalendarNotifications() {
  const { data: notifications = [] } = useNotifications();

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const calendarDays = useMemo(() => {
    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    const endOfMonthDate = endOfMonth(startOfMonth);

    const startWeekDay = startOfMonth.getDay(); 
    const daysInCurrentMonth = eachDayOfInterval({
      start: startOfMonth,
      end: endOfMonthDate,
    });

    const placeholders = Array.from({ length: startWeekDay });

    return [...placeholders, ...daysInCurrentMonth];
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
    { length: currentDate.getFullYear() - 2020 + 1 },
    (_, i) => 2020 + i
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
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl font-bold ">
            Calendário de Notificações
          </CardTitle>

          <div className="flex gap-2">
            <Select
              value={String(selectedMonth)}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={month} value={String(index)}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(selectedYear)}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <div className="grid grid-cols-7 gap-2 px-6 pb-6">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div
            key={day}
            className="text-center font-medium text-muted-foreground text-sm"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          if (!(day instanceof Date)) {
            return <div key={`empty-${index}`} className="h-20" />;
          }

          const dayNotifications = getNotificationsForDay(day);

          return (
            <div
              key={day.toISOString()}
              className="h-20 border rounded-md p-1 flex flex-col items-start justify-start text-xs overflow-hidden"
            >
              <div className="font-bold">{format(day, "d")}</div>
              {dayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="mt-1 text-primary font-medium truncate w-full"
                  title={notification.title}
                >
                  - {notification.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="px-6 pb-6 flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Notificações deste mês:</h2>

        {monthNotifications.length === 0 ? (
          <p className="text-sm">Nenhuma notificação encontrada.</p>
        ) : (
          <ul className="space-y-2">
            {monthNotifications.map((n) => (
              <li key={n.id} className="border rounded p-2 bg-input">
                <div className="flex space-x-2">
                  <div>{dateFormat(n.createdAt)} -</div>
                  <div className="font-semibold">{n.title}</div>
                </div>
                <div className="text-xs mt-2">
                  {n.typeNotification} - {n.categoty}
                </div>
                <div className="text-sm">{n.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
