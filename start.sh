#!/bin/bash

# RAG-Anything Studio - Quick Start Script
# This script helps you start the application with Docker

set -e

echo "🚀 RAG-Anything Studio - Quick Start"
echo "====================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is installed and running"
echo ""

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found. Creating from template..."
    cp env.example backend/.env
    echo "✅ Created backend/.env"
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env and add your OpenAI API key:"
    echo "   - LLM_BINDING_API_KEY=your-openai-api-key-here"
    echo "   - EMBEDDING_BINDING_API_KEY=your-openai-api-key-here"
    echo ""
    read -p "Press Enter after updating the API keys..."
fi

echo "📦 Building Docker images (this may take 5-10 minutes)..."
docker compose -f docker-compose.dev.yml build

echo ""
echo "🚀 Starting services..."
docker compose -f docker-compose.dev.yml up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo ""
    echo "✅ Services are running!"
    echo ""
    echo "🌐 Access the application:"
    echo "   Frontend:  http://localhost:3000"
    echo "   Backend:   http://localhost:8000"
    echo "   API Docs:  http://localhost:8000/docs"
    echo ""
    echo "📊 View logs:"
    echo "   docker compose -f docker-compose.dev.yml logs -f"
    echo ""
    echo "🛑 Stop services:"
    echo "   docker compose -f docker-compose.dev.yml down"
    echo ""
    echo "📚 Next Steps:"
    echo "   1. Open http://localhost:3000 in your browser"
    echo "   2. Upload a test document"
    echo "   3. Try the chat interface"
    echo "   4. See TESTING_GUIDE.md for detailed testing instructions"
    echo ""
else
    echo ""
    echo "⚠️  Services may not have started correctly."
    echo "   Check logs: docker compose -f docker-compose.dev.yml logs"
fi
