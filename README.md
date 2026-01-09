# Moonrepo Kickstart

A modern, production-ready full-stack monorepo template powered by [moonrepo](https://moonrepo.dev), featuring a **FastAPI** backend, **React 19** frontend with **TanStack** ecosystem, and type-safe API communication.

## Features

- **Monorepo Architecture** - Organized with moonrepo for efficient task orchestration
- **Type-Safe API Client** - Shared TypeScript package (`@repo/core`) for frontend-backend communication
- **Modern Frontend** - React 19 with TanStack Router (file-based routing), Query, and Tailwind CSS 4
- **Async Python Backend** - FastAPI with SQLModel, PostgreSQL, JWT + OAuth authentication via Authlib
- **OAuth Integration** - Google and GitHub OAuth with automatic user linking and account creation
- **Real-time Communication** - WebSocket support with Redis-backed connection management for horizontal scaling
- **Background Jobs** - Celery integration for asynchronous task processing with Redis broker
- **Database Migrations** - Alembic for version-controlled schema changes with auto-generation
- **Developer Experience** - Hot reload, DevTools, type checking, Biome formatting, and Husky pre-commit hooks
- **Testing Ready** - Vitest for frontend and shared library, Testing Library for React components

## Tech Stack

### Frontend (`apps/platform`)
- **React 19.2.0** - Latest React with concurrent features
- **TanStack Router 1.132** - Type-safe file-based routing with auto code-splitting
- **TanStack Query 5.66** - Server state management with caching
- **Vite 5.0** - Lightning-fast build tool with HMR
- **Tailwind CSS 4.0** - Utility-first styling with new CSS engine
- **TypeScript 5.7** - Full type safety
- **Vitest** - Fast unit testing framework
- **Testing Library 16.2** - React component testing

### Backend (`apps/api`)
- **FastAPI 0.128+** - Modern async Python framework with OpenAPI
- **SQLModel** - Combined SQLAlchemy + Pydantic for database models
- **PostgreSQL 14+** - Primary database with asyncpg driver
- **Alembic 1.17+** - Database migrations with auto-generation
- **JWT Authentication** - Access (30min) + refresh (7 days) tokens
- **OAuth** - Google and GitHub authentication with user linking via Authlib
- **Celery 5.6+** - Background task queue with Redis broker
- **Redis 7.1+** - Caching, message broker, WebSocket state
- **Uvicorn 0.40+** - ASGI server with hot reload
- **UV** - 10-100x faster Python package manager
- **bcrypt** - Secure password hashing
- **httpx 0.28+** - Async HTTP client for OAuth

### Shared (`packages/core`)
- **Ky 1.7** - Modern fetch wrapper with retry logic
- **TypeScript** - Shared types mirroring backend Pydantic schemas
- **tRPC-like API** - `api.auth.login()` pattern for type-safe calls

### Build Tools
- **Moonrepo** - Monorepo task orchestration with caching
- **PNPM 10.27** - Fast Node package manager with workspace support
- **UV** - Fast Python package installer and resolver
- **Biome** - All-in-one formatter and linter (replaces ESLint + Prettier)
- **Husky** - Git hooks for pre-commit quality checks

## Project Structure

```
moonrepo-kickstart/
├── apps/
│   ├── api/                  # FastAPI backend
│   │   ├── alembic/          # Database migrations
│   │   │   └── versions/     # Migration files (auto-generated)
│   │   ├── app/
│   │   │   ├── api/          # API layer (routes + serializers)
│   │   │   │   ├── auth/
│   │   │   │   │   ├── api.py         # Auth endpoints (login, register, OAuth)
│   │   │   │   │   └── serializer.py  # Pydantic request/response models
│   │   │   │   └── websocket.py       # WebSocket endpoint
│   │   │   ├── core/         # Core utilities
│   │   │   │   ├── security.py        # JWT + bcrypt utilities
│   │   │   │   ├── settings.py        # Pydantic settings with .env
│   │   │   │   ├── celery.py          # Celery configuration
│   │   │   │   ├── websocket.py       # WebSocket manager with Redis
│   │   │   │   └── exceptions.py      # Custom HTTP exceptions
│   │   │   ├── models/       # Data layer
│   │   │   │   ├── database.py        # Async SQLAlchemy setup
│   │   │   │   └── user.py            # User model with OAuth fields
│   │   │   ├── modules/      # Business logic layer
│   │   │   │   └── auth/
│   │   │   │       ├── service.py     # Auth business logic
│   │   │   │       └── oauth_service.py # Google/GitHub OAuth logic
│   │   │   ├── tasks/        # Celery background tasks
│   │   │   │   └── example.py         # Example task (send_email)
│   │   │   └── main.py       # FastAPI app (lifespan, CORS, routers)
│   │   ├── moon.yml          # Moon task configuration
│   │   ├── pyproject.toml    # Python dependencies (uv)
│   │   ├── alembic.ini       # Alembic configuration
│   │   └── uv.lock           # Locked dependencies
│   │
│   └── platform/             # React frontend
│       ├── public/           # Static assets
│       ├── src/
│       │   ├── modules/      # Feature modules (component + hook pattern)
│       │   │   └── auth/
│       │   │       ├── components/
│       │   │       │   ├── LoginForm.tsx      # Login UI with OAuth buttons
│       │   │       │   └── RegisterForm.tsx   # Registration UI
│       │   │       └── hooks/
│       │   │           ├── useLogin.ts        # Login mutation hook
│       │   │           ├── useRegister.ts     # Register mutation hook
│       │   │           └── useMe.ts           # Current user query hook
│       │   ├── routes/       # File-based routing (TanStack Router)
│       │   │   ├── __root.tsx         # Root layout
│       │   │   ├── index.tsx          # Landing page
│       │   │   ├── login.tsx          # Login page
│       │   │   ├── register.tsx       # Register page
│       │   │   ├── auth/
│       │   │   │   └── callback.tsx   # OAuth callback handler
│       │   │   └── dashboard/
│       │   │       └── index.tsx      # Protected dashboard
│       │   ├── integrations/ # Third-party setup
│       │   │   └── tanstack-query/
│       │   │       └── root-provider.tsx # QueryClient provider
│       │   ├── lib/
│       │   │   └── api.ts             # Singleton API instance
│       │   ├── main.tsx      # App entry with router
│       │   ├── routeTree.gen.ts # Auto-generated (DO NOT EDIT)
│       │   └── styles.css    # Tailwind imports
│       ├── moon.yml
│       ├── package.json
│       └── vite.config.ts    # Vite config with TanStack Router plugin
│
├── packages/
│   ├── core/                 # Shared API client
│   │   ├── src/
│   │   │   ├── client.ts     # ApiClient class (ky + token management)
│   │   │   ├── api/
│   │   │   │   ├── index.ts  # Main Api class (tRPC-like)
│   │   │   │   └── auth.ts   # AuthApi methods (login, register, OAuth)
│   │   │   ├── types/
│   │   │   │   ├── index.ts  # Type exports
│   │   │   │   └── auth.ts   # Auth types (mirror backend)
│   │   │   └── index.ts      # Package exports
│   │   ├── moon.yml
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ui/                   # Shared UI components (shadcn-style)
│       ├── src/
│       │   ├── components/ui/ # Reusable components (button, input, etc.)
│       │   ├── lib/utils.ts   # Utility functions
│       │   └── styles.css     # Component styles
│       └── package.json
│
├── .husky/
│   └── pre-commit            # Git hooks (moon :check, pnpm lint)
├── .moon/
│   ├── workspace.yml         # Workspace configuration
│   └── toolchain.yml         # Python + Node toolchain setup
├── biome.json                # Code formatter + linter config
├── package.json              # Root dependencies + scripts
├── pnpm-workspace.yaml       # PNPM workspace config
├── pnpm-lock.yaml
├── .env.example              # Environment variable template
├── AGENTS.md                 # LLM agent instructions
└── README.md                 # This file
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
moon run platform:dev      # Start Vite dev server (http://localhost:3000)
moon run platform:build    # Build for production (output: dist/)
moon run platform:test     # Run tests with Vitest
```

### Backend (API)

```bash
moon run api:dev           # Start FastAPI with hot reload (http://localhost:8000)
moon run api:check         # Type checking with ty
moon run api:worker        # Start Celery worker for background tasks
```

### Shared Libraries

```bash
moon run core:test         # Test shared API client (@repo/core)
```

### Code Quality

```bash
pnpm run format            # Format all code with Biome (frontend + shared)
pnpm run lint              # Lint code with Biome
pnpm run lint:fix          # Auto-fix linting issues
moon :check                # Check all affected projects (used in pre-commit hook)
```

### Database Migrations

```bash
cd apps/api
uv run alembic revision --autogenerate -m "description"  # Create new migration
uv run alembic upgrade head                              # Apply all pending migrations
uv run alembic downgrade -1                              # Rollback one migration
uv run alembic history                                   # View migration history
uv run alembic current                                   # Show current revision
```

## API Endpoints

### Authentication

**Traditional Auth:**
- `POST /auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }
  ```
  Response: `UserResponse` with user details

- `POST /auth/login` - Login with username/password (OAuth2PasswordRequestForm)
  ```json
  {
    "username": "username",
    "password": "password123"
  }
  ```
  Response: `Token` with `access_token` and `refresh_token`

- `GET /auth/me` - Get current user (requires `Authorization: Bearer <token>`)
  
  Response: `UserResponse` with user details including OAuth fields

- `POST /auth/refresh` - Refresh access token
  ```json
  {
    "refresh_token": "your-refresh-token"
  }
  ```
  Response: New `access_token`

**OAuth:**
- `GET /auth/google` - Initiate Google OAuth flow
  
  Response: `{ "auth_url": "https://accounts.google.com/..." }`

- `GET /auth/google/callback?code=...` - Google OAuth callback (internal, redirects to frontend)
  
  Redirects to: `http://localhost:3000/auth/callback?access_token=...&refresh_token=...`

- `GET /auth/github` - Initiate GitHub OAuth flow
  
  Response: `{ "auth_url": "https://github.com/login/oauth/..." }`

- `GET /auth/github/callback?code=...` - GitHub OAuth callback (internal, redirects to frontend)

### WebSocket

- `WS /ws/{client_id}` - WebSocket connection for real-time communication
  
  Current implementation: Echo server (sends back received messages)
  
  Connection state stored in Redis for multi-instance support

### Health

- `GET /` - Root endpoint
  
  Response: `{ "message": "Welcome to the API" }`

- `GET /health` - Health check endpoint
  
  Response: `{ "status": "ok" }`

**Interactive Docs:**
- `GET /docs` - Swagger UI with interactive API documentation
- `GET /redoc` - ReDoc alternative documentation

## Using the API Client

The `@repo/core` package provides a type-safe API client with automatic token management:

### Basic Usage

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

// Login with username/password
const token = await api.auth.login({
  username: 'username',
  password: 'password123'
})

// Set tokens for authenticated requests (stored in localStorage)
api.setTokens(token.access_token, token.refresh_token)

// Get current user (requires authentication)
const currentUser = await api.auth.me()

// Refresh access token
const newToken = await api.auth.refresh({
  refresh_token: token.refresh_token
})

// Logout (clears tokens from localStorage)
api.auth.logout()
```

### OAuth Authentication

```typescript
// Initiate Google OAuth (redirects to Google)
await api.auth.loginWithGoogle()
// User authorizes, redirects to frontend callback

// Initiate GitHub OAuth (redirects to GitHub)
await api.auth.loginWithGithub()

// In callback route (apps/platform/src/routes/auth/callback.tsx):
const params = new URLSearchParams(window.location.search)
const accessToken = params.get("access_token")
const refreshToken = params.get("refresh_token")
if (accessToken && refreshToken) {
  api.setTokens(accessToken, refreshToken)
  // Navigate to home/dashboard
}
```

### Using with React Hooks

```typescript
// In modules/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      return await api.auth.login(data)
    },
    onSuccess: (token) => {
      api.setTokens(token.access_token, token.refresh_token)
      // Navigate to dashboard
    }
  })
}

