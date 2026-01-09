# AGENTS.md

System prompt for LLM agents helping with this moonrepo-kickstart codebase.

---

## Overview

Full-stack monorepo: **FastAPI** + **React 19** + **Shared TypeScript API client**

**Stack**: FastAPI, SQLModel (async), PostgreSQL, Redis, Celery, React 19, TanStack Router/Query, Tailwind CSS 4

**Key Features**: JWT + OAuth (Google/GitHub), WebSocket, Background tasks

---

## Structure

```
apps/api/app/
├── api/{feature}/api.py          # Routes
├── api/{feature}/serializer.py   # SQLModel schemas (API DTOs)
├── modules/{feature}/service.py  # Business logic
├── models/{model}.py             # SQLModel models (table=True)
└── core/                         # settings, security, celery, websocket

apps/platform/src/
├── modules/{feature}/            # components/ + hooks/ (TanStack Query)
├── routes/{route}.tsx            # File-based routing (createFileRoute)
└── lib/api.ts                    # Singleton API from @repo/core

packages/core/src/
├── client.ts                     # ApiClient (ky + token mgmt)
├── api/{feature}.ts              # API methods (tRPC-like)
└── types/{feature}.ts            # Types mirror backend
```

---

## Rules

**Backend**:
- Layered: `api` → `modules` → `models`
- Always async: `AsyncSession`, `await db.execute()`, `Depends(get_db)`
- Models: Use `SQLModel` with `table=True` for database models, `Field()` for columns
- Schema changes require Alembic migrations (`alembic revision --autogenerate`)
- Protected routes: `current_user: Annotated[User, Depends(get_current_user)]`
- Naming: `snake_case` files/functions, `PascalCase` classes

**Frontend**:
- Module-based: `modules/{feature}/` with `components/` + `hooks/`
- File-based routing: `routes/{name}.tsx` → `/{name}`
- Always use `@repo/core` API client, never fetch/axios
- TanStack Query: Wrap calls in `useMutation` / `useQuery` hooks
- Protected routes: Use `useMe()` hook

**Shared (`@repo/core`)**:
- Types MUST mirror backend Pydantic schemas exactly
- API pattern: `api.{feature}.{method}()`
- Token management: `api.setTokens()`, `api.getClient().clearTokens()`

---

## Authentication

**JWT**: Access (30min) + Refresh (7 days) tokens, stored in localStorage

**OAuth Flow**:
1. `api.auth.loginWithGoogle()` → redirects to Google
2. Callback: `GET /auth/google/callback?code=...`
3. Backend: `get_or_create_oauth_user()` (searches provider_id → email → creates)
4. Redirects: `http://localhost:3000/auth/callback?access_token=...&refresh_token=...`
5. Frontend extracts tokens, navigates home

**User Model**: `email`, `username`, `hashed_password`, `refresh_token`, `oauth_provider`, `oauth_provider_id`, `avatar_url`, `full_name`

---

## Adding Features

**Backend**: model → migration (`alembic revision --autogenerate`) → serializer → service → router → register in `main.py`

**Frontend**: route (`routes/{name}.tsx`) → module (`modules/{feature}/`) → components + hooks → use in route

**Shared**: types (`types/{feature}.ts`) → API class (`api/{feature}.ts`) → attach to main Api → export types

---

## Commands

```bash
# Dev
moon run api:dev          # FastAPI :8000
moon run platform:dev     # Vite :3000
moon run api:worker       # Celery

# Migrations
cd apps/api && uv run alembic revision --autogenerate -m "msg"
uv run alembic upgrade head

# Quality
pnpm run format          # Biome
moon run api:check       # Python type check
moon :check              # Pre-commit
```

---

## WebSocket & Celery

**WebSocket**: `/ws/{client_id}`, Redis-backed, multi-instance ready

**Celery**: Create task in `tasks/{task}.py`, trigger with `.delay()`, run `moon run api:worker`

---

## Don't

1. Edit `routeTree.gen.ts`, `.venv/`, `node_modules/`, `*.lock`
2. Modify DB schema without Alembic migration
3. Use sync DB operations (always async)
4. Use fetch/axios (use `@repo/core`)
5. Skip formatting before commit
6. Create users without bcrypt hashing
7. Expose secrets (use `.env`)
8. Bypass authentication checks
9. Store tokens in cookies without CSRF protection
10. Import from parent packages (use `@repo/core`)
