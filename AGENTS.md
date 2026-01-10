# AGENTS.md

System prompt for LLM agents helping with this moonrepo-kickstart codebase.

---

## Stack

**Backend**: FastAPI, SQLModel, PostgreSQL, Redis, Celery  
**Frontend**: React 19, TanStack Router/Query, Tailwind CSS 4, Jotai  
**Shared**: Type-safe API client (`@repo/core`)

**Key Features**: JWT + OAuth, WebSocket, Background tasks, Type-safe communication

---

## Structure

```
apps/api/app/
├── api/{feature}/api.py          # Routes
├── api/{feature}/serializer.py   # Pydantic schemas (DTOs)
├── modules/{feature}/service.py  # Business logic
├── models/{model}.py             # SQLModel (table=True)
└── core/                         # settings, security, celery, websocket

apps/platform/src/
├── modules/{feature}/            # components/ + hooks/ + atoms/
├── routes/{route}.tsx            # File-based routing
└── lib/api.ts                    # Singleton API from @repo/core

packages/core/src/
├── client.ts                     # ApiClient (ky + auto token refresh)
├── api/{feature}.ts              # API methods
└── types/{feature}.ts            # Types mirror backend exactly
```

---

## Core Rules

### Backend
- **3-layer architecture**: `api` (routes) → `modules` (services) → `models` (DB)
- **Always async**: `AsyncSession`, `await db.exec()`, `Depends(get_db)`
- **Models**: `SQLModel(table=True)` with `Field()` for columns
- **Migrations**: Required for ALL schema changes: `alembic revision --autogenerate`
- **Auth**: Protected routes use `current_user: Annotated[User, Depends(get_current_user)]`
- **Naming**: `snake_case` files/functions, `PascalCase` classes
- **Import models in `alembic/env.py`**: Required for autogenerate to discover models

### Frontend
- **Module structure**: `modules/{feature}/` with `components/`, `hooks/`, `atoms/` (for Jotai)
- **Routing**: `export const Route = createFileRoute("/path")({ component })`
- **API calls**: ONLY use `api` from `@repo/core` (never fetch/axios)
- **Data fetching**: Wrap in TanStack Query (`useMutation`/`useQuery`)
- **State management**:
  - Server state → TanStack Query
  - Client state → Jotai atoms in `modules/{feature}/atoms/`
  - **Avoid prop drilling**: Use Jotai atoms for shared state across components
- **Auth**: Protected routes check `useMe()` hook in layout
- **Imports**: Use `@/` alias for local, `@repo/` for workspace packages

### Shared (`@repo/core`)
- **Types MUST match backend exactly**: Mirror Pydantic schemas field-by-field
- **API pattern**: `api.{feature}.{method}(data)` (e.g., `api.auth.login()`)
- **Token flow**: Auto-stored in localStorage, auto-refreshed on 401, auto-injected in headers

---

## Key Patterns

### Backend Auth Flow
1. `POST /auth/login` → returns access + refresh tokens
2. Protected routes verify Bearer token → inject `current_user`
3. OAuth: `/auth/{provider}` → callback → `get_or_create_oauth_user()` → redirect to frontend with tokens

### Frontend Auth Flow
1. `useLogin()` mutation → `api.auth.login()` → tokens auto-stored → navigate
2. OAuth: `api.auth.loginWithGoogle()` → redirects → `/auth/callback` extracts tokens → navigate
3. Protected routes: Layout checks `useMe()` → shows loading/login/content

### State Management (Jotai)
- Create atoms in `modules/{feature}/atoms/index.ts`
- Use `useAtom()`, `useAtomValue()`, `useSetAtom()` in components
- **Never prop drill state**: Lift shared state to atoms immediately

### Database Operations
```python
# Query
result = await db.exec(select(User).where(User.id == user_id))
user = result.one_or_none()

# Create
db.add(new_user)
await db.commit()
await db.refresh(new_user)
```

### API Client (Frontend)
```ts
// Always use singleton from lib/api.ts
import { api } from "@/lib/api"

// Mutation hook
const mutation = useMutation({
  mutationFn: (data) => api.feature.method(data)
})
```

---

## Adding Features

**Backend**: model → migration → serializer → service → router → register in `main.py`  
**Frontend**: route → module (components + hooks + atoms) → use in route  
**Shared**: types → API class → attach to main Api

---

## Commands

```bash
moon run api:dev          # :8000
moon run platform:dev     # :3000
moon run api:worker       # Celery

cd apps/api && uv run alembic revision --autogenerate -m "msg"
uv run alembic upgrade head

moon :lint                # Pre-commit hook
```

---

## Critical Don'ts

1. Never use `fetch`/`axios` (use `@repo/core` API)
2. Never use sync DB operations (only `AsyncSession`)
3. Never modify DB schema without Alembic migration
4. Never prop drill shared state (use Jotai atoms)
5. Never edit auto-generated files (`routeTree.gen.ts`, `.lock`)
6. Never store passwords without bcrypt hashing
7. Never skip `moon :lint` before committing
8. Never import models without adding to `alembic/env.py`
