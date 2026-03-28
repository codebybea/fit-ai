"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Calendar,
  Sparkles,
  ChartNoAxesColumn,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/", icon: House, label: "Início" },
  { href: "#", icon: Calendar, label: "Calendário" },
  { href: "#", icon: Sparkles, label: "IA", highlighted: true },
  { href: "#", icon: ChartNoAxesColumn, label: "Estatísticas" },
  { href: "#", icon: UserRound, label: "Perfil" },
];

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 rounded-t-[20px] border border-border bg-background px-6 py-4">
      {NAV_ITEMS.map((item) => {
        const isActive = item.href !== "#" && pathname === item.href;

        if (item.highlighted) {
          return (
            <Button
              key={item.label}
              variant="ghost"
              size="icon"
              className="size-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="size-6" />
              </Link>
            </Button>
          );
        }

        return (
          <Button
            key={item.label}
            variant="ghost"
            size="icon"
            className="size-12"
            asChild
          >
            <Link href={item.href}>
              <item.icon
                className={`size-6 ${isActive ? "text-foreground" : "text-muted-foreground"}`}
              />
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
