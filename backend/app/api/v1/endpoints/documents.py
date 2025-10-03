"""Document management endpoints."""

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import List, Optional
from pathlib import Path
import aiofiles
import os

from app.core.config import settings

router = APIRouter()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
):
    """
    Upload a document for processing.

    Accepts: PDF, DOCX, PPTX, XLSX, images, and text files.
    """
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_ext} not allowed. Supported: {settings.ALLOWED_EXTENSIONS}",
        )

    # Create upload directory
    upload_dir = Path(settings.OUTPUT_DIR) / "uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Generate safe filename
    file_path = upload_dir / file.filename

    # Save file
    try:
        async with aiofiles.open(file_path, "wb") as f:
            content = await file.read()

            # Check file size
            if len(content) > settings.MAX_UPLOAD_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail=f"File too large. Maximum size: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB",
                )

            await f.write(content)

        return JSONResponse(
            status_code=200,
            content={
                "message": "File uploaded successfully",
                "filename": file.filename,
                "file_path": str(file_path),
                "size": len(content),
                "type": file.content_type,
            },
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.post("/parse")
async def parse_document(
    file_path: str,
    parser: Optional[str] = None,
    parse_method: Optional[str] = None,
):
    """
    Parse a document using RAG-Anything.

    Integrates with RAGAnything service for actual document parsing.
    """
    from app.services.rag_service import rag_service

    try:
        # Parse document using RAG service
        result = await rag_service.parse_document(
            file_path=file_path,
            parser=parser,
            parse_method=parse_method,
        )

        return JSONResponse(
            status_code=200 if result.get("success") else 500,
            content=result,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing failed: {str(e)}")


@router.get("/list")
async def list_documents(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None,
):
    """
    List all uploaded documents with optional filtering.

    Args:
        skip: Number of documents to skip (pagination)
        limit: Maximum number of documents to return
        status: Filter by status (completed/processing/failed)
        search: Search in filename
    """
    upload_dir = Path(settings.OUTPUT_DIR) / "uploads"

    if not upload_dir.exists():
        return JSONResponse(content={"documents": [], "total": 0})

    documents = []
    for file_path in upload_dir.iterdir():
        if file_path.is_file():
            # Apply search filter
            if search and search.lower() not in file_path.name.lower():
                continue

            stat = file_path.stat()

            # Determine file type
            content_type = "application/octet-stream"
            suffix = file_path.suffix.lower()
            if suffix == ".pdf":
                content_type = "application/pdf"
            elif suffix in [".doc", ".docx"]:
                content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            elif suffix in [".jpg", ".jpeg"]:
                content_type = "image/jpeg"
            elif suffix == ".png":
                content_type = "image/png"
            elif suffix in [".txt", ".md"]:
                content_type = "text/plain"

            # Check if parsed (existence of output directory indicates completion)
            output_file = Path(settings.OUTPUT_DIR) / file_path.stem / "enhanced_content.md"
            doc_status = "completed" if output_file.exists() else "processing"

            # Apply status filter
            if status and status != doc_status:
                continue

            # Calculate chunks and entities from output if available
            chunks = 0
            entities = 0
            if output_file.exists():
                try:
                    # Estimate chunks from output file (rough approximation)
                    with open(output_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                        # Rough estimate: 500 chars per chunk
                        chunks = max(1, len(content) // 500)
                        # Estimate entities from content (very rough)
                        entities = content.count("##") + content.count("**")
                except:
                    pass

            documents.append({
                "id": file_path.name,
                "filename": file_path.name,
                "path": str(file_path),
                "size": stat.st_size,
                "type": content_type,
                "content_type": content_type,
                "status": doc_status,
                "uploaded_at": stat.st_ctime,
                "created": stat.st_ctime,
                "modified": stat.st_mtime,
                "chunks": chunks if chunks > 0 else None,
                "entities": entities if entities > 0 else None,
            })

    # Sort by upload time (newest first)
    documents.sort(key=lambda x: x["uploaded_at"], reverse=True)

    # Apply pagination
    total = len(documents)
    documents = documents[skip : skip + limit]

    return JSONResponse(content={
        "documents": documents,
        "total": total,
        "skip": skip,
        "limit": limit,
    })


@router.get("/{document_id}")
async def get_document(document_id: str):
    """
    Get document details by ID (filename).
    """
    upload_dir = Path(settings.OUTPUT_DIR) / "uploads"
    file_path = upload_dir / document_id

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Document not found")

    stat = file_path.stat()

    # Determine file type
    content_type = "application/octet-stream"
    suffix = file_path.suffix.lower()
    if suffix == ".pdf":
        content_type = "application/pdf"
    elif suffix in [".doc", ".docx"]:
        content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif suffix in [".jpg", ".jpeg"]:
        content_type = "image/jpeg"
    elif suffix == ".png":
        content_type = "image/png"
    elif suffix in [".txt", ".md"]:
        content_type = "text/plain"

    # Check if parsed
    output_file = Path(settings.OUTPUT_DIR) / file_path.stem / "enhanced_content.md"
    doc_status = "completed" if output_file.exists() else "processing"

    # Calculate chunks and entities
    chunks = 0
    entities = 0
    content_preview = None
    if output_file.exists():
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                content = f.read()
                chunks = max(1, len(content) // 500)
                entities = content.count("##") + content.count("**")
                # Get first 500 chars as preview
                content_preview = content[:500] + "..." if len(content) > 500 else content
        except:
            pass

    return JSONResponse(
        status_code=200,
        content={
            "id": document_id,
            "filename": file_path.name,
            "path": str(file_path),
            "size": stat.st_size,
            "type": content_type,
            "content_type": content_type,
            "status": doc_status,
            "uploaded_at": stat.st_ctime,
            "created": stat.st_ctime,
            "modified": stat.st_mtime,
            "chunks": chunks if chunks > 0 else None,
            "entities": entities if entities > 0 else None,
            "content_preview": content_preview,
            "output_path": str(output_file) if output_file.exists() else None,
        },
    )


@router.delete("/{document_id}")
async def delete_document(document_id: str):
    """
    Delete a document by ID (filename).

    This will delete:
    - The original uploaded file
    - The parsed output directory
    - Associated chunks and entities from the knowledge graph
    """
    upload_dir = Path(settings.OUTPUT_DIR) / "uploads"
    file_path = upload_dir / document_id

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        # Delete the uploaded file
        os.remove(file_path)

        # Delete the output directory if it exists
        output_dir = Path(settings.OUTPUT_DIR) / file_path.stem
        if output_dir.exists() and output_dir.is_dir():
            import shutil
            shutil.rmtree(output_dir)

        # Note: For production, you'd also want to:
        # 1. Remove entries from vector database
        # 2. Remove entities from knowledge graph
        # 3. Clean up any cached embeddings
        # This would require integration with the RAG service

        return JSONResponse(
            status_code=200,
            content={
                "message": f"Document {document_id} deleted successfully",
                "filename": document_id,
                "deleted_file": str(file_path),
                "deleted_output": str(output_dir) if output_dir.exists() else None,
            },
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete document: {str(e)}"
        )
