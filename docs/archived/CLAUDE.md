# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RAG-Anything is a multimodal document processing RAG (Retrieval-Augmented Generation) system built on LightRAG. It provides end-to-end document parsing, multimodal content processing (images, tables, equations), and intelligent query capabilities across diverse content types.

**Core Technologies:**
- **LightRAG**: Base RAG framework for knowledge graph construction and retrieval
- **MinerU/Docling**: Configurable document parsers for PDF, Office docs, images, and text
- **OpenAI API**: LLM and vision models for content analysis
- **Python 3.10+**: Async/await patterns, dataclasses, type hints

## Commands

### Development Setup

```bash
# Install from source with uv (recommended)
uv sync
# With optional dependencies
uv sync --extra image --extra text --all-extras
# If network timeouts occur:
UV_HTTP_TIMEOUT=120 uv sync

# Install from source with pip
pip install -e .
pip install -e .[all]  # With all optional features

# Install from PyPI
pip install raganything
pip install 'raganything[all]'
```

### Testing and Linting

```bash
# Run pre-commit hooks (ruff format + ruff lint)
pre-commit run --all-files

# Format code with ruff
ruff format .

# Lint with ruff
ruff check . --fix

# Run example scripts
uv run python examples/raganything_example.py path/to/doc.pdf --api-key YOUR_KEY
python examples/office_document_test.py --file path/to/doc.docx
python examples/image_format_test.py --file path/to/image.bmp
```

### Parser Verification

```bash
# Check MinerU installation
mineru --version
python -c "from raganything import RAGAnything; rag = RAGAnything(); print('✅ MinerU OK' if rag.check_parser_installation() else '❌ Issue')"

# Check LibreOffice (required for Office docs)
python examples/office_document_test.py --check-libreoffice --file dummy

# Check Pillow (for extended image formats)
python examples/image_format_test.py --check-pillow --file dummy

# Check ReportLab (for text file conversion)
python examples/text_format_test.py --check-reportlab --file dummy
```

### Building and Distribution

```bash
# Build package
python setup.py sdist bdist_wheel

# Install in development mode
pip install -e .
```

## Architecture

### Core Components

1. **RAGAnything** (`raganything/raganything.py`)
   - Main entry point using mixin pattern
   - Coordinates document parsing, content processing, and query handling
   - Manages LightRAG instance lifecycle and multimodal processors

2. **Mixins Architecture**
   - `QueryMixin` (`query.py`): Query methods including text, VLM-enhanced, and multimodal queries
   - `ProcessorMixin` (`processor.py`): Document parsing, content processing, cache management
   - `BatchMixin` (`batch.py`): Batch/folder processing with parallel execution

3. **Parsers** (`parser.py`)
   - `MineruParser`: PDF, images, Office docs (via LibreOffice conversion)
   - `DoclingParser`: Alternative parser with better Office/HTML support
   - Base `Parser` class with common utilities (format detection, Office→PDF conversion)

4. **Modal Processors** (`modalprocessors.py`)
   - `ImageModalProcessor`: Vision model-based image analysis
   - `TableModalProcessor`: Structured data interpretation
   - `EquationModalProcessor`: LaTeX equation parsing
   - `GenericModalProcessor`: Base class for custom processors
   - `ContextExtractor`: Provides surrounding content context to processors

5. **Configuration** (`config.py`)
   - `RAGAnythingConfig`: Dataclass with environment variable support
   - Configures parsers, processing modes, batch settings, context extraction

### Data Flow

```
Document Input → Parser (MinerU/Docling) → Content List (text/image/table/equation)
                                              ↓
                     ┌────────────────────────┴────────────────────┐
                     ↓                                              ↓
              Text Content                                  Multimodal Content
                     ↓                                              ↓
         LightRAG Text Insert                        Modal Processors (Image/Table/Eq)
                     ↓                                              ↓
         Knowledge Graph                            Enhanced Descriptions + Entities
                     └────────────────────────┬────────────────────┘
                                              ↓
                                    Unified Knowledge Base
                                              ↓
                              Query Engine (text/VLM/multimodal)
```

### Key Patterns

