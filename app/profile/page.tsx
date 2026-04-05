import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Weight, Ruler, BicepsFlexed, User } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getUserTrainData } from "@/app/_lib/api/fetch-generated";
import { NavigationBar } from "@/components/navigation-bar";
import { StatCard } from "@/app/stats/_components/stat-card";
import { UserHeader } from "./_components/user-header";
import { LogoutButton } from "./_components/logout-button";

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const trainData = await getUserTrainData();

  const user = session.data.user;
  const data = trainData.status === 200 ? trainData.data : null;

  const weightKg = data ? (data.weightInGrams / 1000).toFixed(1) : "-";
  const heightCm = data ? String(data.heightInCentimeters) : "-";
  const bodyFat = data ? `${data.bodyFatPercentage}%` : "-";
  const age = data ? String(data.age) : "-";

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex h-14 items-center px-5">
        <p className="font-anton text-[22px] uppercase leading-[1.15] text-foreground">
          Fit.ai
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 p-5">
        <div className="flex w-full items-center justify-between">
          <UserHeader
            name={user.name ?? ""}
            image={user.image ?? null}
          />
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <StatCard icon={Weight} value={weightKg} label="KG" />
          <StatCard icon={Ruler} value={heightCm} label="CM" />
          <StatCard icon={BicepsFlexed} value={bodyFat} label="GC" />
          <StatCard icon={User} value={age} label="ANOS" />
        </div>

        <LogoutButton />
      </div>

      <NavigationBar />
    </div>
  );
}
