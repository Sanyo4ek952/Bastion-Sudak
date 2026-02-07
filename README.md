# Bastion-Sudak

## Setup

```bash
pnpm install
```

Create a `.env` file using `.env.example` and update the values for your local setup.

```bash
cp .env.example .env
```

Set admin basic auth credentials for protected `/admin/*` and `/api/admin/*` routes:

```
ADMIN_BASIC_USER="admin"
ADMIN_BASIC_PASS="change-me"
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

4. Seed demo data (rooms + seasonal rates):

```bash
pnpm prisma:seed
```

## Development

```bash
pnpm dev
```

## Endpoints

Lead form: `POST /api/leads`

Notes:
- Honeypot field: send `website` (should be empty); if filled, the API returns `{ ok: true }` without saving.
- Rate limit: 10 requests per 10 minutes per IP (returns 429 on limit).

Example request:

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"phone":"+79990001122","consent":true,"checkIn":"2024-10-12","checkOut":"2024-10-15","website":""}'
```

Booking requests: `POST /api/booking-requests`

Quote calculation: `GET /api/quote?roomId=...&checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD`

Health check: `GET /api/health`

## Manual testing (E2E)

1. Open `/` and submit the lead form (“Мы вам перезвоним”).
2. Visit `/rooms`, open a room card, and calculate a price.
3. Submit a booking request from `/rooms/[slug]`.
4. Open `/prices` to see base and seasonal prices.
5. Open `/admin/rooms` to manage rooms.
6. Open `/admin/prices` to manage seasonal overrides.
7. Open `/admin/requests` to review and update request statuses.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```
