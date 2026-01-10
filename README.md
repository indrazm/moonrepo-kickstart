# Moonrepo Kickstart

A modern, production-ready full-stack monorepo template powered by [moonrepo](https://moonrepo.dev), featuring **FastAPI** backend, **React 19** frontend with **TanStack** ecosystem, type-safe API communication, and built-in **RBAC**.

## Features

- **Monorepo Architecture** - Organized with moonrepo for efficient task orchestration
- **Type-Safe API Client** - Shared TypeScript package (`@repo/core`) for frontend-backend communication
- **Modern Frontend** - React 19 with TanStack Router, Query, and Tailwind CSS 4
- **Async Python Backend** - FastAPI with SQLModel, PostgreSQL, JWT + OAuth authentication
- **Role-Based Access Control** - Built-in RBAC with USER, MODERATOR, and ADMIN roles
- **OAuth Integration** - Google and GitHub OAuth with automatic user linking
- **Real-time Communication** - WebSocket support with Redis-backed connection management
- **Background Jobs** - Celery integration for asynchronous task processing
- **Database Migrations** - Alembic for version-controlled schema changes
- **Developer Experience** - Hot reload, DevTools, type checking, Biome formatting

## Tech Stack

### Frontend (`apps/platform`)
- React 19, TanStack Router & Query, Vite, Tailwind CSS 4, TypeScript

### Backend (`apps/api`)
- FastAPI, SQLModel, PostgreSQL, Alembic, JWT + OAuth, Celery, Redis

### Shared (`packages/core`)
- TypeScript API client with auto token refresh

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

## AI Development

This project includes **AGENTS.md** - a comprehensive system prompt for LLM agents. It contains:
- Stack overview and architecture patterns
- Core rules for backend/frontend development
- Feature addition guidelines
- Critical dos and don'ts

Use this file when working with AI coding assistants (like Claude, GitHub Copilot, etc.) for faster, more accurate development.

## License

MIT
