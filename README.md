# Bastion-Sudak

## Setup

```bash
pnpm install
```

Create a `.env` file using `.env.example` and update the values for your local setup.

```bash
cp .env.example .env
```

Set admin basic auth credentials for protected `/admin/*` routes:

```
ADMIN_BASIC_USER="admin"
ADMIN_BASIC_PASS="change-me"
```

Set Telegram notifications (optional; if not set, notifications are disabled):

```
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_CHAT_ID="your-chat-id"
```

### Postgres + Prisma

1. Start a local Postgres instance (for example, via Docker):

```bash
docker run --name bastion-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bastion_sudak -p 5432:5432 -d postgres:16
```

2. Set `DATABASE_URL` in `.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bastion_sudak?schema=public"
```

3. Run Prisma migrations:

```bash
pnpm prisma:migrate
```

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"phone":"+79990000000","consent":true,"name":"Алина","guests":2,"comment":"Перезвоните после 18:00"}'
```

## Development

```bash
pnpm dev
```

## Lead form API

Endpoint: `POST /api/leads`

Notes:
- Honeypot field: send `website` (should be empty); if filled, the API returns `{ ok: true }` without saving.
- Rate limit: 10 requests per 10 minutes per IP (returns 429 on limit).

Example request:

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"phone":"+79990001122","consent":true,"checkIn":"2024-10-12","checkOut":"2024-10-15","website":""}'
```

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```
