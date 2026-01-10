import asyncio
import logging
from typing import Dict
from fastapi import WebSocket
from redis.asyncio import Redis
from app.core.settings import settings

logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.redis: Redis | None = None
        self.pubsub_tasks: Dict[str, asyncio.Task] = {}

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
        """Remove WebSocket connection and cleanup Pub/Sub listener"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]

        # Cancel Pub/Sub listener task
        if client_id in self.pubsub_tasks:
            self.pubsub_tasks[client_id].cancel()
            del self.pubsub_tasks[client_id]

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

    async def start_pubsub_listener(self, client_id: str):
        """
        Listen for messages from Celery tasks via Redis Pub/Sub.
        This allows Celery workers to send messages to WebSocket clients.

        Channel format: ws:{client_id}
        """
        if not self.redis:
            logger.error("Redis not initialized, cannot start Pub/Sub listener")
            return

        # Create a separate Redis connection for Pub/Sub
        pubsub_redis = Redis.from_url(settings.redis_url, decode_responses=True)
        pubsub = pubsub_redis.pubsub()

        try:
            # Subscribe to client-specific channel
            await pubsub.subscribe(f"ws:{client_id}")
            logger.info(f"Started Pub/Sub listener for client: {client_id}")

            # Listen for messages
            async for message in pubsub.listen():
                if message["type"] == "message":
                    data = message["data"]
                    logger.info(f"Received Pub/Sub message for {client_id}: {data}")

                    # Forward message to WebSocket client
                    if client_id in self.active_connections:
                        await self.send_message(data, client_id)
                    else:
                        # Client disconnected, stop listening
                        logger.info(
                            f"Client {client_id} disconnected, stopping listener"
                        )
                        break
        except asyncio.CancelledError:
            logger.info(f"Pub/Sub listener cancelled for client: {client_id}")
        except Exception as e:
            logger.error(f"Error in Pub/Sub listener for {client_id}: {e}")
        finally:
            # Cleanup
            await pubsub.unsubscribe(f"ws:{client_id}")
            await pubsub.close()
            await pubsub_redis.close()
            logger.info(f"Pub/Sub listener cleaned up for client: {client_id}")

    async def cleanup(self):
        """Cleanup Redis connection and all Pub/Sub listeners"""
        # Cancel all Pub/Sub tasks
        for task in self.pubsub_tasks.values():
            task.cancel()

        # Wait for all tasks to complete
        if self.pubsub_tasks:
            await asyncio.gather(*self.pubsub_tasks.values(), return_exceptions=True)

        self.pubsub_tasks.clear()

        # Close main Redis connection
        if self.redis:
            await self.redis.close()


manager = ConnectionManager()
