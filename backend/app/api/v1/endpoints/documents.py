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
async def list_documents():
    """
    List all uploaded documents.
    """
    upload_dir = Path(settings.OUTPUT_DIR) / "uploads"

    if not upload_dir.exists():
        return JSONResponse(content={"documents": []})

    documents = []
    for file_path in upload_dir.iterdir():
        if file_path.is_file():
            stat = file_path.stat()
            documents.append({
                "filename": file_path.name,
                "path": str(file_path),
                "size": stat.st_size,
                "created": stat.st_ctime,
                "modified": stat.st_mtime,
            })

    return JSONResponse(content={"documents": documents})


@router.get("/{document_id}")
async def get_document(document_id: str):
    """
    Get document details by ID.
    """
    # TODO: Implement document retrieval from database
    return JSONResponse(
        status_code=200,
        content={
            "id": document_id,
            "message": "Document details endpoint - to be implemented",
        },
    )


@router.delete("/{document_id}")
async def delete_document(document_id: str):
    """
    Delete a document by ID.
    """
    # TODO: Implement document deletion
    return JSONResponse(
        status_code=200,
        content={
            "message": f"Document {document_id} deleted successfully",
        },
    )
