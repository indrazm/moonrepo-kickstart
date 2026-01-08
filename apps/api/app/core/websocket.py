from typing import Dict
from fastapi import WebSocket
from redis.asyncio import Redis
from app.core.settings import settings


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.redis: Redis | None = None

    async def initialize(self):
        """Initialize Redis connection"""
        self.redis = Redis.from_url(settings.redis_url, decode_responses=True)

    async def connect(self, client_id: str, websocket: WebSocket):
        """Accept and store WebSocket connection"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
        # Persist connection in Redis
        if self.redis:
            # type: ignore[awaitable-is-not-function]
            await self.redis.sadd("ws:active_connections", client_id)  # type: ignore[misc]

    async def disconnect(self, client_id: str):
        """Remove WebSocket connection"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        # Remove from Redis
        if self.redis:
            await self.redis.srem("ws:active_connections", client_id)  # type: ignore[misc]

    async def send_message(self, message: str, client_id: str):
        """Send message to specific client"""
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(message)

    async def broadcast(self, message: str):
        """Broadcast message to all connected clients"""
        for connection in self.active_connections.values():
            await connection.send_text(message)

    async def get_active_connections(self):
        """Get list of active connections from Redis"""
        if self.redis:
            return await self.redis.smembers("ws:active_connections")  # type: ignore[misc]
        return set()

    async def cleanup(self):
        """Cleanup Redis connection"""
        if self.redis:
            await self.redis.close()


manager = ConnectionManager()
