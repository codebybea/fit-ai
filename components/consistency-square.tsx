import { cn } from "@/lib/utils";

interface ConsistencySquareProps {
  completed: boolean;
  started: boolean;
  isToday: boolean;
}

export function ConsistencySquare({
  completed,
  started,
  isToday,
}: ConsistencySquareProps) {
  return (
    <div
      className={cn(
        "size-8 rounded-md border",
        completed
          ? "border-primary bg-primary"
          : started
            ? "border-primary bg-primary/50"
            : "border-border bg-background",
        isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    />
  );
}
