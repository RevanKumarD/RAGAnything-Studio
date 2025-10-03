"""RAG-Anything integration service."""

import sys
from pathlib import Path
from typing import Optional, Dict, Any, List
import asyncio

# Add parent directory to path to import raganything
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

from raganything import RAGAnything, RAGAnythingConfig
from lightrag import LightRAG
from lightrag.utils import EmbeddingFunc
from lightrag.llm.openai import openai_complete_if_cache, openai_embed

from app.core.config import settings


class RAGService:
    """
    Service class for RAG-Anything integration.

    Manages RAGAnything instance lifecycle and provides methods for:
    - Document parsing
    - Query execution
    - Knowledge graph access
    - Vector operations
    """

    _instance: Optional['RAGService'] = None
    _rag: Optional[RAGAnything] = None
    _initialized: bool = False

    def __new__(cls):
        """Singleton pattern to ensure one RAG instance."""
        if cls._instance is None:
            cls._instance = super(RAGService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        """Initialize RAG service (only once)."""
        if not self._initialized:
            self._initialize_rag()

    def _initialize_rag(self):
        """Initialize RAGAnything with configuration."""
        try:
            # Create RAGAnything configuration
            config = RAGAnythingConfig(
                working_dir=settings.WORKING_DIR,
                parser=settings.PARSER,
                parse_method=settings.PARSE_METHOD,
                parser_output_dir=settings.OUTPUT_DIR,
                enable_image_processing=settings.ENABLE_IMAGE_PROCESSING,
                enable_table_processing=settings.ENABLE_TABLE_PROCESSING,
                enable_equation_processing=settings.ENABLE_EQUATION_PROCESSING,
            )

            # Define LLM model function
            def llm_model_func(prompt, system_prompt=None, history_messages=[], **kwargs):
                return openai_complete_if_cache(
                    settings.DEFAULT_LLM_MODEL,
                    prompt,
                    system_prompt=system_prompt,
                    history_messages=history_messages,
                    api_key=settings.OPENAI_API_KEY,
                    base_url=settings.OPENAI_BASE_URL,
                    **kwargs,
                )

            # Define vision model function
            def vision_model_func(
                prompt,
                system_prompt=None,
                history_messages=[],
                image_data=None,
                messages=None,
                **kwargs
            ):
                # Multimodal VLM enhanced query format
                if messages:
                    return openai_complete_if_cache(
                        settings.DEFAULT_VISION_MODEL,
                        "",
                        system_prompt=None,
                        history_messages=[],
                        messages=messages,
                        api_key=settings.OPENAI_API_KEY,
                        base_url=settings.OPENAI_BASE_URL,
                        **kwargs,
                    )
                # Single image format
                elif image_data:
                    return openai_complete_if_cache(
                        settings.DEFAULT_VISION_MODEL,
                        "",
                        system_prompt=None,
                        history_messages=[],
                        messages=[
                            {"role": "system", "content": system_prompt}
                            if system_prompt
                            else None,
                            {
                                "role": "user",
                                "content": [
                                    {"type": "text", "text": prompt},
                                    {
                                        "type": "image_url",
                                        "image_url": {
                                            "url": f"data:image/jpeg;base64,{image_data}"
                                        },
                                    },
                                ],
                            }
                            if image_data
                            else {"role": "user", "content": prompt},
                        ],
                        api_key=settings.OPENAI_API_KEY,
                        base_url=settings.OPENAI_BASE_URL,
                        **kwargs,
                    )
                # Pure text
                else:
                    return llm_model_func(prompt, system_prompt, history_messages, **kwargs)

            # Define embedding function
            embedding_func = EmbeddingFunc(
                embedding_dim=3072,
                max_token_size=8192,
                func=lambda texts: openai_embed(
                    texts,
                    model=settings.DEFAULT_EMBEDDING_MODEL,
                    api_key=settings.OPENAI_API_KEY,
                    base_url=settings.OPENAI_BASE_URL,
                ),
            )

            # Initialize RAGAnything
            self._rag = RAGAnything(
                config=config,
                llm_model_func=llm_model_func,
                vision_model_func=vision_model_func,
                embedding_func=embedding_func,
            )

            self._initialized = True
            print("✅ RAGAnything service initialized successfully")

        except Exception as e:
            print(f"❌ Failed to initialize RAGAnything: {str(e)}")
            raise

    @property
    def rag(self) -> RAGAnything:
        """Get RAGAnything instance."""
        if not self._initialized or self._rag is None:
            self._initialize_rag()
        return self._rag

    async def parse_document(
        self,
        file_path: str,
        output_dir: Optional[str] = None,
        parser: Optional[str] = None,
        parse_method: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Parse a document using RAG-Anything.

        Args:
            file_path: Path to document file
            output_dir: Output directory for parsed content
            parser: Parser to use (mineru/docling)
            parse_method: Parse method (auto/ocr/txt)
            **kwargs: Additional parser options

        Returns:
            Dict with parsing results
        """
        try:
            # Use config defaults if not specified
            output_dir = output_dir or settings.OUTPUT_DIR
            parser_to_use = parser or settings.PARSER
            method = parse_method or settings.PARSE_METHOD

            # Parse document
            result = await self.rag.process_document_complete(
                file_path=file_path,
                output_dir=output_dir,
                parse_method=method,
                display_stats=True,
                **kwargs
            )

            return {
                "success": True,
                "file_path": file_path,
                "parser": parser_to_use,
                "parse_method": method,
                "message": "Document parsed successfully",
            }

        except Exception as e:
            return {
                "success": False,
                "file_path": file_path,
                "error": str(e),
                "message": f"Parsing failed: {str(e)}",
            }

    async def query(
        self,
        query: str,
        mode: str = "hybrid",
        vlm_enhanced: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Execute a query against the knowledge base.

        Args:
            query: Query text
            mode: Query mode (naive/local/global/hybrid)
            vlm_enhanced: Enable VLM enhancement
            **kwargs: Additional query options

        Returns:
            Dict with query results
        """
        try:
            # Execute query
            result = await self.rag.aquery(
                query=query,
                mode=mode,
                vlm_enhanced=vlm_enhanced,
                **kwargs
            )

            return {
                "success": True,
                "query": query,
                "mode": mode,
                "answer": result,
                "vlm_enhanced": vlm_enhanced,
            }

        except Exception as e:
            return {
                "success": False,
                "query": query,
                "error": str(e),
                "message": f"Query failed: {str(e)}",
            }

    async def query_with_multimodal(
        self,
        query: str,
        multimodal_content: List[Dict[str, Any]],
        mode: str = "hybrid",
        **kwargs
    ) -> Dict[str, Any]:
        """
        Execute a multimodal query with additional content.

        Args:
            query: Query text
            multimodal_content: List of multimodal content items
            mode: Query mode
            **kwargs: Additional options

        Returns:
            Dict with query results
        """
        try:
            result = await self.rag.aquery_with_multimodal(
                query=query,
                multimodal_content=multimodal_content,
                mode=mode,
                **kwargs
            )

            return {
                "success": True,
                "query": query,
                "mode": mode,
                "answer": result,
                "multimodal_content_count": len(multimodal_content),
            }

        except Exception as e:
            return {
                "success": False,
                "query": query,
                "error": str(e),
                "message": f"Multimodal query failed: {str(e)}",
            }

    def get_graph_data(self, limit: int = 1000) -> Dict[str, Any]:
        """
        Get knowledge graph data from LightRAG.

        Args:
            limit: Maximum number of nodes/edges to return

        Returns:
            Dict with nodes and edges
        """
        try:
            # Access LightRAG knowledge graph
            if not self.rag.lightrag:
                return {"nodes": [], "edges": [], "error": "Knowledge graph not initialized"}

            lightrag = self.rag.lightrag
            nodes = []
            edges = []

            # Extract entities as nodes from entity vector database
            if hasattr(lightrag, 'entity_vdb') and lightrag.entity_vdb:
                try:
                    # Get entity data - method depends on vector DB implementation
                    entity_count = 0
                    # Try to access stored entities
                    if hasattr(lightrag.entity_vdb, 'entities'):
                        for entity_id, entity_info in list(lightrag.entity_vdb.entities.items())[:limit]:
                            nodes.append({
                                "id": str(entity_id),
                                "label": str(entity_info.get('name', entity_id)),
                                "type": entity_info.get('type', 'entity'),
                                "description": entity_info.get('description', ''),
                            })
                            entity_count += 1
                except Exception as e:
                    print(f"Could not extract entities: {e}")

            # Extract relationships as edges from graph storage
            if hasattr(lightrag, 'graph_storage') and lightrag.graph_storage:
                try:
                    # Get relationship data
                    if hasattr(lightrag.graph_storage, 'edges'):
                        for edge_id, edge_info in list(lightrag.graph_storage.edges.items())[:limit]:
                            edges.append({
                                "id": str(edge_id),
                                "source": str(edge_info.get('source', '')),
                                "target": str(edge_info.get('target', '')),
                                "label": edge_info.get('relation', ''),
                                "weight": edge_info.get('weight', 1.0),
                            })
                except Exception as e:
                    print(f"Could not extract relationships: {e}")

            return {
                "nodes": nodes,
                "edges": edges,
                "node_count": len(nodes),
                "edge_count": len(edges),
                "message": f"Extracted {len(nodes)} nodes and {len(edges)} edges",
            }

        except Exception as e:
            return {
                "nodes": [],
                "edges": [],
                "error": str(e),
            }

    def get_vector_stats(self) -> Dict[str, Any]:
        """
        Get vector space statistics from LightRAG.

        Returns:
            Dict with vector statistics
        """
        try:
            if not self.rag.lightrag:
                return {"error": "Knowledge graph not initialized"}

            lightrag = self.rag.lightrag
            stats = {
                "embedding_dim": 3072,
                "total_chunks": 0,
                "total_entities": 0,
                "total_relationships": 0,
            }

            # Count chunks in chunk vector database
            if hasattr(lightrag, 'chunk_vdb') and lightrag.chunk_vdb:
                try:
                    if hasattr(lightrag.chunk_vdb, 'chunks'):
                        stats["total_chunks"] = len(lightrag.chunk_vdb.chunks)
                    elif hasattr(lightrag.chunk_vdb, '__len__'):
                        stats["total_chunks"] = len(lightrag.chunk_vdb)
                except Exception as e:
                    print(f"Could not count chunks: {e}")

            # Count entities in entity vector database
            if hasattr(lightrag, 'entity_vdb') and lightrag.entity_vdb:
                try:
                    if hasattr(lightrag.entity_vdb, 'entities'):
                        stats["total_entities"] = len(lightrag.entity_vdb.entities)
                    elif hasattr(lightrag.entity_vdb, '__len__'):
                        stats["total_entities"] = len(lightrag.entity_vdb)
                except Exception as e:
                    print(f"Could not count entities: {e}")

            # Count relationships in graph storage
            if hasattr(lightrag, 'graph_storage') and lightrag.graph_storage:
                try:
                    if hasattr(lightrag.graph_storage, 'edges'):
                        stats["total_relationships"] = len(lightrag.graph_storage.edges)
                    elif hasattr(lightrag.graph_storage, '__len__'):
                        stats["total_relationships"] = len(lightrag.graph_storage)
                except Exception as e:
                    print(f"Could not count relationships: {e}")

            return stats

        except Exception as e:
            return {
                "error": str(e),
            }

    def health_check(self) -> Dict[str, Any]:
        """
        Check RAG service health.

        Returns:
            Dict with health status
        """
        return {
            "initialized": self._initialized,
            "rag_instance": self._rag is not None,
            "working_dir": settings.WORKING_DIR,
            "parser": settings.PARSER,
        }


# Global service instance
rag_service = RAGService()
