# Bastion-Sudak

## Setup

```bash
pnpm install
```

Create a `.env.local` (or `.env`) file using `.env.example` and update the values for your local setup.

```bash
cp .env.example .env
```

Update the values in the newly created `.env` (or `.env.local`) file to match your local or server setup.

Set admin basic auth credentials for protected `/admin/*` and `/api/admin/*` routes:

```
ADMIN_BASIC_USER="admin"
ADMIN_BASIC_PASS="change-me"
```

## Environment Variables

- `DATABASE_URL` – PostgreSQL connection string (example: `postgresql://postgres:postgres@localhost:5432/bastion_sudak?schema=public`).
- `ADMIN_BASIC_USER` and `ADMIN_BASIC_PASS` – login and password for HTTP Basic-auth protection on `/admin/*` and `/api/admin/*`.

### Postgres + Prisma

1. Start a local Postgres instance (for example, via Docker). Running Postgres in Docker is just one option; a locally installed database is also fine as long as `DATABASE_URL` points to it.

```bash
docker run --name bastion-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bastion_sudak -p 5432:5432 -d postgres:16
```

2. Set `DATABASE_URL` in `.env.local` (or `.env`) so it points to a running Postgres instance:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bastion_sudak?schema=public"
```

3. Run Prisma migrations (creates tables if not yet created):

```bash
pnpm prisma:migrate dev --name init
```

4. Seed demo data (rooms + seasonal rates):

```bash
pnpm prisma:seed
```

## Running the project

### Development

Ensure Postgres is running and migrations are applied before starting the dev server:

```bash
pnpm install
pnpm prisma:migrate dev --name init
pnpm dev
```

The dev server will be available at `http://localhost:3000`.

### Production

Build and run the project in production mode:

```bash
pnpm install
pnpm prisma:generate       # if you need to generate Prisma Client
pnpm prisma:migrate deploy # apply migrations on the production database
pnpm prisma:seed           # seed the database with initial data (optional)
pnpm build                 # build Next.js
pnpm start                 # run in production mode
```

Ensure the environment variables in `.env` are configured on the production server.

## Admin

To access the admin area, open `http://localhost:3000/admin` and enter the login and password from your `.env` file.

Admin pages:
- `/admin/rooms` – manage rooms.
- `/admin/prices` – manage seasonal overrides.
- `/admin/requests` – review and update request statuses.

## UI refresh

Design tokens live in `src/app/globals.css` as CSS variables. Tailwind maps them in
`tailwind.config.ts` (background, foreground, muted, card, border, accent).
To extend the UI, reuse shared components under `src/shared/ui` (Button, Card,
SectionHeader, Container, Badge) and keep sections wrapped in `Container` for
consistent spacing.

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
pnpm test
```
