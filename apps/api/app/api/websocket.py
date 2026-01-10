import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.websocket import manager
from app.tasks.example import process_background_task

router = APIRouter(prefix="/ws", tags=["websocket"])
logger = logging.getLogger(__name__)


@router.websocket("/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """
    WebSocket endpoint for client connections with Redis Pub/Sub integration.

    Flow:
    1. Client connects via WebSocket
    2. Server spawns a Redis Pub/Sub listener for this client
    3. Client sends messages that trigger background Celery tasks
    4. Celery tasks publish results to Redis channel
    5. Pub/Sub listener forwards results to WebSocket client
    """
    await manager.connect(client_id, websocket)

    # Start Redis Pub/Sub listener for this client
    pubsub_task = asyncio.create_task(manager.start_pubsub_listener(client_id))
    manager.pubsub_tasks[client_id] = pubsub_task

    logger.info(f"Client {client_id} connected, Pub/Sub listener started")

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            logger.info(f"Received from client {client_id}: {data}")

            try:
                # Parse JSON message
                message = json.loads(data)
                action = message.get("action")
                payload = message.get("payload", {})

                if action == "trigger_task":
                    # Trigger Celery background task
                    task_name = payload.get("task_name", "default")
                    task_data = payload.get("data", "")

                    # Send acknowledgment
                    await manager.send_message(
                        json.dumps(
                            {
                                "type": "task_triggered",
                                "task_name": task_name,
                                "status": "processing",
                            }
                        ),
                        client_id,
                    )

                    # Trigger async Celery task
                    process_background_task.delay(client_id, task_name, task_data)
                    logger.info(
                        f"Triggered background task '{task_name}' for client {client_id}"
                    )

                elif action == "echo":
                    # Simple echo for testing
                    await manager.send_message(
                        json.dumps(
                            {"type": "echo", "message": payload.get("message", "")}
                        ),
                        client_id,
                    )

                else:
                    # Unknown action
                    await manager.send_message(
                        json.dumps(
                            {"type": "error", "message": f"Unknown action: {action}"}
                        ),
                        client_id,
                    )

            except json.JSONDecodeError:
                # Handle non-JSON messages
                await manager.send_message(
                    json.dumps({"type": "error", "message": "Invalid JSON format"}),
                    client_id,
                )

    except WebSocketDisconnect:
        logger.info(f"Client {client_id} disconnected")
        await manager.disconnect(client_id)
