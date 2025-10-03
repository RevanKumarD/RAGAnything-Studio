# RAG-Anything Studio - Quick Start Guide

## 🚀 Get Started Immediately

This guide will get you from zero to running the application in minutes.

---

## 📋 Prerequisites

### Required
- **Node.js**: v18.19.1 or higher (v20+ recommended)
- **Python**: 3.10 or higher
- **npm**: 9.2.0 or higher
- **Git**: Latest version

### Optional (but recommended)
- **Docker**: For containerized deployment
- **Redis**: For background jobs and caching
- **PostgreSQL**: For metadata storage

---

## ⚡ Quick Setup (Development)

### 1. Clone & Navigate
```bash
cd /mnt/r/StartUp/RAG-Anything
```

### 2. Frontend Setup (Already Done!)
```bash
cd frontend

# Install dependencies (already installed)
npm install

# Run development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### 3. Backend Setup (Next Step)
```bash
cd ../backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend API will be available at: **http://localhost:8000**
API Docs at: **http://localhost:8000/docs**

---

## 📁 Project Structure

```
RAG-Anything/
│
├── 📖 Documentation (READ THESE FIRST!)
│   ├── PROJECT_CONTEXT.md         # Project vision & architecture
│   ├── IMPLEMENTATION_PLAN.md     # Detailed 10-phase plan
│   ├── REQUIREMENTS.md            # Feature specifications
│   ├── SESSION_SUMMARY.md         # Current status & resume guide
│   ├── QUICKSTART.md              # This file
│   └── CLAUDE.md                  # RAG-Anything library guide
│
├── 🎨 Frontend (Next.js)
│   ├── app/                       # Next.js App Router pages
│   ├── components/                # React components
│   │   ├── ui/                    # shadcn/ui components (15)
│   │   ├── layout/                # Layout components (to create)
│   │   └── features/              # Feature components (to create)
│   ├── lib/                       # Utilities (to create)
│   ├── hooks/                     # Custom hooks (to create)
│   ├── stores/                    # Zustand stores (to create)
│   ├── types/                     # TypeScript types (to create)
│   └── package.json               # Dependencies
│
├── ⚙️ Backend (FastAPI)
│   ├── app/                       # FastAPI application (to create)
│   │   ├── main.py                # Entry point
│   │   ├── api/                   # API routes
│   │   ├── core/                  # Core functionality
│   │   ├── models/                # Pydantic models
│   │   ├── services/              # Business logic
│   │   └── tasks/                 # Celery background tasks
│   └── requirements.txt           # Python dependencies
│
├── 🐳 Docker
│   ├── frontend.Dockerfile        # Frontend container (to create)
│   ├── backend.Dockerfile         # Backend container (to create)
│   └── nginx.conf                 # Reverse proxy config (to create)
│
├── 📦 RAG-Anything Library (Existing)
│   ├── raganything/               # Core library
│   ├── examples/                  # Usage examples
│   └── docs/                      # Feature docs
│
└── docker-compose.yml             # Multi-container setup (to create)
```

---

## 🛠️ Development Workflow

### Daily Workflow
```bash
# 1. Start frontend (Terminal 1)
cd frontend
npm run dev

# 2. Start backend (Terminal 2)
cd backend
source venv/bin/activate  # or venv\Scripts\activate
uvicorn app.main:app --reload

# 3. Code and test!
```

### With Docker (Once Configured)
```bash
# Build and run everything
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

---

## 📚 Key Documentation Files

### **Must Read** (In Order)
1. **SESSION_SUMMARY.md** - Current status, what's done, what's next
2. **PROJECT_CONTEXT.md** - Understand the vision and architecture
3. **IMPLEMENTATION_PLAN.md** - See the detailed 10-phase plan

### **Reference** (As Needed)
4. **REQUIREMENTS.md** - Feature specifications
5. **CLAUDE.md** - RAG-Anything library guide
6. **QUICKSTART.md** - This file

---

## 🎯 Current Status (2025-10-03)

### ✅ Completed (Phase 1 - 40%)
- Project planning and documentation
- Frontend initialized with Next.js 14 + TypeScript
- Tailwind CSS configured
- shadcn/ui components installed (15 components)
- Core dependencies installed (Zustand, TanStack Query, Framer Motion)

### ⏳ In Progress
- Backend FastAPI initialization
- Docker configuration
- Development environment setup

### 📋 Next Up (Phase 1 - 60%)
- Create frontend folder structure
- Initialize FastAPI backend
- Set up Docker Compose
- Configure environment variables
- Create base layout components

---

## 🔑 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### Backend (.env)
```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1  # Optional

