"""System endpoints for health checks and status."""

from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Check RAG service health.
    """
    from app.services.rag_service import rag_service

    health_status = rag_service.health_check()

    return JSONResponse(
        status_code=200,
        content={
            "status": "healthy" if health_status.get("initialized") else "initializing",
            "rag_service": health_status,
        },
    )


@router.get("/status")
async def get_status():
    """
    Get system status and statistics.
    """
    from app.services.rag_service import rag_service

    try:
        health = rag_service.health_check()
        vector_stats = rag_service.get_vector_stats()

        return JSONResponse(
            content={
                "health": health,
                "vector_stats": vector_stats,
                "message": "System operational",
            },
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": str(e),
                "message": "Failed to get system status",
            },
        )