**Async Architecture:**
- All processing and query methods are async (`async def`, `await`)
- Use `asyncio.run()` for top-level execution
- LightRAG storage initialization requires `await initialize_storages()`

**Configuration Cascading:**
- Environment variables (`.env`) → `RAGAnythingConfig` defaults
- Config object → Runtime method parameters
- Parser-specific kwargs pass through to MinerU/Docling

**Content List Format:**
Parsers output a standardized list of dictionaries:
```python
[
    {"type": "text", "text": "...", "page_idx": 0},
    {"type": "image", "img_path": "/abs/path", "image_caption": [...], "page_idx": 1},
    {"type": "table", "table_body": "...", "table_caption": [...], "page_idx": 2},
    {"type": "equation", "latex": "...", "text": "...", "page_idx": 3}
]
```

**Parse Caching:**
- Cache key: MD5 hash of (file_path, mtime, parser, parse_method, parser_kwargs)
- Stored in LightRAG KV storage under `parse_cache` namespace
- Invalidated on file modification or config change

## Important Implementation Details

### Parser Selection and Configuration

**MinerU vs Docling:**
- MinerU: Better for PDFs, images, advanced OCR, GPU support
- Docling: Better for Office docs, HTML, preserves document structure
- Set via `config.parser` or `PARSER` env var

**Parse Methods:**
- `auto`: Automatic detection (MinerU default)
- `ocr`: OCR-focused parsing for image-heavy documents
- `txt`: Text extraction without OCR

**MinerU Special Parameters:**
```python
await rag.process_document_complete(
    file_path="doc.pdf",
    parse_method="auto",
    lang="ch",           # OCR language: "ch", "en", "ja"
    device="cuda:0",     # "cpu", "cuda", "npu", "mps"
    start_page=0,        # Page range for PDFs
    end_page=10,
    formula=True,        # Enable formula/table parsing
    table=True,
    backend="pipeline",  # "pipeline", "vlm-transformers", etc.
    source="huggingface" # Model source
)
```

### Query Types

1. **Text Query** (`aquery`):
   - Direct LightRAG knowledge base search
   - Modes: `hybrid`, `local`, `global`, `naive`

2. **VLM-Enhanced Query** (`aquery` with `vlm_enhanced=True`):
   - Automatically enabled when `vision_model_func` is provided
   - Retrieves context with image paths, encodes images as base64, sends to VLM
   - VLM sees both text and images for comprehensive analysis

3. **Multimodal Query** (`aquery_with_multimodal`):
   - User provides specific multimodal content (images, tables, equations)
   - Combines user content with retrieved context for analysis

### Modal Processor Workflow

Each processor follows this pattern:
1. Receive multimodal content item from parser
2. Extract context using `ContextExtractor` (surrounding text/captions)
3. Call `modal_caption_func` (LLM/VLM) to generate enhanced description
4. Create entity with description and metadata
5. Insert entity and chunk into LightRAG knowledge graph

**Custom Processor Example:**
```python
from raganything.modalprocessors import GenericModalProcessor

class CustomProcessor(GenericModalProcessor):
    async def process_multimodal_content(self, modal_content, content_type, file_path, entity_name):
        # Extract context
        context = await self.context_extractor.extract_context(...)

        # Generate description with LLM/VLM
        description = await self.modal_caption_func(
            prompt=f"Analyze this {content_type}...",
            system_prompt="...",
            **kwargs
        )

        # Create entity
        entity_info = self._create_entity_info(description, entity_name, metadata)

        # Insert into knowledge graph
        return await self._create_entity_and_chunk(description, entity_info, file_path)
```

### Environment Variables

Key variables in `.env` (see `env.example`):
```bash
OPENAI_API_KEY=...
OPENAI_BASE_URL=...
PARSER=mineru                  # or docling
PARSE_METHOD=auto              # or ocr, txt
OUTPUT_DIR=./output
ENABLE_IMAGE_PROCESSING=True
ENABLE_TABLE_PROCESSING=True
ENABLE_EQUATION_PROCESSING=True
MAX_CONCURRENT_FILES=1
CONTEXT_WINDOW=1
```

### Dependencies

