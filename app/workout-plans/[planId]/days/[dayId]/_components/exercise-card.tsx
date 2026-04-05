import { CircleHelp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GetWorkoutDay200ExercisesItem } from "@/app/_lib/api/fetch-generated";

interface ExerciseCardProps {
  exercise: GetWorkoutDay200ExercisesItem;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <div className="flex flex-col justify-center gap-3 rounded-xl border border-border p-4">
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
  );
}
