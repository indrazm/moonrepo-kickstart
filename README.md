# Moonrepo Kickstart

A modern, production-ready full-stack monorepo template powered by [moonrepo](https://moonrepo.dev), featuring **FastAPI** backend, **React 19** frontend with **TanStack** ecosystem, **Jotai** state management, type-safe API communication, and built-in **RBAC**.

## Features

- **Monorepo Architecture** - Organized with moonrepo for efficient task orchestration, dependency management, and caching
- **Type-Safe API Client** - Shared TypeScript package (`@repo/core`) with ky HTTP client and automatic token refresh
- **Modern Frontend Stack** - React 19 with TanStack Router (file-based), TanStack Query, Jotai state management, and Tailwind CSS 4
- **3-Layer Backend Architecture** - Clean separation: API routes → Service layer → Database models
- **Async Python Backend** - FastAPI with SQLModel + SQLAlchemy 2, async PostgreSQL, JWT + OAuth via Authlib
- **Role-Based Access Control** - Built-in RBAC with USER, MODERATOR, and ADMIN roles for permission management
- **OAuth Integration** - Google and GitHub OAuth with automatic user linking and secure token management
- **Real-time Communication** - WebSocket support with Redis-backed connection management for horizontal scaling
- **Background Jobs** - Celery integration for asynchronous task processing with Redis broker
- **Database Migrations** - Alembic for version-controlled schema changes with auto-generation from SQLModel
- **Developer Experience** - Hot reload, React + TanStack Query DevTools, type checking, Biome formatting, Husky hooks

## Tech Stack

### Frontend (`apps/platform`)
- React 19.2, TanStack Router 1.132 & Query 5.66, Jotai, Vite 5, Tailwind CSS 4, TypeScript 5.7

### Backend (`apps/api`)
- FastAPI 0.128, SQLModel + SQLAlchemy 2, PostgreSQL 14+, Alembic 1.17, JWT + OAuth (Authlib), Celery 5.6, Redis, Uvicorn 0.40

### Shared (`packages/core`)
- TypeScript API client with ky, automatic token refresh, and error handling

### Tools
- Moonrepo (task orchestration), PNPM (package manager), UV (Python package manager), Biome (linter/formatter), Husky (git hooks)

## Prerequisites

- **Node.js** 18+, **Python** 3.14+, **PostgreSQL** 14+, **Redis** 6+
- **PNPM** (install: `npm install -g pnpm`)
- **UV** (install: `curl -LsSf https://astral.sh/uv/install.sh | sh`)
- **Moonrepo** (install: `npm install -g @moonrepo/cli`)

## Getting Started

```bash
# 1. Install dependencies
pnpm install
cd apps/api && uv sync && cd ../..

# 2. Setup environment & database
cp .env.example .env
createdb moonrepo_dev
cd apps/api && uv run alembic upgrade head && cd ../..

# 3. Start development servers
moon run api:dev      # Terminal 1 (Backend at :8000)
moon run platform:dev  # Terminal 2 (Frontend at :3000)
```

Access the app at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Available Tasks

```bash
moon run api:dev        # Start backend with hot reload
moon run api:worker     # Start Celery worker
moon run platform:dev   # Start frontend dev server
moon run platform:build # Build frontend for production

moon :lint              # Format and lint all code

# Database migrations (run from apps/api)
uv run alembic revision --autogenerate -m "message"
uv run alembic upgrade head
```

## Project Structure

```
apps/
├── api/                      # FastAPI backend
│   ├── app/
│   │   ├── api/             # API routes (e.g., api/auth/api.py)
│   │   ├── core/            # settings, security, celery, websocket
│   │   ├── models/          # SQLModel database models
│   │   └── modules/         # Business logic services
│   └── alembic/             # Database migrations
├── platform/                 # React frontend
│   ├── src/
│   │   ├── modules/         # Feature modules (components + hooks + atoms)
│   │   ├── routes/          # File-based routing
│   │   └── lib/             # Utilities (API singleton)
packages/
├── core/                     # Shared TypeScript API client
│   ├── src/
│   │   ├── api/             # API methods by feature
│   │   ├── types/           # TypeScript types (mirror backend)
│   │   └── client.ts        # ApiClient with token management
└── ui/                       # Shared UI components (shadcn/ui based)
```

## Architecture Patterns

### Backend (3-Layer Architecture)
1. **API Layer** (`api/{feature}/api.py`) - FastAPI routes
2. **Service Layer** (`modules/{feature}/service.py`) - Business logic
3. **Model Layer** (`models/{model}.py`) - SQLModel database models

### Frontend (Module-Based)
- **Module structure**: `modules/{feature}/` contains `components/`, `hooks/`, and `atoms/` (Jotai)
- **State management**: Server state via TanStack Query, client state via Jotai atoms (no prop drilling)
- **Routing**: File-based with TanStack Router
- **API calls**: Always use singleton from `@repo/core`, never fetch/axios

### Shared (`@repo/core`)
- Types **must match** backend Pydantic schemas exactly
- API pattern: `api.{feature}.{method}(data)` (e.g., `api.auth.login()`)
- Auto token refresh on 401, auto-stored in localStorage

## AI Development

This project includes **AGENTS.md** - a comprehensive system prompt for LLM agents. It contains:
- Stack overview and architecture patterns
- Core rules for backend/frontend development  
- Feature addition guidelines (model → migration → service → route)
- Critical dos and don'ts (no fetch/axios, only async DB, always use Jotai for shared state)

Use this file when working with AI coding assistants (Claude, Cursor, GitHub Copilot) for faster, more accurate development.

## License

MIT
