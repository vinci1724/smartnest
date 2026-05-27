# AGENTS.md

## Repo Shape

- pnpm workspace repo; packages are `apps/*` and `packages/*` from `pnpm-workspace.yaml`.
- There is no Turborepo config yet; root scripts use `pnpm -r` / package filters directly.
- Current apps: `apps/backend` NestJS API, `apps/web` Next.js app, `apps/mobile` placeholder only.
- `packages/shared` is intended for framework-agnostic shared types/constants/Zod schemas; it currently contains only stubs.
- `docs/SmartNest_Modern_Fullstack_Roadmap.md` is a roadmap, not current implementation. Verify against scripts/config/code before assuming features exist.

## Commands

- Install with `pnpm install --frozen-lockfile` when matching CI.
- Root checks: `pnpm format:check`, `pnpm lint`, `pnpm build`, `pnpm test`.
- There is no root `typecheck` script yet.
- Run one package with filters, e.g. `pnpm --filter @smartnest/backend build`, `pnpm --filter @smartnest/web build`, `pnpm --filter @smartnest/shared build`.
- Backend unit tests: `pnpm --filter @smartnest/backend test`.
- Backend e2e tests: `pnpm --filter @smartnest/backend test:e2e`.
- Web dev server: `pnpm --filter @smartnest/web dev` on port `3001`.
- Backend dev server: `pnpm --filter @smartnest/backend dev` on port `3000` unless `PORT` overrides it.
- Root `pnpm dev` runs recursive package dev scripts; `apps/mobile` is only a TODO echo, not Expo.

## Backend Notes

- Backend entrypoint is `apps/backend/src/main.ts`; it currently only creates `AppModule` and listens, with no global validation pipe, API versioning, Swagger, or filters yet.
- Nest build uses `apps/backend/nest-cli.json` with `sourceRoot: src` and `deleteOutDir: true`.
- Backend TS intentionally overrides the root TS config to `module: CommonJS` and `moduleResolution: Node` for NestJS decorators/runtime.
- Prisma 7 config lives in `apps/backend/prisma.config.ts`; datasource URL comes from `DATABASE_URL` there, not from `schema.prisma`.
- Prisma schema is `apps/backend/prisma/schema.prisma`; generated client output is `apps/backend/generated/prisma`.
- Run Prisma from the backend package context, e.g. `pnpm --filter @smartnest/backend exec prisma generate` or `pnpm --filter @smartnest/backend exec prisma migrate dev`.
- No Prisma migrations are present yet.

## Infra And Env

- Local infra is `docker-compose.yml`: TimescaleDB/Postgres on `5432`, Redis on `6379`, Kafka on `9092`, Nginx on `80`.
- Use `.env.example` for expected env names; do not commit real `.env*` files because `.gitignore` only allows `.env.example`.
- Nginx proxies `/api/` to backend `3000`, `/ws` to backend WebSocket, and everything else to web `3001`.

## CI Expectations

- GitHub Actions runs `pnpm install --frozen-lockfile`, then `pnpm format:check`, then `pnpm lint`.
- Backend CI builds `@smartnest/backend...` before running backend Jest with coverage and Postgres/Redis service containers.
- Web CI builds `@smartnest/web...`; there is no Playwright job yet.

## Style Gotchas

- Prettier is single quotes, semicolons, trailing commas, print width `80`, LF endings.
- `.prettierignore` excludes `pnpm-lock.yaml`; do not format the lockfile manually.
- Root ESLint ignores `dist`, `node_modules`, `.next`, and `coverage`; TypeScript `no-explicit-any` and unused vars are warnings, not errors.
