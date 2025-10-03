"""WebSocket endpoint for real-time updates."""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.websocket import manager

router = APIRouter()


@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket connection for real-time updates."""
    await manager.connect(websocket, client_id)
    try:
        while True:
            # Keep connection alive and receive messages
            data = await websocket.receive_text()
            # Echo back for testing
            await manager.send_personal_message(
                {"type": "echo", "data": data}, websocket
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)
