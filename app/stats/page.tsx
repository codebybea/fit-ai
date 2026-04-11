import { redirect } from "next/navigation";
import { headers } from "next/headers";
import dayjs from "dayjs";
import { CircleCheck, CirclePercent, Hourglass } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getStats, getHome } from "@/app/_lib/api/fetch-generated";
import { requireOnboarded } from "@/app/_lib/require-onboarded";
import { NavigationBar } from "@/components/navigation-bar";
import { StreakBanner } from "./_components/streak-banner";
import { ConsistencyHeatmap } from "./_components/consistency-heatmap";
import { StatCard } from "./_components/stat-card";
import { formatTotalTime } from "./_lib/format-total-time";

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  await requireOnboarded();

  const today = dayjs();
  const from = today.subtract(2, "month").startOf("month").format("YYYY-MM-DD");
  const to = today.endOf("month").format("YYYY-MM-DD");

  const [statsData, homeData] = await Promise.all([
    getStats({ from, to }),
    getHome(today.format("YYYY-MM-DD")),
  ]);

  const todayWorkoutDay = homeData.status === 200 ? homeData.data.todayWorkoutDay : undefined;
  const workoutStreak = statsData.status === 200 ? statsData.data.workoutStreak : 0;
  const consistencyByDay = statsData.status === 200 ? statsData.data.consistencyByDay : {};
  const completedWorkoutsCount = statsData.status === 200 ? statsData.data.completedWorkoutsCount : 0;
  const conclusionRate = statsData.status === 200 ? Math.round(statsData.data.conclusionRate * 100) : 0;
  const totalTimeInSeconds = statsData.status === 200 ? statsData.data.totalTimeInSeconds : 0;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex h-14 items-center px-5">
        <p className="font-anton text-[22px] uppercase leading-[1.15] text-foreground">
          Fit.ai
        </p>
      </div>

      <StreakBanner workoutStreak={workoutStreak} />

      <div className="flex flex-col gap-3 p-5">
        <h2 className="font-heading text-lg font-semibold leading-[1.4] text-foreground">
          Consistência
        </h2>

        <ConsistencyHeatmap consistencyByDay={consistencyByDay} />

        <div className="flex gap-3">
          <div className="flex-1">
            <StatCard
              icon={CircleCheck}
              value={String(completedWorkoutsCount)}
              label="Treinos Feitos"
            />
          </div>
          <div className="flex-1">
            <StatCard
              icon={CirclePercent}
              value={`${conclusionRate}%`}
              label="Taxa de conclusão"
            />
          </div>
        </div>

        <StatCard
          icon={Hourglass}
          value={formatTotalTime(totalTimeInSeconds)}
          label="Tempo Total"
        />
      </div>

      <NavigationBar
        calendarHref={
          todayWorkoutDay
            ? `/workout-plans/${todayWorkoutDay.workoutPlanId}`
            : null
        }
      />
    </div>
  );
}
