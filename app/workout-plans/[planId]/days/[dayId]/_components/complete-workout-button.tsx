"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { completeWorkoutAction } from "../_actions/complete-workout";

interface CompleteWorkoutButtonProps {
  workoutPlanId: string;
  workoutDayId: string;
  sessionId: string;
}

export function CompleteWorkoutButton({
  workoutPlanId,
  workoutDayId,
  sessionId,
}: CompleteWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await completeWorkoutAction(workoutPlanId, workoutDayId, sessionId);
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant="outline"
      className="w-full rounded-full py-3 font-heading text-sm font-semibold text-foreground"
    >
      {isPending ? "Concluindo..." : "Marcar como concluído"}
    </Button>
  );
}
