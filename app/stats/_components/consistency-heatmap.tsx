import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/pt-br";
import type { GetStats200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

dayjs.extend(isoWeek);
dayjs.locale("pt-br");

interface ConsistencyHeatmapProps {
  consistencyByDay: GetStats200ConsistencyByDay;
}

interface MonthGroup {
  label: string;
  weeks: { days: (string | null)[] }[];
}

function buildMonthGroups(): MonthGroup[] {
  const today = dayjs();
  const startMonth = today.subtract(2, "month").startOf("month");
  const endMonth = today.endOf("month");

  const months: MonthGroup[] = [];
  let currentMonth = startMonth;

  while (
    currentMonth.isBefore(endMonth) ||
    currentMonth.isSame(endMonth, "month")
  ) {
    const monthStart = currentMonth.startOf("month");
    const monthEnd = currentMonth.endOf("month");

    const label = currentMonth.format("MMM").replace(".", "");
    const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);

    const weeks: { days: (string | null)[] }[] = [];

    let weekStart = monthStart.startOf("isoWeek");

    while (weekStart.isBefore(monthEnd) || weekStart.isSame(monthEnd, "day")) {
      const days: (string | null)[] = [];

      for (let d = 0; d < 7; d++) {
        const day = weekStart.add(d, "day");
        if (day.isBefore(monthStart) || day.isAfter(monthEnd)) {
          days.push(null);
        } else {
          days.push(day.format("YYYY-MM-DD"));
        }
      }

      weeks.push({ days });
      weekStart = weekStart.add(1, "week");
    }

    months.push({ label: capitalizedLabel, weeks });
    currentMonth = currentMonth.add(1, "month");
  }

  return months;
}

export function ConsistencyHeatmap({
  consistencyByDay,
}: ConsistencyHeatmapProps) {
  const months = buildMonthGroups();

  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl border border-border p-5">
      {months.map((month) => (
        <div
          key={month.label}
          className="flex flex-col gap-1.5"
        >
          <p className="font-heading text-xs leading-[1.4] text-muted-foreground">
            {month.label}
          </p>
          <div className="flex gap-1">
            {month.weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.days.map((dateKey, dayIdx) => {
                  if (dateKey === null) {
                    return (
                      <div
                        key={dayIdx}
                        className="size-5"
                      />
                    );
                  }

                  const status = consistencyByDay[dateKey];
                  const completed = status?.workoutDayCompleted ?? false;
                  const started = status?.workoutDayStarted ?? false;

                  if (completed) {
                    return (
                      <div
                        key={dayIdx}
                        className="size-5 rounded-md bg-primary"
                      />
                    );
                  }

                  if (started) {
                    return (
                      <div
                        key={dayIdx}
                        className="size-5 rounded-md bg-primary/20"
                      />
                    );
                  }

                  return (
                    <div
                      key={dayIdx}
                      className="size-5 rounded-md border border-border"
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
