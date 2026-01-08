from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.websocket import manager

router = APIRouter(prefix="/ws", tags=["websocket"])


@router.websocket("/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for client connections"""
    await manager.connect(client_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo message back to sender
            await manager.send_message(f"You sent: {data}", client_id)
            # Optionally broadcast to all
            # await manager.broadcast(f"Client {client_id}: {data}")
    except WebSocketDisconnect:
        await manager.disconnect(client_id)
