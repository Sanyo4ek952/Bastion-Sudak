# Bastion-Sudak

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Lead form API

Endpoint (stub): `POST /api/leads`

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
