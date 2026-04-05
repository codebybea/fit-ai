"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/app/_lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (!error) {
      router.push("/auth");
    }
  };

  return (
    <Button
      variant="ghost"
      className="gap-2 rounded-full text-destructive hover:text-destructive"
      onClick={handleLogout}
    >
      <span className="font-heading text-base font-semibold leading-none">
        Sair da conta
      </span>
      <LogOut className="size-4" />
    </Button>
  );
}
