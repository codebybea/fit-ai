# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

FIT.AI — a fitness training web app built with Next.js 16, React 19, and TypeScript. The backend API is separate; this repo is the frontend only.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build`
- **Lint:** `pnpm lint`
- **Generate API client:** `npx orval` (requires `NEXT_PUBLIC_API_URL` in env)
- **Add shadcn component:** `pnpm dlx shadcn@latest add <component>`

## Architecture

### Routing & Pages

Next.js 16 App Router. Pages live in `app/`. Private modules use the `_` prefix convention (e.g., `app/_lib/`).

- `app/layout.tsx` — root layout (fonts: Geist, Geist Mono, Inter Tight)
- `app/page.tsx` — home page
- `app/auth/page.tsx` — authentication page (Google OAuth via BetterAuth)

### API Layer (Orval + custom fetch)

- **Config:** `orval.config.ts` reads Swagger from `NEXT_PUBLIC_API_URL`
- **Generated fetch functions:** `app/_lib/api/fetch-generated/index.ts` (server-side use)
- **Custom fetch mutator:** `app/_lib/fetch.ts` — wraps `fetch` with cookie forwarding for server components
- RC (React Query) generated hooks are planned at `lib/api/rc-generated/index.ts` (currently commented out in orval config)

### Auth

- **Client:** `app/_lib/auth-client.ts` — BetterAuth client pointing at `NEXT_PUBLIC_API_URL`
- Session checks use `authClient.useSession()` (no middleware)
- Protected pages redirect to `/auth`; `/auth` redirects to `/` if already logged in

### UI

- **shadcn/ui** (new-york style, RSC-enabled, lucide icons) — components in `components/ui/`
- **Shared components** in `components/`
- **Path aliases:** `@/*` maps to project root
- **Theming:** CSS variables in `app/globals.css` — never use hardcoded Tailwind colors

## Environment Variables

- `NEXT_PUBLIC_API_URL` — backend API base URL (used by auth client, orval, and custom fetch)
