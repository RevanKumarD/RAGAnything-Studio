"""API v1 router."""

from fastapi import APIRouter

from app.api.v1.endpoints import documents, query, graph, vectors, system

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(system.router, prefix="/system", tags=["System"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(query.router, prefix="/query", tags=["Query"])
api_router.include_router(graph.router, prefix="/graph", tags=["Knowledge Graph"])
api_router.include_router(vectors.router, prefix="/vectors", tags=["Vector Space"])
