"use client";

import { useEffect, useRef, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { ChatMessage } from "@/components/chat-message";

const messageSchema = z.object({
  message: z.string().min(1),
});

interface ChatProps {
  initialMessages?: UIMessage[];
  autoSendMessage?: string;
  headerAction?: React.ReactNode;
}

export function Chat({ initialMessages, autoSendMessage, headerAction }: ChatProps) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
        credentials: "include",
      }),
    [],
  );

  const { messages, sendMessage, status } = useChat({
    transport,
    initialMessages,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: "" },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentInitial = useRef(false);
  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (autoSendMessage && !hasSentInitial.current) {
      hasSentInitial.current = true;
      sendMessage({ text: autoSendMessage });
    }
  }, [autoSendMessage, sendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = (values: z.infer<typeof messageSchema>) => {
    if (isStreaming) return;
    sendMessage({ text: values.message.trim() });
    form.reset();
  };

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="flex shrink-0 items-center justify-between border-b border-border p-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-full border border-primary/8 bg-primary/8 p-3">
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
        {headerAction}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto pb-[90px]">
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

      <div className="fixed bottom-0 left-0 right-0 shrink-0 bg-background">
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
  );
}