# Application
WORKING_DIR=./rag_storage
PARSER=mineru
PARSE_METHOD=auto
OUTPUT_DIR=./output

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/raganything
REDIS_URL=redis://localhost:6379/0

# RAG-Anything Features
ENABLE_IMAGE_PROCESSING=True
ENABLE_TABLE_PROCESSING=True
ENABLE_EQUATION_PROCESSING=True
```

---

## 🎨 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: shadcn/ui + Radix UI + Tailwind CSS
- **State**: Zustand
- **Data**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Graph**: Cytoscape.js
- **Vectors**: Plotly.js
- **PDF**: react-pdf
- **Markdown**: react-markdown + KaTeX

### Backend
- **API**: FastAPI + Pydantic v2
- **WebSocket**: FastAPI WebSocket + Redis
- **Jobs**: Celery + Redis
- **Database**: PostgreSQL + Redis
- **RAG**: RAG-Anything library

### Infrastructure
- **Container**: Docker + Docker Compose
- **Proxy**: Nginx (production)
- **Process**: Supervisor (Celery)

---

## 📦 Installed Dependencies

### Frontend (package.json)
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "framer-motion": "^10.16.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "tailwindcss": "^3.3.0"
  }
}
```

### shadcn/ui Components
✅ Installed: button, card, input, textarea, select, checkbox, radio-group, dialog, tabs, accordion, badge, progress, sonner (toast), tooltip, dropdown-menu

### Backend (requirements.txt - To Create)
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
websockets==12.0
redis==5.0.1
celery==5.3.4
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.0
python-dotenv==1.0.0
aiofiles==23.2.1
httpx==0.25.2
pytest==7.4.3
pytest-asyncio==0.21.1
```

---

## 🧪 Testing

### Frontend
```bash
cd frontend

# Run tests (when configured)
npm test

# Run E2E tests (when configured)
npm run test:e2e

# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format
```

### Backend
```bash
cd backend
source venv/bin/activate

# Run tests
pytest

# Run with coverage
pytest --cov=app

# Type check
mypy app/

# Format
black app/
isort app/
```

---

## 🚀 Deployment (Future)

### Production Build
```bash
# Frontend
cd frontend
npm run build
npm run start

# Backend
cd backend
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Docker
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🐛 Troubleshooting

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend import errors
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Port already in use
```bash
# Find and kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9
```

---

## 📞 Getting Help

### Documentation
1. Read `SESSION_SUMMARY.md` for current status
2. Check `IMPLEMENTATION_PLAN.md` for detailed tasks
3. Review `REQUIREMENTS.md` for feature specs
4. Consult `CLAUDE.md` for RAG-Anything library usage

### Common Questions
- **What's the project about?** → Read `PROJECT_CONTEXT.md`
- **What's already done?** → Check `SESSION_SUMMARY.md`
- **What do I build next?** → See `IMPLEMENTATION_PLAN.md`
- **How do I use RAG-Anything?** → Read `CLAUDE.md`

---

## ⏱️ Time Estimates

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Foundation & Setup | 2-3h |
| 2 | Core Backend API | 4-5h |
| 3 | Frontend Foundation | 3-4h |
| 4 | Document Parser Module | 4-5h |
| 5 | Chat Interface | 4-5h |
| 6 | Knowledge Graph | 5-6h |
| 7 | Vector Explorer | 3-4h |
| 8 | Remaining Modules | 4-5h |
| 9 | Performance Optimization | 2-3h |
| 10 | Testing & Polish | 3-4h |
| **Total** | **Full Application** | **35-43h** |

**Current Progress**: ~3h invested, Phase 1 at 40%

---

## 🎉 What You'll Build

### End Result
A **premium, enterprise-grade web application** with:

1. **Document Upload & Parsing**
   - Drag-and-drop interface
   - Visual grounding (overlay annotations on PDFs)
   - Real-time progress tracking

2. **AI Chat Interface**
   - Multimodal queries (text + images + tables)
   - Grounded responses with citations
   - Visual evidence inline

3. **Knowledge Graph Explorer**
   - Interactive 3D/2D force-directed graph
   - Filter by type, document, date
   - Node inspection and navigation

4. **Vector Space Visualizer**
   - 2D/3D embedding projections
   - Cluster analysis
   - Similarity search

5. **Document Library**
   - Grid/list views
   - Search and filter
   - Batch processing

6. **Analytics Dashboard**
   - Content statistics
   - Query metrics
   - Knowledge growth timeline

---

**Ready to build something amazing? Let's go!** 🚀

---

**Last Updated**: 2025-10-03
**Version**: 0.1.0-alpha
**Status**: Ready for Development