// In component
const { mutate: login, isPending } = useLogin()
login({ username: 'user', password: 'pass' })
```

### Singleton Pattern (Recommended)

Frontend uses a singleton API instance (`apps/platform/src/lib/api.ts`):

```typescript
// lib/api.ts
import { createApi } from '@repo/core'

export const api = createApi({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000'
})

// Import throughout app
import { api } from '@/lib/api'
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

Create a `.env` file in the root directory (see `.env.example`):

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

# OAuth (Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# OAuth (GitHub)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:3000

# App
APP_NAME=Moonrepo Kickstart
DEBUG=True
```

**Getting OAuth Credentials:**

**Google:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Set authorized redirect URI: `http://localhost:8000/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

**GitHub:**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:8000/auth/github/callback`
4. Copy Client ID and Client Secret to `.env`

## Architecture Decisions

### Monorepo with Moonrepo
- **Why**: Efficient task orchestration, caching, and dependency management across multiple projects
- **Benefits**: Run only affected tasks, parallel execution, consistent tooling, incremental builds
- **Alternative**: Nx, Turborepo (Moonrepo chosen for simplicity and speed)

### FastAPI + SQLModel
- **Why**: Modern Python async framework with SQLModel combining SQLAlchemy ORM and Pydantic validation
- **Benefits**: High performance (async I/O), single model definition for both database and validation, type hints, auto-generated OpenAPI docs
- **Pattern**: Layered architecture (API → Modules → Models) for clean separation of concerns

### TanStack Ecosystem
- **Why**: Best-in-class routing and data fetching for React
- **Benefits**: Type-safe routing, automatic code splitting, optimized data fetching with caching, devtools
- **Router**: File-based routing for intuitive project structure
- **Query**: Declarative data fetching with automatic background refetching

### Shared Type-Safe API Client (`@repo/core`)
- **Why**: Eliminate API integration bugs and duplication
- **Benefits**: Single source of truth for types, IDE autocomplete, compile-time safety, tRPC-like DX
- **Implementation**: Ky for HTTP, localStorage for tokens, mirrors backend Pydantic schemas

### Module-Based Frontend
- **Why**: Scalable feature organization as app grows
- **Pattern**: `modules/{feature}/` with `components/` + `hooks/` co-located
- **Benefits**: Clear feature boundaries, easier to find related code, promotes reusability

### OAuth with User Linking
- **Why**: Reduce friction for user onboarding, industry-standard authentication
- **Implementation**: Search by provider ID → email → create new user with username conflict resolution
- **Benefits**: Seamless user experience, supports multiple auth methods per user

### UV for Python Dependencies
- **Why**: 10-100x faster than pip/poetry, Rust-based
- **Benefits**: Quick installs, reliable resolution, pip-compatible, lockfile support
- **Trade-off**: Newer tool, but backed by Astral (creators of Ruff)

### Biome for Code Quality
- **Why**: Fast, all-in-one formatter and linter, replaces ESLint + Prettier
- **Benefits**: Single config file, instant feedback, no plugin ecosystem complexity
- **Trade-off**: Less mature than ESLint, but rapidly improving

### Redis for Multiple Concerns
- **Why**: Single, proven technology for caching, message broker, WebSocket state
- **Benefits**: Simple deployment, fast in-memory operations, supports horizontal scaling
- **Use cases**: Celery broker/backend, WebSocket connection registry, future caching

### JWT in Database
- **Why**: Allows token revocation and single-device logout
- **Implementation**: Refresh tokens stored in `User.refresh_token` field
- **Trade-off**: Database lookup on refresh (acceptable for most use cases)
- **Alternative**: Stateless JWT (no revocation) or Redis (faster but more complexity)

## License

MIT
