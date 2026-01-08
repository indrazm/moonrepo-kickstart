# Moonrepo Kickstart

A modern, production-ready full-stack monorepo template powered by [moonrepo](https://moonrepo.dev), featuring a **FastAPI** backend, **React 19** frontend with **TanStack** ecosystem, and type-safe API communication.

## Features

- **Monorepo Architecture** - Organized with moonrepo for efficient task orchestration
- **Type-Safe API Client** - Shared TypeScript package for frontend-backend communication
- **Modern Frontend** - React 19 with TanStack Router, Query, and Tailwind CSS 4
- **Async Python Backend** - FastAPI with SQLAlchemy, PostgreSQL, and JWT authentication
- **Real-time Communication** - WebSocket support with Redis-backed connection management
- **Background Jobs** - Celery integration for asynchronous task processing
- **Database Migrations** - Alembic for version-controlled schema changes
- **Developer Experience** - Hot reload, DevTools, type checking, and formatted code
- **Testing Ready** - Vitest for frontend, Testing Library for React components

## Tech Stack

### Frontend (`apps/platform`)
- **React 19.2.0** - Latest React with concurrent features
- **TanStack Router** - Type-safe file-based routing
- **TanStack Query** - Server state management
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **TypeScript 5.7** - Type safety
- **Vitest** - Fast unit testing

### Backend (`apps/api`)
- **FastAPI 0.128.0** - Modern async Python framework
- **SQLAlchemy 2.0** - Async ORM
- **PostgreSQL** - Primary database
- **Alembic** - Database migrations
- **JWT Authentication** - Access & refresh tokens
- **Celery 5.4.0** - Background task queue
- **Redis 5.2.1** - Caching & message broker
- **Uvicorn** - ASGI server
- **UV** - Fast Python package manager

### Shared (`packages/core`)
- **Ky** - Modern HTTP client
- **TypeScript** - Shared types between frontend/backend

### Build Tools
- **Moonrepo** - Monorepo task runner
- **PNPM** - Fast Node package manager
- **UV** - Fast Python package installer
- **Biome** - Code formatter & linter

## Project Structure

```
moonrepo-kickstart/
├── apps/
│   ├── api/                  # FastAPI backend
│   │   ├── alembic/          # Database migrations
│   │   ├── app/
│   │   │   ├── api/          # API endpoints (auth, websocket)
│   │   │   ├── core/         # Core utilities (security, settings, celery)
│   │   │   ├── models/       # SQLAlchemy models
│   │   │   ├── modules/      # Business logic (auth service)
│   │   │   ├── tasks/        # Celery background tasks
│   │   │   └── main.py       # FastAPI application
│   │   ├── moon.yml
│   │   ├── pyproject.toml
│   │   └── uv.lock
│   │
│   └── platform/             # React frontend
│       ├── public/           # Static assets
│       ├── src/
│       │   ├── integrations/ # TanStack Query setup
│       │   ├── routes/       # File-based routing
│       │   ├── main.tsx      # App entry point
│       │   └── styles.css
│       ├── moon.yml
│       ├── package.json
│       └── vite.config.ts
│
├── packages/
│   └── core/                 # Shared API client
│       ├── src/
│       │   ├── api/          # API methods (auth)
│       │   ├── types/        # TypeScript types
│       │   └── client.ts     # API client wrapper
│       ├── moon.yml
│       └── package.json
│
├── .moon/
│   ├── workspace.yml         # Workspace configuration
│   └── toolchain.yml         # Toolchain setup
├── biome.json                # Code formatter config
├── package.json              # Root dependencies
├── pnpm-lock.yaml
└── .env.example              # Environment template
```

## Prerequisites

- **Node.js** 18+ (for PNPM and Vite)
- **Python** 3.14+
- **PostgreSQL** 14+
- **Redis** 6+
- **PNPM** 8+ (install: `npm install -g pnpm`)
- **UV** (install: `curl -LsSf https://astral.sh/uv/install.sh | sh`)
- **Moonrepo** (install: `npm install -g @moonrepo/cli`)

## Getting Started

### 1. Install Dependencies

```bash
# Install Node dependencies
pnpm install

# Install Python dependencies
cd apps/api
uv sync
cd ../..
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration:
# - DATABASE_URL=postgresql+asyncpg://user:pass@localhost/dbname
# - SECRET_KEY=your-secret-key-here
# - REDIS_URL=redis://localhost:6379/0
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb moonrepo_dev

# Run migrations
cd apps/api
uv run alembic upgrade head
cd ../..
```

### 4. Start Development Servers

```bash
# Terminal 1: Start backend (http://localhost:8000)
moon run api:dev

# Terminal 2: Start frontend (http://localhost:3000)
moon run platform:dev

# Terminal 3 (optional): Start Celery worker for background tasks
moon run api:worker
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **API Redoc**: http://localhost:8000/redoc

## Available Tasks

### Frontend (Platform)

```bash
moon run platform:dev      # Start development server
moon run platform:build    # Build for production
moon run platform:test     # Run tests
```

### Backend (API)

```bash
moon run api:dev           # Start development server
moon run api:check         # Type checking
```

### Shared Library (Core)

```bash
moon run core:test         # Run tests
```

### Code Quality

```bash
pnpm run format            # Format code with Biome
pnpm run lint              # Lint code
pnpm run lint:fix          # Fix linting issues
pnpm run check             # Type check all projects
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }
  ```

- `POST /auth/login` - Login with username/password
  ```json
  {
    "username": "username",
    "password": "password123"
  }
  ```

- `GET /auth/me` - Get current user (requires authentication)

- `POST /auth/refresh` - Refresh access token
  ```json
  {
    "refresh_token": "your-refresh-token"
  }
  ```

### WebSocket

- `WS /ws/{client_id}` - WebSocket connection for real-time communication

### Health

- `GET /` - Root endpoint
- `GET /health` - Health check

## Using the API Client

The `@repo/core` package provides a type-safe API client:

```typescript
import { createApi } from '@repo/core'

