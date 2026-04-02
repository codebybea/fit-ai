"use server";

import { startWorkoutSession } from "@/app/_lib/api/fetch-generated";
import { revalidatePath } from "next/cache";

export async function startWorkoutAction(
  workoutPlanId: string,
  workoutDayId: string,
) {
  await startWorkoutSession(workoutPlanId, workoutDayId);
  revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
}
