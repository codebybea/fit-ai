export function TypingIndicator() {
  return (
    <div className="flex justify-start pl-5 pr-[60px] pt-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-1.5 rounded-xl bg-secondary px-4 py-3.5">
        <span
          className="size-2 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="size-2 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="size-2 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
