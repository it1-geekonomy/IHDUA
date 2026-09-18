# NestJS Backend — IHDUA

NestJS + TypeScript + PostgreSQL (Docker) + TypeORM migrations + Swagger.

## Stack

- **NestJS** (TypeScript)
- **PostgreSQL** via Docker
- **TypeORM** (migrations; `synchronize` off by default)
- **Swagger** at `/api/docs`

## Architecture

This is a clean, basic NestJS setup configured for the IHDUA project. 

```
src/
  config/
    configuration.ts

  database/
    database.module.ts
    data-source.ts                # TypeORM CLI
    migrations/

  app.module.ts
  main.ts
```

## Getting started

### 1. Install

```bash
pnpm install
```

### 2. Env

```bash
cp .env.example .env
```

### 3. Postgres

Start the PostgreSQL database using the included docker-compose file:

```bash
docker-compose up -d
```

Alternatively, you can run it manually without docker-compose:

```bash
docker run -d --name ihdua_postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ihdua_db -p 5433:5432 -v ihdua_pgdata:/var/lib/postgresql/data pgvector/pgvector:pg16
```

### 4. Migrations

Generate your first initial schema once you create your entities:

```bash
pnpm run migration:generate -- src/database/migrations/InitSchema
pnpm run migration:run
```

For local bootstrap only you may set `DB_SYNCHRONIZE=true` once in `.env` — keep it `false` in shared/prod environments.

### 5. Run

```bash
pnpm run start:dev
```

- API: `http://localhost:6061/api`
- Swagger: `http://localhost:6061/api/docs`
- Health: `http://localhost:6061/api/health`

## Adding a new module

1. Create a module folder using the Nest CLI: `npx nest g module users`
2. Add your entity, DTOs, service, and controller.
3. Import the feature module into `app.module.ts`.
4. Generate + run a migration.
