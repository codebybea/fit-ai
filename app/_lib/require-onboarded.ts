import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { getHome, getUserTrainData } from "@/app/_lib/api/fetch-generated";

export async function requireOnboarded() {
  const [homeData, trainData] = await Promise.all([
    getHome(dayjs().format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  const hasActivePlan =
    homeData.status === 200 && !!homeData.data.activeWorkoutPlanId;
  const hasTrainData =
    trainData.status === 200 && trainData.data !== null;

  if (!hasActivePlan || !hasTrainData) {
    redirect("/onboarding");
  }
}
