<div align="center">

# 🎨 RAG-Anything Studio

### Premium Web Interface for RAG-Anything

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-tech-stack">Tech Stack</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Python-3.10-yellow?style=for-the-badge&logo=python" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Alpha-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Progress-30%25-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

</div>

---

## 🌟 Overview

**RAG-Anything Studio** is a modern, enterprise-grade web application that brings the power of [RAG-Anything](https://github.com/HKUDS/RAG-Anything) multimodal document processing to an intuitive visual interface.

Built with **Next.js 14**, **FastAPI**, and **TypeScript**, Studio provides a complete solution for:
- 📄 Visual document parsing with grounded overlay annotations
- 💬 AI-powered multimodal chat with citations
- 🕸️ Interactive 3D knowledge graph visualization
- 📊 Vector space exploration and clustering
- 📈 Analytics and insights dashboard
- ⚙️ Batch processing and workflow management

---

## ✨ Features

### 🎨 Premium User Experience
- **Modern UI** - Built with shadcn/ui + Tailwind CSS
- **Dark Mode** - Full theme customization
- **Responsive** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Powered by Framer Motion
- **Accessibility** - WCAG 2.1 AA compliant

### 📄 Document Processing
- **Visual Grounding** - See parsed elements overlaid on original documents
- **Multi-Format Support** - PDF, Office docs, images, text files
- **Real-Time Progress** - WebSocket updates during parsing
- **Batch Processing** - Upload and process folders
- **Parser Selection** - MinerU or Docling with custom settings

### 💬 Intelligent Chat
- **Multimodal Queries** - Ask questions about text, images, tables, equations
- **Grounded Responses** - Citations with source highlighting
- **Visual Evidence** - Inline images and tables in responses
- **Query Modes** - Naive, Local, Global, Hybrid
- **VLM Enhanced** - Vision language model integration

### 🕸️ Knowledge Graph
- **Interactive Visualization** - 3D force-directed graph
- **Node Exploration** - Click to view entity details
- **Filtering** - By content type, document, date, connections
- **Search** - Find entities by name
- **Subgraph Views** - Focus on specific areas

### 📊 Vector Space Explorer
- **2D/3D Projections** - UMAP, t-SNE, PCA
- **Cluster Analysis** - Automatic clustering with labels
- **Similarity Search** - Find similar content
- **Visual Analytics** - Statistics and distributions

### 🛠️ Advanced Features
- **Settings Management** - LLM config, parser options, RAG parameters
- **Analytics Dashboard** - Usage stats and insights
- **Document Library** - Manage all processed files
- **Export/Import** - Knowledge base portability

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **Python** 3.10+
- **Redis** (optional, for background jobs)

### Installation

```bash
# Clone the repository
git clone https://github.com/RevanKumarD/RAGAnything-Studio.git
cd RAGAnything-Studio

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Or use Docker
docker-compose up --build
```

### Configuration

Create `.env` files:

**Backend** (`backend/.env`):
```bash
OPENAI_API_KEY=your_api_key_here
WORKING_DIR=./rag_storage
PARSER=mineru
ENABLE_IMAGE_PROCESSING=True
ENABLE_TABLE_PROCESSING=True
ENABLE_EQUATION_PROCESSING=True
```

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### Run Development Servers

**Backend:**
```bash
cd backend
uvicorn app.main:app --reload
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

**Frontend:**
```bash
cd frontend
npm run dev
# App: http://localhost:3000
```

**Docker:**
```bash
docker-compose up
# All services running with hot-reload
```

---

## 📸 Screenshots

> Coming soon! Screenshots will be added as features are implemented.

**Planned Views:**
- Document Upload & Grounded Parsing
- Chat Interface with Citations
- Knowledge Graph Visualization
- Vector Space Explorer
- Analytics Dashboard

---

## 📚 Documentation

### Essential Reading
- **[QUICKSTART.md](QUICKSTART.md)** - Get up and running quickly
- **[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)** - Project vision and architecture
- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - Detailed development roadmap
- **[REQUIREMENTS.md](REQUIREMENTS.md)** - Feature specifications
- **[CLAUDE.md](CLAUDE.md)** - RAG-Anything library guide

### Guides
- **[SESSION_SUMMARY.md](SESSION_SUMMARY.md)** - Current progress and status
- **[COMPLETE_SUMMARY.md](COMPLETE_SUMMARY.md)** - Full project overview
- **[PUSH_INSTRUCTIONS.md](PUSH_INSTRUCTIONS.md)** - GitHub deployment guide

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | Component library |
| **Zustand** | State management |
| **TanStack Query** | Data fetching & caching |
| **Framer Motion** | Animations |
| **Cytoscape.js** | Knowledge graph visualization |
| **Plotly.js** | Vector space charts |
| **react-pdf** | PDF viewing |

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | REST API framework |
| **Pydantic** | Data validation |
| **Redis** | Caching & job queue |
| **Celery** | Background tasks |
| **RAG-Anything** | Core multimodal RAG library |
| **LightRAG** | Knowledge graph & retrieval |

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy (production)

---

## 📊 Project Status

### Phase 1: Foundation ✅ (100% Complete)
- [x] Project documentation
- [x] Frontend setup (Next.js + TypeScript)
- [x] Backend API (FastAPI)
- [x] Docker configuration
- [x] Type definitions
- [x] API client

### Phase 2: RAG Integration 🚧 (In Progress)
- [ ] Document parsing integration
- [ ] Query execution
- [ ] Knowledge graph data
- [ ] Vector operations
- [ ] WebSocket real-time updates

### Phase 3-10: UI Development 📋 (Planned)
- [ ] Upload interface
- [ ] Chat UI
- [ ] Graph visualization
- [ ] Vector explorer
- [ ] Document library
- [ ] Settings & analytics

**Overall Progress:** 30% Complete

---

## 🎯 Roadmap

### v0.1.0 (Current - Alpha)
- ✅ Project foundation
- ✅ Backend API structure
- 🚧 RAG-Anything integration
- 📋 Basic UI components

### v0.2.0 (Next)
- Document upload & parsing UI
- Chat interface
- Knowledge graph viewer

### v0.3.0
- Vector space explorer
- Document library
- Batch processing

### v1.0.0 (Target)
- Full feature set
- Performance optimizations
- Production deployment
- Comprehensive testing

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript strict mode (no `any` types)
- Write tests for new features
- Update documentation
- Follow the existing code style

---

## 🐛 Known Issues

- [ ] Phase 2 integration in progress
- [ ] UI components being built
- [ ] WebSocket implementation pending

See [Issues](https://github.com/RevanKumarD/RAGAnything-Studio/issues) for more.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[RAG-Anything](https://github.com/HKUDS/RAG-Anything)** - Core multimodal RAG library
- **[LightRAG](https://github.com/HKUDS/LightRAG)** - Knowledge graph foundation
- **[MinerU](https://github.com/opendatalab/MinerU)** - Document parsing
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library

---

## 📧 Contact

- **Author:** RevanKumarD
- **Email:** revan.dhana@gmail.com
- **Repository:** [https://github.com/RevanKumarD/RAGAnything-Studio](https://github.com/RevanKumarD/RAGAnything-Studio)

---

## 🌟 Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🔀 Contributing code

---

<div align="center">

**Built with ❤️ using [Claude Code](https://claude.ai/code)**

**[Documentation](QUICKSTART.md)** • **[Issues](https://github.com/RevanKumarD/RAGAnything-Studio/issues)** • **[Discussions](https://github.com/RevanKumarD/RAGAnything-Studio/discussions)**

</div>
