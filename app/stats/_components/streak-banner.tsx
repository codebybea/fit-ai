import Image from "next/image";
import { Flame } from "lucide-react";

interface StreakBannerProps {
  workoutStreak: number;
}

export function StreakBanner({ workoutStreak }: StreakBannerProps) {
  const isActive = workoutStreak > 0;

  return (
    <div className="px-5">
      <div className="relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-xl px-5 py-10">
        <Image
          src={isActive ? "/stats-banner-active.png" : "/stats-banner-inactive.png"}
          alt=""
          fill
          className="pointer-events-none object-cover"
          priority
        />
        <div className="relative flex flex-col items-center gap-3">
          <div className="flex items-center justify-center rounded-full border border-background/12 bg-background/12 p-3 backdrop-blur-[4px]">
            <Flame className="size-8 text-background" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-center font-heading text-5xl font-semibold leading-[0.95] text-background">
              {workoutStreak} dias
            </p>
            <p className="font-heading text-base leading-[1.15] text-background/60">
              Sequência Atual
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
