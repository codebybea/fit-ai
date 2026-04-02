import Image from "next/image";
import Link from "next/link";
import { Calendar, Timer, Dumbbell } from "lucide-react";
import type { GetHome200TodayWorkoutDay } from "@/app/_lib/api/fetch-generated";

const WEEK_DAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}min`;
}

interface WorkoutDayCardProps {
  workoutDay: GetHome200TodayWorkoutDay;
}

export function WorkoutDayCard({ workoutDay }: WorkoutDayCardProps) {
  const dayLabel = WEEK_DAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay;

  return (
    <Link href={`/workout-plans/${workoutDay.workoutPlanId}/days/${workoutDay.id}`}>
      <div className="relative flex h-[200px] flex-col items-start justify-between overflow-hidden rounded-xl p-5">
        {workoutDay.coverImageUrl && (
          <Image
            src={workoutDay.coverImageUrl}
            alt={workoutDay.name}
            fill
            className="pointer-events-none object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative flex items-center justify-center">
          <div className="flex items-center gap-1 rounded-full bg-background/16 px-2.5 py-1.5 backdrop-blur-sm">
            <Calendar className="size-3.5 text-background" />
            <span className="font-heading text-xs font-semibold uppercase leading-none text-background">
              {dayLabel}
            </span>
          </div>
        </div>

        <div className="relative flex flex-col gap-2">
          <h3 className="font-heading text-2xl font-semibold leading-[1.05] text-background">
            {workoutDay.name}
          </h3>
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
                {workoutDay.exercisesCount} exercícios
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
