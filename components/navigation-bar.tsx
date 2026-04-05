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
import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";
import { Button } from "@/components/ui/button";

interface NavigationBarProps {
  calendarHref?: string | null;
}

export function NavigationBar({ calendarHref }: NavigationBarProps) {
  const pathname = usePathname();
  const [, setChatState] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString.withDefault(""),
  });

  const navItems = [
    { href: "/", icon: House, label: "Início" },
    { href: calendarHref ?? "#", icon: Calendar, label: "Calendário" },
    { href: "#", icon: Sparkles, label: "IA", highlighted: true },
    { href: "/stats", icon: ChartNoAxesColumn, label: "Estatísticas" },
    { href: "/profile", icon: UserRound, label: "Perfil" },
  ];

  const handleOpenChat = () => {
    setChatState({ chat_open: true });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 rounded-t-[20px] border border-border bg-background px-6 py-4">
      {navItems.map((item) => {
        const isActive =
          item.label === "Calendário"
            ? pathname.startsWith("/workout-plans/")
            : item.href !== "#" && pathname.startsWith(item.href) && (item.href !== "/" || pathname === "/");

        if (item.highlighted) {
          return (
            <Button
              key={item.label}
              variant="ghost"
              size="icon"
              className="size-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              onClick={handleOpenChat}
            >
              <item.icon className="size-6" />
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
