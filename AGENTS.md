# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

This is a NestJS 11 TypeScript monorepo for API services. The repo contains two Nest
applications and shared libraries:

- `apps/backoffice`: main backoffice API application. This is the default Nest root.
- `apps/client`: client-facing API application.
- `libs/common`: shared infrastructure for configuration, TypeORM entities, auth guards,
  decorators, filters, interceptors, base entities, and utilities.
- `libs/core`: domain, application use cases, presentation modules/DTOs, and infrastructure
  implementations.
- `migrations`: TypeORM migrations and initial seed scripts.

Use the existing layered style. Controllers in `apps/*` should stay thin and delegate business
logic to use cases from `libs/core`. Shared framework concerns belong in `libs/common`.

## Commands

Use Yarn; this repo has a `yarn.lock`.

- Install dependencies: `yarn install`
- Build: `yarn build`
- Start default app: `yarn start`
- Start in watch mode: `yarn start:dev`
- Start production build: `yarn start:prod`
- Lint and auto-fix: `yarn lint`
- Format TypeScript files: `yarn format`
- Run unit tests: `yarn test`
- Run tests in watch mode: `yarn test:watch`
- Run coverage: `yarn test:cov`
- Run e2e tests: `yarn test:e2e`
- TypeORM CLI: `yarn typeorm`
- Create migration: `yarn migration:create <path>`
- Show migrations: `yarn migration:show`
- Run migrations: `yarn migration:run`
- Revert migration: `yarn migration:revert`
- Drop schema: `yarn schema:drop`
- Run initial data script: `yarn data:init`

Before finishing code changes, run the narrowest useful verification first. For most TypeScript
changes, prefer `yarn test` or a targeted Jest file if possible, then `yarn build` for wider
contract checks when the change touches module wiring, DTOs, entities, or imports.

## Environment

Copy `.env.example` to `.env` for local runs. Important groups:

- Database: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- MinIO: `MINIO_URL`, `MINIO_PORT`, `MINIO_SSL`, `MINIO_ACCESS_KEY`,
  `MINIO_SECRET_KEY`, `MINIO_BUCKET`
- App: `APP_PORT`, `APP_PREFIX`, `SERVICE_SALTROUND`
- Auth: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRATION`, `JWT_REFRESH_EXPIRATION`

Do not commit real secrets from `.env`.

## Architecture Conventions

- Keep `apps/*` focused on Nest application composition and HTTP controllers.
- Put reusable configuration, global pipes/filters/interceptors, TypeORM entities, auth guards,
  decorators, and base classes in `libs/common`.
- Put business behavior in `libs/core/src/application/**` use cases.
- Put domain models and domain rules in `libs/core/src/domain/**`.
- Put Nest presentation modules and DTOs in `libs/core/src/presentation/**`.
- Put external persistence/service implementations in `libs/core/src/infrastructure/**`.
- Use repository ports from `libs/core/src/application/**/ports/**` and bind them to
  infrastructure classes in presentation/core modules.
- Prefer `@libs/common` and `@libs/core` path aliases over long relative imports.

When adding a new feature, follow the existing vertical shape:

1. Domain model/rules in `libs/core/src/domain/<feature>`.
2. Application use cases and ports in `libs/core/src/application/<feature>`.
3. Infrastructure repositories/providers in `libs/core/src/infrastructure/<feature>`.
4. DTOs and Nest module exports in `libs/core/src/presentation/<feature>`.
5. Thin route/controller wiring in the relevant `apps/<app>/src/modules/<feature>`.

## API Behavior

`apps/backoffice/src/main.ts` configures important global behavior:

- Global prefix from `APP_PREFIX`, default `api`.
- URI versioning with default version `1`.
- CORS enabled with credentials.
- `HttpExceptionFilter` and `TypeORMExceptionFilter`.
- `TransformInterceptor` wraps responses.
- `SnakeToCamelPipe` runs before `ValidationPipe`.
- Swagger is served under `/<prefix>/docs`.

Preserve these conventions when adding endpoints. Controller responses usually return an object
with a `result` key and, for list endpoints, a `pagination` object.

## Style

- TypeScript target is ES2023 with CommonJS modules.
- Prettier: single quotes, semicolons, trailing commas, 2 spaces, `printWidth` 100, LF endings.
- ESLint uses type-aware TypeScript rules and Prettier integration.
- `noUnusedParameters` and `noUnusedLocals` are enabled in `tsconfig.json`; remove unused code.
- `strictNullChecks` is enabled. Model nullable behavior explicitly.
- `noImplicitAny` is disabled, but prefer useful explicit types for public methods, DTOs, ports,
  and repository boundaries.
- Keep comments sparse and useful. Avoid restating obvious code.

## Testing

Jest discovers `*.spec.ts` under `apps/` and `libs/`.

- Unit tests should sit near the code under test.
- Favor testing use cases and domain rules directly.
- Add or update tests when changing auth/session behavior, permission checks, repository mapping,
  entity fields, DTO validation, response shape, or migration-sensitive behavior.
- For small controller wiring changes, a build plus a focused test may be enough.

## Database and Migrations

- TypeORM entities live in `libs/common/src/entities`.
- Migrations live in `migrations/table`.
- Initial seed/data scripts live in `migrations/initial`.
- Keep entity changes and migrations in sync.
- Do not run `schema:drop`, `migration:revert`, or other destructive DB commands unless the user
  explicitly asks for it.

## Auth and Permissions

Auth, token, session, and permission behavior is spread across:

- `apps/backoffice/src/auth`
- `libs/common/src/authentication`
- `libs/common/src/decorator`
- `libs/core/src/application/auth`
- `libs/core/src/application/token`
- `libs/core/src/presentation/permission`
- `libs/core/src/domain/permission`

Be extra careful with access token, refresh token, session, and permission changes. Update tests
and exception behavior together when changing these flows.

## Working Rules for Agents

- Read the surrounding code before editing; follow the current pattern instead of introducing a
  new framework or style.
- Keep changes scoped to the user request.
- Do not revert user changes or clean up unrelated modified files.
- Avoid editing generated output such as `dist/` unless explicitly requested.
- Do not commit, push, drop schemas, run migrations against a real database, or modify secrets
  unless the user asks.
- If a command needs external services such as PostgreSQL or MinIO and fails locally, report that
  clearly instead of masking the failure.

