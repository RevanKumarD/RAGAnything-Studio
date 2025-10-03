# 🚀 How to Run and Test RAG-Anything Studio

**Quick reference guide for running and testing the complete application**

---

## 🎯 Quick Start (5 Minutes)

### Option 1: Automated Start (Recommended)

```bash
cd /mnt/r/StartUp/RAG-Anything
./start.sh
```

The script will:
1. ✅ Check Docker installation
2. ✅ Create `.env` if needed
3. ✅ Build Docker images
4. ✅ Start all services
5. ✅ Show access URLs

### Option 2: Manual Start

```bash
# 1. Add OpenAI API key to backend/.env
nano backend/.env
# Update: LLM_BINDING_API_KEY=your-key-here

# 2. Build and start
docker compose -f docker-compose.dev.yml build
docker compose -f docker-compose.dev.yml up -d

# 3. Check status
docker compose -f docker-compose.dev.yml ps
```

---

## 🌐 Access URLs

Once services are running:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main user interface |
| **Backend** | http://localhost:8000 | API server |
| **API Docs** | http://localhost:8000/docs | Interactive Swagger UI |
| **Health** | http://localhost:8000/health | Health check endpoint |

---

## ✅ Verify Services Are Running

```bash
# Check all services
docker compose -f docker-compose.dev.yml ps

# Expected output:
# NAME                    STATUS              PORTS
# raganything-redis       Up (healthy)        0.0.0.0:6379->6379/tcp
# raganything-backend     Up (healthy)        0.0.0.0:8000->8000/tcp
# raganything-frontend    Up                  0.0.0.0:3000->3000/tcp

# Test backend health
curl http://localhost:8000/health
# Expected: {"status": "healthy"}
```

---

## 🧪 Quick Functionality Test (10 Minutes)

### 1. Test Frontend (2 min)

```bash
# Open in browser
open http://localhost:3000
# Or manually navigate to http://localhost:3000
```

**Expected:**
- ✅ Home page loads with navigation
- ✅ No console errors
- ✅ All menu items visible (Home, Analytics, Chat, Documents, etc.)

### 2. Test Document Upload (3 min)

```bash
# Create test file
echo "Artificial Intelligence is transforming technology." > test.txt

# Upload via UI:
# 1. Go to http://localhost:3000/upload
# 2. Drag test.txt or click Browse
# 3. Wait for upload and parsing
```

**Expected:**
- ✅ Progress bar shows 0% → 100%
- ✅ Status changes: Uploading → Parsing → Completed
- ✅ Success notification appears

### 3. Test Documents Page (2 min)

```bash
# Navigate to http://localhost:3000/documents
```

**Expected:**
- ✅ Uploaded document appears in list
- ✅ Shows filename, size, date, status
- ✅ Search box works
- ✅ Can view details modal
- ✅ Can delete document

### 4. Test Chat (3 min)

```bash
# Navigate to http://localhost:3000/chat
# Type: "What is in the uploaded document?"
# Press Enter
```

**Expected:**
- ✅ Message sends successfully
- ✅ Loading indicator appears
- ✅ AI response received (10-30 seconds)
- ✅ Source citations shown

---

## 📊 Test All Features (30 Minutes)

For comprehensive testing, follow **TESTING_GUIDE.md**:

```bash
# View the testing guide
cat TESTING_GUIDE.md
```

**Covers:**
1. ✅ Upload & Document Management (10 min)
2. ✅ RAG Chat Interface (5 min)
3. ✅ Knowledge Graph (5 min)
4. ✅ Vector Explorer (5 min)
5. ✅ Analytics Dashboard (3 min)
6. ✅ Settings Configuration (3 min)

---

## 🔍 View Logs

```bash
# All services
docker compose -f docker-compose.dev.yml logs -f

# Specific service
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f redis

# Last 50 lines
docker compose -f docker-compose.dev.yml logs --tail=50 backend
```

---

## 🛑 Stop Services

```bash
# Stop all services
docker compose -f docker-compose.dev.yml down

# Stop and remove volumes (clean reset)
docker compose -f docker-compose.dev.yml down -v
```

---

## 🐛 Troubleshooting

### Services Not Starting?

```bash
# Check logs
docker compose -f docker-compose.dev.yml logs

# Rebuild from scratch
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up -d
```

### Frontend Not Loading?

```bash
# Check if port 3000 is available
lsof -ti:3000

# Restart frontend
docker compose -f docker-compose.dev.yml restart frontend

# Check frontend logs
docker compose -f docker-compose.dev.yml logs frontend
```

### Backend Errors?

```bash
# Check backend logs
docker compose -f docker-compose.dev.yml logs backend

# Verify .env file
cat backend/.env | grep API_KEY

# Restart backend
docker compose -f docker-compose.dev.yml restart backend
```

### Database/Redis Issues?

