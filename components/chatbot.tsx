"use client";

import { useEffect, useRef, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { ChatMessage } from "@/components/chat-message";

const messageSchema = z.object({
  message: z.string().min(1),
});

const SUGGESTED_MESSAGES = ["Monte meu plano de treino"];

export function Chatbot() {
  const [{ chat_open, chat_initial_message }, setChatState] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString.withDefault(""),
  });

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
        credentials: "include",
      }),
    [],
  );

  const { messages, sendMessage, status, setMessages } = useChat({ transport });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: "" },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sentInitialRef = useRef<string | null>(null);
  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (!chat_open || !chat_initial_message) return;
    if (sentInitialRef.current === chat_initial_message) return;
    sentInitialRef.current = chat_initial_message;
    sendMessage({ text: chat_initial_message });
    setChatState({ chat_initial_message: null });
  }, [chat_open, chat_initial_message, sendMessage, setChatState]);

  useEffect(() => {
    if (!chat_open) {
      setMessages([]);
      sentInitialRef.current = null;
    }
  }, [chat_open, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClose = () =>
    setChatState({ chat_open: false, chat_initial_message: null });

  const onSubmit = (values: z.infer<typeof messageSchema>) => {
    if (isStreaming) return;
    sendMessage({ text: values.message.trim() });
    form.reset();
  };

  if (!chat_open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center px-4 pb-4 pt-40">
      <div className="absolute inset-0 bg-foreground/30" onClick={handleClose} />

      <div className="relative flex w-full max-w-[393px] flex-1 flex-col overflow-hidden rounded-[20px] bg-background">
        <div className="flex shrink-0 items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full border border-primary/8 bg-primary/8 p-3">
              <Sparkles className="size-[18px] text-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
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

        <div className="flex flex-1 flex-col overflow-y-auto">
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
                <Button
                  key={suggestion}
                  type="button"
                  variant="ghost"
                  onClick={() => sendMessage({ text: suggestion })}
                  className="shrink-0 rounded-full bg-primary/10 px-4 py-2 font-heading text-sm text-foreground hover:bg-primary/20"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-2 border-t border-border p-5"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="Digite sua mensagem"
                        autoComplete="off"
                        className="w-full rounded-full border border-secondary bg-secondary px-4 py-3 font-heading text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
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
          </Form>
        </div>
      </div>
    </div>
  );
}
