import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import { Goal } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getWorkoutPlan } from "@/app/_lib/api/fetch-generated";
import { NavigationBar } from "@/components/navigation-bar";
import { PlanDayCard } from "./_components/plan-day-card";

interface WorkoutPlanPageProps {
  params: Promise<{ planId: string }>;
}

export default async function WorkoutPlanPage({
  params,
}: WorkoutPlanPageProps) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const { planId } = await params;
  const workoutPlan = await getWorkoutPlan(planId);

  if (workoutPlan.status !== 200) redirect("/");

  const { name, workoutDays } = workoutPlan.data;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="relative flex h-[296px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/workout-plan-banner.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(238deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
            }}
          />
        </div>

        <p className="relative font-anton text-[22px] uppercase leading-[1.15] text-background">
          Fit.ai
        </p>

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1.5">
              <Goal className="size-4 text-primary-foreground" />
              <span className="font-heading text-xs font-semibold uppercase leading-none text-primary-foreground">
                {name}
              </span>
            </div>
            <h1 className="font-heading text-2xl font-semibold leading-[1.05] text-background">
              Plano de Treino
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        {workoutDays.map((day) => (
          <PlanDayCard key={day.id} workoutDay={day} planId={planId} />
        ))}
      </div>

      <NavigationBar calendarHref={`/workout-plans/${planId}`} />
    </div>
  );
}
