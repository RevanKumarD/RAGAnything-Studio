# 🐳 Docker Quick Start Guide

## Prerequisites

✅ **Docker** version 20.10 or higher
✅ **Docker Compose** version 2.0 or higher
✅ **OpenAI API Key** (for LLM and embeddings)

---

## 📋 Step-by-Step Setup

### 1️⃣ Configure API Keys

Edit the backend `.env` file to add your OpenAI API key:

```bash
cd /mnt/r/StartUp/RAG-Anything
nano backend/.env
```

Update these lines:
```env
LLM_BINDING_API_KEY=your-openai-api-key-here
EMBEDDING_BINDING_API_KEY=your-openai-api-key-here
```

**Save and exit** (Ctrl+X, then Y, then Enter)

---

### 2️⃣ Build Docker Images

Build all services (this may take 5-10 minutes):

```bash
cd /mnt/r/StartUp/RAG-Anything
docker compose -f docker-compose.dev.yml build
```

**Expected output:**
```
[+] Building 320.5s (24/24) FINISHED
 => [backend] ...
 => [frontend] ...
 => [redis] ...
```

---

### 3️⃣ Start All Services

Start Redis, Backend, and Frontend:

```bash
docker compose -f docker-compose.dev.yml up
```

**Or run in detached mode (background):**
```bash
docker compose -f docker-compose.dev.yml up -d
```

**Expected output:**
```
[+] Running 3/3
 ✔ Container raganything-redis     Started
 ✔ Container raganything-backend   Started
 ✔ Container raganything-frontend  Started
```

---

### 4️⃣ Verify Services Are Running

**Check service status:**
```bash
docker compose -f docker-compose.dev.yml ps
```

**Expected output:**
```
NAME                    STATUS              PORTS
raganything-redis       Up (healthy)        0.0.0.0:6379->6379/tcp
raganything-backend     Up (healthy)        0.0.0.0:8000->8000/tcp
raganything-frontend    Up                  0.0.0.0:3000->3000/tcp
```

**Check backend health:**
```bash
curl http://localhost:8000/health
```

**Expected response:**
```json
{"status": "healthy"}
```

---

### 5️⃣ Access the Application

🌐 **Frontend:** http://localhost:3000
📡 **Backend API:** http://localhost:8000
📚 **API Docs:** http://localhost:8000/docs

---

## 🔍 Monitoring and Logs

### View Logs (All Services)
```bash
docker compose -f docker-compose.dev.yml logs -f
```

### View Specific Service Logs
```bash
# Backend logs
docker compose -f docker-compose.dev.yml logs -f backend

# Frontend logs
docker compose -f docker-compose.dev.yml logs -f frontend

# Redis logs
docker compose -f docker-compose.dev.yml logs -f redis
```

### View Last 50 Lines
```bash
docker compose -f docker-compose.dev.yml logs --tail=50 backend
```

---

## 🛠️ Common Commands

### Stop All Services
```bash
docker compose -f docker-compose.dev.yml down
```

### Stop and Remove Volumes (Clean Reset)
```bash
docker compose -f docker-compose.dev.yml down -v
```

### Restart a Specific Service
```bash
docker compose -f docker-compose.dev.yml restart backend
```

### Rebuild After Code Changes
```bash
# Rebuild specific service
docker compose -f docker-compose.dev.yml build backend

# Rebuild and restart
docker compose -f docker-compose.dev.yml up -d --build backend
```

### Execute Commands Inside Container
```bash
# Access backend shell
docker compose -f docker-compose.dev.yml exec backend bash

# Access frontend shell
docker compose -f docker-compose.dev.yml exec frontend sh
```

---

## 🐛 Troubleshooting

### Backend Not Starting

**Check logs:**
```bash
docker compose -f docker-compose.dev.yml logs backend
```

**Common issues:**
- Missing API key in `.env`
- Port 8000 already in use
- Dependencies not installed

**Solution:**
```bash
# Rebuild backend
docker compose -f docker-compose.dev.yml build --no-cache backend
docker compose -f docker-compose.dev.yml up -d backend
```

### Frontend Not Starting

**Check logs:**
```bash
docker compose -f docker-compose.dev.yml logs frontend
```

**Common issues:**
- Port 3000 already in use
- Node modules not installed

**Solution:**
```bash
# Rebuild frontend
docker compose -f docker-compose.dev.yml build --no-cache frontend
docker compose -f docker-compose.dev.yml up -d frontend
```

### Redis Connection Issues

**Check Redis:**
```bash
docker compose -f docker-compose.dev.yml exec redis redis-cli ping
```

**Expected output:** `PONG`

**Restart Redis:**
```bash
docker compose -f docker-compose.dev.yml restart redis
```

### Port Already in Use

**Find and kill process using port:**
```bash
# For port 8000
lsof -ti:8000 | xargs kill -9

# For port 3000
lsof -ti:3000 | xargs kill -9
```

### Complete Reset

**Remove everything and start fresh:**
```bash
# Stop and remove containers, networks, volumes
docker compose -f docker-compose.dev.yml down -v

# Remove images
docker compose -f docker-compose.dev.yml down --rmi all

# Rebuild from scratch
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up
```

---

## 📊 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main UI |
| **Backend API** | http://localhost:8000 | REST API |
| **API Docs (Swagger)** | http://localhost:8000/docs | Interactive API documentation |
| **API Docs (ReDoc)** | http://localhost:8000/redoc | Alternative API docs |
| **Health Check** | http://localhost:8000/health | Backend health status |
| **Redis** | localhost:6379 | Cache storage |

---

## 🎯 Quick Test

After starting services, test the full stack:

1. **Backend Health:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Frontend:**
   - Open http://localhost:3000
   - You should see the RAG-Anything Studio home page

3. **API Docs:**
   - Open http://localhost:8000/docs
   - Try the `/health` endpoint

---

## 📝 Notes

- **Development Mode**: Uses hot-reload for both frontend and backend
- **Data Persistence**: Redis data is stored in Docker volume `redis_data`
- **File Storage**: Documents are stored in `./output` and `./rag_storage`
- **Logs**: All logs visible with `docker compose logs`

---

## ⚡ Performance Tips

1. **Allocate More Memory to Docker:**
   - Docker Desktop → Settings → Resources
   - Recommended: 4GB+ RAM

2. **Use SSD for Docker Volumes:**
   - Faster build and runtime performance

3. **Close Unnecessary Services:**
   - Only run what you need for testing

---

## 🔐 Security Notes

- **API Keys**: Never commit `.env` with real API keys
- **Production**: Use `docker-compose.yml` (not `.dev.yml`) for production
- **Firewall**: Ensure ports are properly secured in production

---

## 📚 Next Steps

After Docker is running, see **TESTING_GUIDE.md** for:
- Feature testing instructions
- API testing examples
- UI workflow testing

---

**Need Help?**
- Check logs: `docker compose -f docker-compose.dev.yml logs -f`
- View containers: `docker compose -f docker-compose.dev.yml ps`
- Restart: `docker compose -f docker-compose.dev.yml restart`