// Create API client
const api = createApi({ baseUrl: 'http://localhost:8000' })

// Register user
const user = await api.auth.register({
  email: 'user@example.com',
  username: 'username',
  password: 'password123'
})

// Login
const token = await api.auth.login({
  username: 'username',
  password: 'password123'
})

// Set tokens for authenticated requests
api.getClient().setTokens(token.access_token, token.refresh_token)

// Get current user
const currentUser = await api.auth.me()

// Refresh token
const newToken = await api.auth.refresh({
  refresh_token: token.refresh_token
})

// Logout (clears tokens)
api.auth.logout()
```

## Database Migrations

```bash
cd apps/api

# Create new migration
uv run alembic revision --autogenerate -m "description of changes"

# Apply migrations
uv run alembic upgrade head

# Rollback migration
uv run alembic downgrade -1

# View migration history
uv run alembic history
```

## Background Tasks (Celery)

Example background task in `apps/api/app/tasks/example.py`:

```python
from app.core.celery import celery_app

@celery_app.task
def send_email(to: str, subject: str, body: str):
    # Send email logic here
    print(f"Sending email to {to}: {subject}")
    return {"status": "sent", "to": to}
```

Use in API endpoints:

```python
from app.tasks.example import send_email

# Trigger async task
send_email.delay("user@example.com", "Welcome", "Thanks for signing up!")
```

## WebSocket Usage

Connect to WebSocket for real-time features:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/client-123')

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Received:', data)
}

ws.send(JSON.stringify({ type: 'ping', data: 'hello' }))
```

## Testing

```bash
# Frontend tests
cd apps/platform
pnpm test

# Shared library tests
cd packages/core
pnpm test

# Backend type checking
cd apps/api
uv run ty check
```

## Production Build

```bash
# Build frontend
moon run platform:build
# Output: apps/platform/dist/

# Run backend in production
cd apps/api
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000

# Run Celery workers
uv run celery -A app.core.celery worker --loglevel=info
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost/dbname

# Security
SECRET_KEY=your-secret-key-here-generate-with-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Redis
REDIS_URL=redis://localhost:6379/0

# Celery
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

# CORS
CORS_ORIGINS=["http://localhost:3000"]

# App
APP_NAME=Moonrepo Kickstart
DEBUG=True
```

## Architecture Decisions

### Monorepo with Moonrepo
- **Why**: Efficient task orchestration, caching, and dependency management across multiple projects
- **Benefits**: Run only affected tasks, parallel execution, consistent tooling

### FastAPI + SQLAlchemy Async
- **Why**: Modern Python async framework with automatic API documentation
- **Benefits**: High performance, type hints, async database operations

### TanStack Ecosystem
- **Why**: Best-in-class routing and data fetching for React
- **Benefits**: Type-safe routing, automatic code splitting, optimized data fetching

### Shared Type-Safe API Client
- **Why**: Eliminate API integration bugs and duplication
- **Benefits**: Single source of truth for types, autocomplete, compile-time safety

### UV for Python Dependencies
- **Why**: 10-100x faster than pip/poetry
- **Benefits**: Quick installs, reliable resolution, pip-compatible

### Biome for Code Quality
- **Why**: Fast, all-in-one formatter and linter
- **Benefits**: No ESLint + Prettier configuration overhead, instant feedback

## License

MIT
