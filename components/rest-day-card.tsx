import Image from "next/image";
import { Calendar, Moon } from "lucide-react";

const WEEK_DAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

interface RestDayCardProps {
  weekDay: string;
}

export function RestDayCard({ weekDay }: RestDayCardProps) {
  const dayLabel = WEEK_DAY_LABELS[weekDay] ?? weekDay;

  return (
    <div className="relative flex h-[200px] flex-col items-start justify-between overflow-hidden rounded-xl p-5">
      <Image
        src="/rest-day-banner.jpg"
        alt="Dia de descanso"
        fill
        className="pointer-events-none object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

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
          Dia de Descanso
        </h3>
        <div className="flex items-center gap-1">
          <Moon className="size-3.5 text-background/70" />
          <span className="font-heading text-xs leading-[1.4] text-background/70">
            Recupere-se para o próximo treino
          </span>
        </div>
      </div>
    </div>
  );
}
