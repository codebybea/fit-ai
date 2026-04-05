"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat-message";

const SUGGESTED_MESSAGES = ["Monte meu plano de treino"];

export function Chatbot() {
  const [chatState, setChatState] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString.withDefault(""),
  });

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include",
    }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialMessageSentRef = useRef<string | null>(null);

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (
      chatState.chat_open &&
      chatState.chat_initial_message &&
      initialMessageSentRef.current !== chatState.chat_initial_message
    ) {
      initialMessageSentRef.current = chatState.chat_initial_message;
      sendMessage({ text: chatState.chat_initial_message });
      setChatState({ chat_initial_message: null });
    }
  }, [
    chatState.chat_open,
    chatState.chat_initial_message,
    sendMessage,
    setChatState,
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClose = () => {
    setChatState({ chat_open: false, chat_initial_message: null });
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("message") as string;
    if (!text?.trim() || isStreaming) return;
    sendMessage({ text: text.trim() });
    e.currentTarget.reset();
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };

  if (!chatState.chat_open) return null;

  return (
    <div className="fixed inset-0 z-60 flex flex-col items-center px-4 pb-4 pt-40">
      <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

      <div className="relative flex w-full max-w-[393px] flex-1 flex-col overflow-hidden rounded-[20px] bg-background">
        <div className="flex shrink-0 items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full bg-primary/8 border border-primary/8 p-3">
              <Sparkles className="size-[18px] text-primary" />
            </div>
            <div className="flex flex-col gap-1.5 justify-center">
              <span className="font-heading text-base font-semibold leading-[1.05] text-foreground">
                Coach AI
              </span>
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-online" />
                <span className="font-heading text-xs leading-[1.15] text-primary">
                  Online
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="size-6" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto pb-5">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isStreaming={
                isStreaming &&
                message.id === messages[messages.length - 1]?.id &&
                message.role === "assistant"
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0">
          {messages.length === 0 && (
            <div className="flex gap-2.5 overflow-x-auto px-5 pb-3">
              {SUGGESTED_MESSAGES.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="shrink-0 rounded-full bg-primary/10 px-4 py-2 font-heading text-sm text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border p-5"
          >
            <input
              ref={inputRef}
              name="message"
              type="text"
              placeholder="Digite sua mensagem"
              autoComplete="off"
              className="flex-1 rounded-full border border-secondary bg-secondary px-4 py-3 font-heading text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isStreaming}
              className="size-[42px] shrink-0 rounded-full"
            >
              <ArrowUp className="size-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
