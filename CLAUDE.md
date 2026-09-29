# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Critical: unfamiliar Next.js version

This project runs **Next.js 16.3.6** with **React 19.2.8**, ahead of training data and with breaking API changes. Per `AGENTS.md`, before writing or modifying any code, read the relevant guide under `node_modules/next/dist/docs/` rather than relying on remembered Next.js conventions — deprecation notices there are authoritative.

One concrete example already present in this codebase: `app/layout.tsx`'s `RootLayout` types its props as `LayoutProps<"/">` (a generated, route-specific type) rather than the classic hand-written `{ children: React.ReactNode }`. Follow whatever typing/generation convention the docs describe for new routes rather than assuming older patterns still apply.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint via eslint.config.mjs
```

There is no test runner configured in `package.json` yet.

## Architecture

This is a minimal `create-next-app` scaffold using the **App Router** (`app/` directory, not `pages/`). Current contents are just the default template:

- `app/layout.tsx` — root layout; loads Geist/Geist Mono via `next/font/google` and sets them as CSS variables on `<html>`.
- `app/page.tsx` — the `/` route.
- `app/globals.css` — global styles (Tailwind).

Styling is **Tailwind CSS v4**, configured via `@tailwindcss/postcss` in `postcss.config.mjs` (no separate `tailwind.config.*` — v4 uses CSS-based config, typically in `globals.css`).

Path alias `@/*` maps to the project root (`tsconfig.json`).

ESLint is flat-config (`eslint.config.mjs`), extending `eslint-config-next`'s `core-web-vitals` and `typescript` rule sets.
