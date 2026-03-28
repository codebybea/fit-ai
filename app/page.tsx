import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import dayjs from "dayjs";
import { authClient } from "@/app/_lib/auth-client";
import { getHome } from "@/app/_lib/api/fetch-generated";
import { NavigationBar } from "@/components/navigation-bar";
import { ConsistencyTracker } from "@/components/consistency-tracker";
import { WorkoutDayCard } from "@/components/workout-day-card";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const homeData = await getHome(dayjs().format("YYYY-MM-DD"));

  if (homeData.status !== 200) redirect("/auth");

  const { todayWorkoutDay, consistencyByDay, workoutStreak } = homeData.data;
  const firstName = session.data.user.name?.split(" ")[0] ?? "";

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="relative flex h-[296px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/home-banner.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(242deg, rgba(0,0,0,0) 34%, rgb(0,0,0) 100%)",
            }}
          />
        </div>

        <p className="relative font-anton text-[22px] uppercase leading-[1.15] text-background">
          Fit.ai
        </p>

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col gap-1.5">
            <p className="font-heading text-2xl font-semibold leading-[1.05] text-background">
              Olá, {firstName}
            </p>
            <p className="font-heading text-sm leading-[1.15] text-background/70">
              Bora treinar hoje?
            </p>
          </div>
          <div className="rounded-full bg-primary px-4 py-2">
            <span className="font-heading text-sm font-semibold leading-none text-primary-foreground">
              Bora!
            </span>
          </div>
        </div>
      </div>

      <ConsistencyTracker
        consistencyByDay={consistencyByDay}
        workoutStreak={workoutStreak}
      />

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold leading-[1.4] text-foreground">
            Treino de Hoje
          </h2>
          <span className="font-heading text-xs leading-[1.4] text-primary">
            Ver treinos
          </span>
        </div>

        {todayWorkoutDay && <WorkoutDayCard workoutDay={todayWorkoutDay} />}
      </div>

      <NavigationBar />
    </div>
  );
}