```bash
# Check Redis
docker compose -f docker-compose.dev.yml exec redis redis-cli ping
# Expected: PONG

# Restart Redis
docker compose -f docker-compose.dev.yml restart redis
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **HOW_TO_RUN_AND_TEST.md** | This file - quick start guide |
| **DOCKER_QUICKSTART.md** | Detailed Docker setup and commands |
| **TESTING_GUIDE.md** | Comprehensive feature testing guide |
| **VERIFICATION_COMPLETE.md** | Complete feature verification report |
| **README.md** | Project overview and documentation |

---

## 🎯 Feature Checklist

Use this to verify all features are working:

### Core Features
- [ ] ✅ Document upload (single & multiple)
- [ ] ✅ Document list with search & filters
- [ ] ✅ Document details view
- [ ] ✅ Document deletion
- [ ] ✅ RAG chat with AI responses
- [ ] ✅ Source citations in chat
- [ ] ✅ Multiple query modes (Hybrid, Local, Global, Naive)
- [ ] ✅ Knowledge graph visualization
- [ ] ✅ Vector space explorer (2D/3D)
- [ ] ✅ Analytics dashboard
- [ ] ✅ Settings configuration

### UI Features
- [ ] ✅ Dark/Light theme toggle
- [ ] ✅ Responsive design
- [ ] ✅ Loading states
- [ ] ✅ Error handling
- [ ] ✅ Toast notifications
- [ ] ✅ Grid/List view toggle

### API Features
- [ ] ✅ All endpoints accessible at /docs
- [ ] ✅ Health check working
- [ ] ✅ Upload endpoint
- [ ] ✅ List documents endpoint
- [ ] ✅ Delete document endpoint
- [ ] ✅ Query endpoints
- [ ] ✅ Graph endpoints
- [ ] ✅ Vector endpoints

---

## 🚨 Important Notes

### Before Testing:

1. **OpenAI API Key Required:**
   - Must be set in `backend/.env`
   - Both LLM and embedding keys needed
   - Without valid keys, chat and processing will fail

2. **Docker Resources:**
   - Minimum: 4GB RAM allocated to Docker
   - Recommended: 8GB RAM for better performance
   - Check: Docker Desktop → Settings → Resources

3. **Ports Required:**
   - 3000 (Frontend)
   - 8000 (Backend)
   - 6379 (Redis)
   - Ensure these ports are not in use

### During Testing:

1. **First Query Slow:**
   - Initial queries take longer (30-60s)
   - Subsequent queries faster due to caching
   - Be patient!

2. **Document Processing:**
   - Small text files: 10-30 seconds
   - PDFs with images: 1-5 minutes
   - Large documents: May take longer

3. **Data Persistence:**
   - Redis data stored in Docker volume
   - Documents stored in `./output` folder
   - Survives container restarts
   - Lost if you run `down -v`

---

## 📞 Getting Help

### Check These First:

1. **Logs**
   ```bash
   docker compose -f docker-compose.dev.yml logs -f
   ```

2. **Service Status**
   ```bash
   docker compose -f docker-compose.dev.yml ps
   ```

3. **Health Check**
   ```bash
   curl http://localhost:8000/health
   ```

### Common Solutions:

| Problem | Solution |
|---------|----------|
| Services won't start | Check logs, rebuild with `--no-cache` |
| Frontend loads blank | Check browser console, restart frontend |
| Backend 500 errors | Check API key in .env, view backend logs |
| Slow responses | Increase Docker RAM, check API rate limits |
| Upload fails | Check file size/type, view backend logs |

---

## 🎉 Success Criteria

**Your setup is successful when:**

✅ All 3 Docker containers running and healthy
✅ Frontend loads at http://localhost:3000
✅ Backend health check returns `{"status": "healthy"}`
✅ Can upload a test document
✅ Document appears in documents list
✅ Chat interface returns AI responses
✅ No critical errors in logs

---

## 🔗 Quick Command Reference

```bash
# Start everything
./start.sh

# Or manually
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Check status
docker compose -f docker-compose.dev.yml ps

# Restart service
docker compose -f docker-compose.dev.yml restart backend

# Stop everything
docker compose -f docker-compose.dev.yml down

# Clean reset
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up -d
```

---

## 📖 Next Steps

After successful testing:

1. **Review Full Documentation**
   - Read TESTING_GUIDE.md for detailed feature testing
   - Check VERIFICATION_COMPLETE.md for feature list

2. **Customize Configuration**
   - Adjust settings in backend/.env
   - Modify parser settings
   - Configure query parameters

3. **Production Deployment**
   - Use docker-compose.yml (production config)
   - Set up HTTPS
   - Configure authentication
   - Optimize resource allocation

---

**Ready to test? Start with:**
```bash
./start.sh
```

**Then open:** http://localhost:3000

**Happy Testing!** 🚀
