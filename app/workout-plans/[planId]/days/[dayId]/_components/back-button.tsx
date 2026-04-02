"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={() => router.back()}
      className="p-0"
    >
      <ChevronLeft className="size-6 text-foreground" />
    </Button>
  );
}
