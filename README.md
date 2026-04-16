# FIT.AI

Aplicação web de treinos personalizados com IA.

🔗 [fitai.aibeas.com.br](https://www.fitai.aibeas.com.br)

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** + shadcn/ui
- **BetterAuth** — autenticação via Google OAuth
- **Orval** — cliente de API gerado via Swagger
- **AI SDK** — integração com IA
- **React Hook Form** + Zod

> Este repositório é o frontend apenas. O backend é mantido separadamente.

## Rodando localmente

```bash
pnpm install
```

Crie um `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

```bash
pnpm dev
```

## Scripts

```bash
pnpm dev       # desenvolvimento
pnpm build     # build de produção
pnpm lint      # linter
npx orval      # regenera o cliente de API
```
