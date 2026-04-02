import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import { Calendar, Timer, Dumbbell, Zap, CircleHelp } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getWorkoutDay } from "@/app/_lib/api/fetch-generated";
import { NavigationBar } from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { BackButton } from "./_components/back-button";
import { CompleteWorkoutButton } from "./_components/complete-workout-button";
import { StartWorkoutButton } from "./_components/start-workout-button";

const WEEK_DAY_LABELS: Record<string, string> = {
  MONDAY: "Segunda",
  TUESDAY: "Terça",
  WEDNESDAY: "Quarta",
  THURSDAY: "Quinta",
  FRIDAY: "Sexta",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}min`;
}

export default async function WorkoutDayPage({
  params,
}: {
  params: Promise<{ planId: string; dayId: string }>;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const { planId: workoutPlanId, dayId: workoutDayId } = await params;

  const dayData = await getWorkoutDay(workoutPlanId, workoutDayId);
  if (dayData.status !== 200) redirect("/");

  const workoutDay = dayData.data;
  const dayLabel = WEEK_DAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay;

  const hasCompletedSession = workoutDay.sessions.some((s) => s.completedAt);
  const inProgressSession = workoutDay.sessions.find(
    (s) => s.startedAt && !s.completedAt,
  );
  const hasInProgressSession = !!inProgressSession;

  const title = hasInProgressSession ? "Treino de Hoje" : dayLabel;
  const calendarHref = `/workout-plans/${workoutPlanId}/days/${workoutDayId}`;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex items-center justify-between p-5">
        <BackButton />
        <h1 className="font-heading text-lg font-semibold leading-[1.4] text-foreground">
          {title}
        </h1>
        <div className="size-6" />
      </div>

      <div className="flex flex-col gap-5 px-5">
        <div className="relative flex h-[200px] flex-col items-start justify-between overflow-hidden rounded-xl p-5">
          {workoutDay.coverImageUrl ? (
            <Image
              src={workoutDay.coverImageUrl}
              alt={workoutDay.name}
              fill
              className="pointer-events-none object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-foreground" />
          )}
          <div className="absolute inset-0 rounded-xl bg-foreground/30" />

          <div className="relative flex items-center">
            <div className="flex items-center gap-1 rounded-full bg-background/16 px-2.5 py-1.5 backdrop-blur-sm">
              <Calendar className="size-3.5 text-background" />
              <span className="font-heading text-xs font-semibold uppercase leading-none text-background">
                {dayLabel}
              </span>
            </div>
          </div>

          <div className="relative flex w-full items-end justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-2xl font-semibold leading-[1.05] text-background">
                {workoutDay.name}
              </h2>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <Timer className="size-3.5 text-background/70" />
                  <span className="font-heading text-xs leading-[1.4] text-background/70">
                    {formatDuration(workoutDay.estimatedDurationInSeconds)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="size-3.5 text-background/70" />
                  <span className="font-heading text-xs leading-[1.4] text-background/70">
                    {workoutDay.exercises.length} exercícios
                  </span>
                </div>
              </div>
            </div>

            {!hasInProgressSession &&
              (hasCompletedSession ? (
                <Button
                  variant="ghost"
                  className="rounded-full font-heading text-sm font-semibold text-background hover:bg-background/16 hover:text-background"
                >
                  Concluído!
                </Button>
              ) : (
                <StartWorkoutButton
                  workoutPlanId={workoutPlanId}
                  workoutDayId={workoutDayId}
                />
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {workoutDay.exercises
            .sort((a, b) => a.order - b.order)
            .map((exercise) => (
              <div
                key={exercise.id}
                className="flex flex-col justify-center gap-3 rounded-xl border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-base font-semibold leading-[1.4] text-foreground">
                    {exercise.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="size-5 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <CircleHelp className="size-5" />
                  </Button>
                </div>
                <div className="flex gap-1.5">
                  <div className="flex items-center rounded-full bg-secondary px-2.5 py-1.5">
                    <span className="font-heading text-xs font-semibold uppercase leading-none text-muted-foreground">
                      {exercise.sets} séries
                    </span>
                  </div>
                  <div className="flex items-center rounded-full bg-secondary px-2.5 py-1.5">
                    <span className="font-heading text-xs font-semibold uppercase leading-none text-muted-foreground">
                      {exercise.reps} reps
                    </span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1.5">
                    <Zap className="size-3.5 text-muted-foreground" />
                    <span className="font-heading text-xs font-semibold uppercase leading-none text-muted-foreground">
                      {exercise.restTimeInSeconds}s
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {inProgressSession && (
          <CompleteWorkoutButton
            workoutPlanId={workoutPlanId}
            workoutDayId={workoutDayId}
            sessionId={inProgressSession.id}
          />
        )}
      </div>

      <NavigationBar calendarHref={calendarHref} />
    </div>
  );
}
