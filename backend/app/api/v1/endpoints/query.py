"""Query endpoints for RAG operations."""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

router = APIRouter()


class QueryRequest(BaseModel):
    """Query request model."""
    query: str
    mode: str = "hybrid"  # naive, local, global, hybrid
    vlm_enhanced: bool = False
    top_k: Optional[int] = None


class MultimodalQueryRequest(BaseModel):
    """Multimodal query request with additional content."""
    query: str
    mode: str = "hybrid"
    multimodal_content: List[Dict[str, Any]] = []


@router.post("/")
async def execute_query(request: QueryRequest):
    """
    Execute a text query against the knowledge base.

    Supports modes: naive, local, global, hybrid
    """
    from app.services.rag_service import rag_service

    try:
        # Execute query using RAG service
        result = await rag_service.query(
            query=request.query,
            mode=request.mode,
            vlm_enhanced=request.vlm_enhanced,
            top_k=request.top_k,
        )

        if result.get("success"):
            return JSONResponse(
                status_code=200,
                content={
                    "query": request.query,
                    "mode": request.mode,
                    "answer": result.get("answer", ""),
                    "sources": [],  # TODO: Extract sources from result
                    "metadata": {
                        "vlm_enhanced": request.vlm_enhanced,
                    },
                },
            )
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Query failed"))

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query execution failed: {str(e)}")


@router.post("/multimodal")
async def execute_multimodal_query(request: MultimodalQueryRequest):
    """
    Execute a multimodal query with additional context (images, tables, equations).
    """
    from app.services.rag_service import rag_service

    try:
        # Execute multimodal query using RAG service
        result = await rag_service.query_with_multimodal(
            query=request.query,
            multimodal_content=request.multimodal_content,
            mode=request.mode,
        )

        if result.get("success"):
            return JSONResponse(
                status_code=200,
                content={
                    "query": request.query,
                    "mode": request.mode,
                    "answer": result.get("answer", ""),
                    "multimodal_content_count": len(request.multimodal_content),
                    "sources": [],  # TODO: Extract sources
                },
            )
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Multimodal query failed"))

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multimodal query failed: {str(e)}")


@router.get("/history")
async def get_query_history(limit: int = 50, offset: int = 0):
    """
    Get query history.
    """
    # TODO: Implement query history retrieval from database

    return JSONResponse(
        content={
            "queries": [],
            "total": 0,
            "limit": limit,
            "offset": offset,
        },
    )


@router.post("/feedback")
async def submit_query_feedback(
    query_id: str,
    feedback: str,  # "positive" or "negative"
    comment: Optional[str] = None,
):
    """
    Submit feedback for a query response.
    """
    # TODO: Store feedback in database

    return JSONResponse(
        content={
            "message": "Feedback recorded successfully",
            "query_id": query_id,
            "feedback": feedback,
        },
    )
