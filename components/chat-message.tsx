"use client";

import type { UIMessage } from "ai";
import { Streamdown } from "streamdown";

interface ChatMessageProps {
  message: UIMessage;
  isStreaming: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";
  const text =
    message.parts
      ?.filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("") ?? "";

  if (isUser) {
    return (
      <div className="flex justify-end pl-[60px] pr-5 pt-5">
        <div className="rounded-xl bg-primary p-3">
          <p className="font-heading text-sm leading-[1.4] text-primary-foreground">
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start pl-5 pr-[60px] pt-5">
      <div className="rounded-xl bg-secondary p-3">
        <div className="font-heading text-sm leading-[1.4] text-foreground">
          <Streamdown mode={isStreaming ? "streaming" : "static"}>
            {text}
          </Streamdown>
        </div>
      </div>
    </div>
  );
}