**Core:**
- `lightrag-hku`: Base RAG framework
- `mineru[core]`: MinerU 2.0 parser
- `huggingface_hub`, `tqdm`

**Optional:**
- `[image]`: Pillow for BMP, TIFF, GIF, WebP
- `[text]`: ReportLab for TXT, MD conversion
- `[office]`: Requires **LibreOffice** (external program, not pip package)
- `[markdown]`: markdown, weasyprint, pygments for enhanced MD

**Development:**
- pytest, pytest-asyncio, black, isort, flake8, mypy, ruff
- openai, python-dotenv

### File Structure

```
raganything/
├── __init__.py          # Package exports
├── raganything.py       # Main RAGAnything class (uses mixins)
├── config.py            # Configuration dataclass
├── base.py              # Base types (DocStatus enum)
├── query.py             # QueryMixin (query methods)
├── processor.py         # ProcessorMixin (parsing, processing)
├── batch.py             # BatchMixin (batch processing)
├── parser.py            # MineruParser, DoclingParser
├── modalprocessors.py   # Image/Table/Equation processors
├── prompt.py            # Prompt templates
├── utils.py             # Utility functions
├── batch_parser.py      # Batch parsing utilities
└── enhanced_markdown.py # Enhanced markdown conversion

examples/
├── raganything_example.py          # End-to-end RAG pipeline
├── modalprocessors_example.py      # Direct modal processor usage
├── insert_content_list_example.py  # Direct content list insertion
├── batch_processing_example.py     # Batch folder processing
├── office_document_test.py         # Office doc parsing test
├── image_format_test.py            # Image format test
└── text_format_test.py             # Text format test
```

### Common Patterns

**Initialize RAGAnything:**
```python
from raganything import RAGAnything, RAGAnythingConfig

config = RAGAnythingConfig(
    working_dir="./rag_storage",
    parser="mineru",
    enable_image_processing=True
)

rag = RAGAnything(
    config=config,
    llm_model_func=llm_func,
    vision_model_func=vision_func,  # Optional for VLM features
    embedding_func=embedding_func,
    lightrag_kwargs={}  # Pass LightRAG params here
)

# Or load existing LightRAG instance
rag = RAGAnything(lightrag=existing_lightrag, vision_model_func=vision_func)
```

**Process Document:**
```python
await rag.process_document_complete(
    file_path="doc.pdf",
    output_dir="./output",
    parse_method="auto",
    display_stats=True
)
```

**Direct Content List Insertion:**
```python
content_list = [
    {"type": "text", "text": "...", "page_idx": 0},
    {"type": "image", "img_path": "/abs/path/img.jpg", "image_caption": [...], "page_idx": 1}
]
await rag.insert_content_list(content_list, file_path="doc.pdf")
```

**Batch Processing:**
```python
await rag.process_folder_complete(
    folder_path="./docs",
    output_dir="./output",
    file_extensions=[".pdf", ".docx"],
    recursive=True,
    max_workers=4
)
```

## Testing Strategy

- Example scripts in `examples/` serve as integration tests
- Use `*_test.py` scripts to verify parser installations without API keys
- Test async functions with `pytest-asyncio`
- Validate parser output using `display_stats=True`

## Common Gotchas

1. **Office Documents**: Require LibreOffice installed (not pip package). Parser converts Office→PDF→parse.
2. **Image Paths**: Must be absolute paths in content lists for modal processors.
3. **Async Initialization**: Always `await rag.lightrag.initialize_storages()` before manual LightRAG ops.
4. **Parse Caching**: Cache invalidates on file mtime change, not just content change.
5. **VLM Enhanced Query**: Automatically enabled when `vision_model_func` is provided; set `vlm_enhanced=False` to disable.
6. **MinerU 2.0**: No longer uses `magic-pdf.json` config; all settings via CLI args or function kwargs.
7. **Parser Errors**: Catch `MineruExecutionError` for parser failures.

## API Key Requirements

- Parser test scripts (`*_test.py`) do NOT require API keys
- Full RAG pipeline requires OpenAI API key (or compatible LLM provider)
- Set in `.env` or pass directly to model functions
