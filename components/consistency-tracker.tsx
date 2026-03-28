import { Flame } from "lucide-react";
import dayjs from "dayjs";
import type { GetHome200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

const WEEK_DAYS = [
  { dayjsIndex: 1, label: "S" },
  { dayjsIndex: 2, label: "T" },
  { dayjsIndex: 3, label: "Q" },
  { dayjsIndex: 4, label: "Q" },
  { dayjsIndex: 5, label: "S" },
  { dayjsIndex: 6, label: "S" },
  { dayjsIndex: 0, label: "D" },
] as const;

interface ConsistencyTrackerProps {
  consistencyByDay: GetHome200ConsistencyByDay;
  workoutStreak: number;
}

export function ConsistencyTracker({
  consistencyByDay,
  workoutStreak,
}: ConsistencyTrackerProps) {
  const today = dayjs();
  const startOfWeek = today.startOf("week");

  return (
    <div className="flex flex-col gap-3 px-5 pt-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold leading-[1.4] text-foreground">
          Consistência
        </h2>
        <span className="font-heading text-xs leading-[1.4] text-primary">
          Ver histórico
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center justify-between rounded-xl border border-border p-5">
          {WEEK_DAYS.map((day) => {
            const date = startOfWeek.day(day.dayjsIndex);
            const dateKey = date.format("YYYY-MM-DD");
            const status = consistencyByDay[dateKey];
            const isToday = date.isSame(today, "day");

            return (
              <div key={day.dayjsIndex} className="flex flex-col items-center gap-1.5">
                <DaySquare
                  completed={status?.workoutDayCompleted ?? false}
                  started={status?.workoutDayStarted ?? false}
                  isToday={isToday}
                />
                <span className="font-heading text-xs leading-[1.4] text-muted-foreground">
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 self-stretch rounded-xl bg-streak px-5 py-2">
          <Flame className="size-5 text-streak-foreground" />
          <span className="font-heading text-base font-semibold leading-[1.15] text-foreground">
            {workoutStreak}
          </span>
        </div>
      </div>
    </div>
  );
}

function DaySquare({
  completed,
  started,
  isToday,
}: {
  completed: boolean;
  started: boolean;
  isToday: boolean;
}) {
  if (completed) {
    return <div className="size-5 rounded-md bg-primary" />;
  }

  if (started) {
    return <div className="size-5 rounded-md bg-primary/20" />;
  }

  if (isToday) {
    return <div className="size-5 rounded-md border-[1.6px] border-primary" />;
  }

  return <div className="size-5 rounded-md border border-border" />;
}
