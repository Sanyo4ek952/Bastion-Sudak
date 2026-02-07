# Hotel Bastion MVP — Agent Rules

## Goal (Phase 0)
Build MVP: landing + lead form “Мы вам перезвоним”, save lead to DB, notify manager (Telegram).
No online booking, no payments, no admin panel yet.

## Stack (strict)
- Next.js (App Router) + TypeScript
- TailwindCSS
- React Hook Form + Zod
- Prisma + Postgres
- No Redux/RTK Query, no UI kits, no CMS, no extra state libs.

## Workflow
- Always propose a short plan (5–10 bullets) BEFORE editing.
- Small PRs: max ~300 lines changed, focused scope.
- Never delete files unless asked.
- Add dependencies only if absolutely required; justify each.

## Quality gates
- Must pass: pnpm lint, pnpm typecheck, pnpm build
- Add basic error handling + input validation on server.

## Data model (Phase 0)
Lead: id, createdAt, status=NEW, name?, phone, checkIn?, checkOut?, guests?, comment?,
source?, pageUrl?, userAgent?, utm(JSON).

## Deliverables per PR
- Clear PR description: what/why/how to test.
- Update README when setup changes.
