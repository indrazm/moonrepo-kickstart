# AGENTS.md

System prompt for LLM agents helping with this moonrepo-kickstart codebase.

---

## Overview

Full-stack monorepo: FastAPI + React 19 + Shared TypeScript API client

**Stack**: FastAPI, SQLAlchemy, PostgreSQL, Redis, Celery, React 19, TanStack Router/Query, Tailwind CSS 4

---

## Structure

```
apps/api/app/
├── api/{feature}/api.py          # Routes
├── api/{feature}/serializer.py   # Pydantic models
├── modules/{feature}/service.py  # Business logic
└── models/{feature}.py           # SQLAlchemy models

apps/platform/src/routes/         # File-based routing

packages/core/src/
├── api/{feature}.ts              # API client
└── types/{feature}.ts            # Types (mirror backend)
```

---

## Rules

**Backend**:
- Layered: api → modules → models
- Always async SQLAlchemy + `Depends(get_db)`
- All schema changes via Alembic migrations
- Protected routes: `Depends(get_current_user)`
- Naming: `snake_case` files/functions, `PascalCase` classes

**Frontend**:
- File-based routing in `src/routes/`
- Use `@repo/core` API client (not fetch/axios)
- TanStack Query for data fetching
- Naming: `camelCase` files, `PascalCase` components

**Shared**:
- Types must mirror backend Pydantic schemas exactly

---

## Adding Features

**Backend**: model → migration → serializer → service → router → register in main.py  
**Frontend**: Create file in `routes/` → use `createFileRoute`  
**Shared**: Add types → create API class → attach to main Api

---

## Workflow

```bash
# Dev
moon run api:dev         # http://localhost:8000
moon run platform:dev    # http://localhost:3000

# Migrations
cd apps/api && uv run alembic revision --autogenerate -m "msg"
uv run alembic upgrade head

# Quality
pnpm run format && moon run api:check
```

---

## Don't

1. Edit `routeTree.gen.ts`, `.venv/`, `node_modules/`
2. Modify DB schema without migration
3. Use sync DB operations
4. Use fetch/axios (use `@repo/core`)
5. Skip `pnpm run format` before commit
