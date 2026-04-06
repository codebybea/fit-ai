import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import type { UIMessage } from "ai";
import { authClient } from "@/app/_lib/auth-client";
import { Chat } from "@/components/chat";
import { Button } from "@/components/ui/button";

const INITIAL_MESSAGES: UIMessage[] = [
  {
    id: "onboarding-1",
    role: "assistant",
    parts: [{ type: "text", text: "Bem-vindo ao FIT.AI! 🎉" }],
    metadata: undefined,
  },
  {
    id: "onboarding-2",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "O app que vai transformar a forma como você treina. Aqui você monta seu plano de treino personalizado, acompanha sua evolução com estatísticas detalhadas e conta com uma IA disponível 24h para te guiar em cada exercício.",
      },
    ],
    metadata: undefined,
  },
  {
    id: "onboarding-3",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Tudo pensado para você alcançar seus objetivos de forma inteligente e consistente.",
      },
    ],
    metadata: undefined,
  },
  {
    id: "onboarding-4",
    role: "assistant",
    parts: [{ type: "text", text: "Vamos configurar seu perfil?" }],
    metadata: undefined,
  },
];

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  return (
    <Chat
      initialMessages={INITIAL_MESSAGES}
      autoSendMessage="Quero começar a melhorar minha saúde"
      headerAction={
        <Button variant="outline" size="sm" asChild>
          <Link href="/">Acessar FIT.AI</Link>
        </Button>
      }
    />
  );
}
