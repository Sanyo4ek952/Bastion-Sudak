# Bastion-Sudak

## Setup

```bash
pnpm install
```

Create a `.env` file using `.env.example` and update the values for your local setup.

```bash
cp .env.example .env
```

### Postgres + Prisma

1. Start a local Postgres instance (for example, via Docker):

```bash
docker run --name bastion-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bastion_sudak -p 5432:5432 -d postgres:16
```

2. Run Prisma migrations:

```bash
pnpm prisma:migrate
```

### Telegram notifications

1. Create a Telegram bot with `@BotFather` and copy the bot token.
2. Add the bot to the manager chat (or DM it) and get the chat ID using a helper bot like `@userinfobot`.
3. Set the values in your `.env` file:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

Run locally with the env vars and send a test lead:

```bash
TELEGRAM_BOT_TOKEN=your-token TELEGRAM_CHAT_ID=your-chat-id pnpm dev
```

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"phone":"+79990000000","consent":true}'
```

## Development

```bash
pnpm dev
```

## Lead form API

Endpoint: `POST /api/leads`

Example request:

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"phone":"+79990001122","consent":true}'
```

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```
