"""WebSocket connection manager for real-time updates."""

from typing import Dict, Set
from fastapi import WebSocket
import json
import asyncio


class ConnectionManager:
    """Manage WebSocket connections."""

    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, client_id: str = "default"):
        """Accept and store WebSocket connection."""
        await websocket.accept()
        if client_id not in self.active_connections:
            self.active_connections[client_id] = set()
        self.active_connections[client_id].add(websocket)

    def disconnect(self, websocket: WebSocket, client_id: str = "default"):
        """Remove WebSocket connection."""
        if client_id in self.active_connections:
            self.active_connections[client_id].discard(websocket)
            if not self.active_connections[client_id]:
                del self.active_connections[client_id]

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send message to specific connection."""
        await websocket.send_json(message)

    async def broadcast(self, message: dict, client_id: str = "default"):
        """Broadcast message to all connections for client."""
        if client_id in self.active_connections:
            for connection in self.active_connections[client_id]:
                try:
                    await connection.send_json(message)
                except:
                    pass  # Connection closed

    async def send_parsing_progress(
        self,
        client_id: str,
        filename: str,
        progress: int,
        status: str,
        message: str = "",
    ):
        """Send parsing progress update."""
        await self.broadcast(
            {
                "type": "parsing_progress",
                "data": {
                    "filename": filename,
                    "progress": progress,
                    "status": status,
                    "message": message,
                },
            },
            client_id,
        )


# Global connection manager
manager = ConnectionManager()
