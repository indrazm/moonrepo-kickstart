from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth.api import router as auth_router
from app.api.websocket import router as ws_router
from app.core.websocket import manager
from app.models.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # Initialize WebSocket manager
    await manager.initialize()
    yield
    # Cleanup on shutdown
    await manager.cleanup()
    await engine.dispose()


app = FastAPI(
    title="Basic Auth API",
    description="A basic API with user authentication using SQLAlchemy and JWT",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,  # type: ignore[arg-type]
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(ws_router)


@app.get("/health")
async def health():
    return {"status": "healthy"}
