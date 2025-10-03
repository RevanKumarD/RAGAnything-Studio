"""Knowledge graph endpoints."""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional, List

router = APIRouter()


@router.get("/data")
async def get_graph_data(
    content_type: Optional[str] = None,
    document_id: Optional[str] = None,
    limit: Optional[int] = 1000,
):
    """
    Get knowledge graph data for visualization.

    Returns nodes and edges in Cytoscape.js format.
    """
    from app.services.rag_service import rag_service

    try:
        # Get graph data from RAG service
        graph_data = rag_service.get_graph_data(limit=limit)

        if "error" in graph_data:
            return JSONResponse(
                status_code=500,
                content={"error": graph_data["error"]},
            )

        # Convert to Cytoscape.js format
        nodes_cytoscape = [
            {"data": node} for node in graph_data.get("nodes", [])
        ]
        edges_cytoscape = [
            {"data": edge} for edge in graph_data.get("edges", [])
        ]

        return JSONResponse(
            content={
                "nodes": nodes_cytoscape,
                "edges": edges_cytoscape,
                "metadata": {
                    "total_nodes": graph_data.get("node_count", 0),
                    "total_edges": graph_data.get("edge_count", 0),
                    "filtered": False,
                    "message": graph_data.get("message", ""),
                },
            },
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)},
        )


@router.get("/entity/{entity_id}")
async def get_entity_details(entity_id: str):
    """
    Get detailed information about a specific entity.
    """
    # TODO: Retrieve entity from knowledge graph

    return JSONResponse(
        content={
            "id": entity_id,
            "name": "Sample Entity",
            "type": "text",
            "description": "Detailed entity information",
            "metadata": {},
            "connections": [],
        },
    )


@router.get("/search")
async def search_entities(
    query: str,
    entity_type: Optional[str] = None,
    limit: int = 20,
):
    """
    Search for entities by name or description.
    """
    # TODO: Implement entity search

    return JSONResponse(
        content={
            "query": query,
            "results": [],
            "total": 0,
        },
    )


@router.get("/subgraph")
async def get_subgraph(
    center_node: str,
    depth: int = 1,
):
    """
    Get a subgraph centered on a specific node.
    """
    # TODO: Extract subgraph from knowledge graph

    return JSONResponse(
        content={
            "center_node": center_node,
            "depth": depth,
            "nodes": [],
            "edges": [],
        },
    )


@router.get("/stats")
async def get_graph_statistics():
    """
    Get knowledge graph statistics.
    """
    from app.services.rag_service import rag_service

    try:
        # Get graph data for statistics
        graph_data = rag_service.get_graph_data()

        if "error" in graph_data:
            return JSONResponse(
                status_code=500,
                content={"error": graph_data["error"]},
            )

        # Calculate basic statistics
        nodes = graph_data.get("nodes", [])
        edges = graph_data.get("edges", [])

        # Count node types
        node_types = {}
        for node in nodes:
            node_type = node.get("type", "unknown")
            node_types[node_type] = node_types.get(node_type, 0) + 1

        # Count edge types
        edge_types = {}
        for edge in edges:
            edge_label = edge.get("label", "unknown")
            edge_types[edge_label] = edge_types.get(edge_label, 0) + 1

        # Calculate average connections
        avg_connections = (len(edges) * 2 / len(nodes)) if nodes else 0

        # Calculate density
        max_edges = len(nodes) * (len(nodes) - 1) / 2 if len(nodes) > 1 else 1
        density = len(edges) / max_edges if max_edges > 0 else 0

        return JSONResponse(
            content={
                "total_nodes": len(nodes),
                "total_edges": len(edges),
                "node_types": node_types,
                "edge_types": edge_types,
                "avg_connections": round(avg_connections, 2),
                "density": round(density, 4),
            },
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)},
        )
