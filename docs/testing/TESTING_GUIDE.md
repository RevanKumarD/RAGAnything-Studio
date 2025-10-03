# 🧪 RAG-Anything Studio - Complete Testing Guide

This guide will walk you through testing all features of RAG-Anything Studio.

---

## 📋 Prerequisites

Before testing, ensure:
- ✅ Docker services are running (see `DOCKER_QUICKSTART.md`)
- ✅ Frontend accessible at http://localhost:3000
- ✅ Backend API accessible at http://localhost:8000
- ✅ OpenAI API key configured in `backend/.env`

**Quick health check:**
```bash
curl http://localhost:8000/health
# Expected: {"status": "healthy"}
```

---

## 🎯 Testing Workflow (Recommended Order)

### 1️⃣ **Upload & Document Management** (10 minutes)
### 2️⃣ **RAG Chat Interface** (5 minutes)
### 3️⃣ **Knowledge Graph Visualization** (5 minutes)
### 4️⃣ **Vector Space Explorer** (5 minutes)
### 5️⃣ **Analytics Dashboard** (3 minutes)
### 6️⃣ **Settings Configuration** (3 minutes)

**Total Time:** ~30 minutes

---

## 1️⃣ Upload & Document Management (10 min)

### Test Document Upload

1. **Navigate to Upload Page**
   - Open http://localhost:3000/upload
   - You should see drag-and-drop upload area

2. **Prepare Test Documents**

   Create a simple test file:
   ```bash
   # Create test document
   echo "# AI and Machine Learning

   Artificial Intelligence (AI) is transforming technology.
   Machine Learning is a subset of AI that enables systems to learn.
   Deep Learning uses neural networks for complex tasks.

   ## Applications
   - Natural Language Processing
   - Computer Vision
   - Recommendation Systems" > test_ai_doc.txt
   ```

3. **Upload Test Document**
   - Drag `test_ai_doc.txt` to upload area, OR
   - Click "Browse Files" and select file
   - **Expected:** Progress bar shows 0% → 50% (upload) → 100% (parsing)
   - **Status:** Should show "Completed" or "Processing"

4. **Test Multiple File Upload**
   - Create 2-3 more test files
   - Select all and upload together
   - **Expected:** All files show individual progress bars

---

### Test Document List & Search

1. **Navigate to Documents Page**
   - Open http://localhost:3000/documents
   - Click "Refresh" button if needed

2. **Verify Document List**
   - **Expected:** See uploaded documents in grid/list view
   - Each card shows:
     - ✅ Filename
     - ✅ File size
     - ✅ Upload date
     - ✅ Status badge (Completed/Processing/Failed)
     - ✅ Chunks count (if processed)
     - ✅ Entities count (if processed)

3. **Test Search Functionality**
   - Type "test" in search box
   - **Expected:** Only matching documents shown
   - Clear search
   - **Expected:** All documents reappear

4. **Test Status Filter**
   - Select "Completed" from status dropdown
   - **Expected:** Only completed documents shown
   - Select "All Status"
   - **Expected:** All documents shown again

5. **Test View Modes**
   - Click grid icon (⊞)
   - **Expected:** Documents in grid layout
   - Click list icon (≡)
   - **Expected:** Documents in list layout

---

### Test Document Details

1. **View Document Details**
   - Hover over a document card
   - Click three-dot menu (⋮)
   - Select "View Details"
   - **Expected:** Modal opens showing:
     - ✅ File information (size, type, upload date)
     - ✅ Document ID
     - ✅ Processing status
     - ✅ Chunks and entities count
     - ✅ Content preview (if available)

2. **Test Document Actions**
   - Click "Download Original"
   - **Expected:** Download starts (or toast notification)
   - Click "View in Graph"
   - **Expected:** Redirects to graph view

3. **Close Modal**
   - Click outside modal or X button
   - **Expected:** Modal closes

---

### Test Document Deletion

1. **Delete a Document**
   - Hover over test document
   - Click three-dot menu (⋮)
   - Select "Delete"
   - **Expected:** Confirmation dialog appears

2. **Confirm Deletion**
   - Read warning message
   - Click "Delete" button
   - **Expected:**
     - Success toast notification
     - Document removed from list
     - Count updated

3. **Cancel Deletion**
   - Try deleting another document
   - Click "Cancel" in dialog
   - **Expected:** Document remains in list

---

## 2️⃣ RAG Chat Interface (5 min)

### Test Basic Chat

1. **Navigate to Chat**
   - Open http://localhost:3000/chat
   - You should see chat interface with input box

2. **Send First Query**
   - Type: "What is machine learning?"
   - Click Send or press Enter
   - **Expected:**
     - Message appears in chat
     - Loading indicator shows
     - AI response appears (may take 10-30 seconds)
     - Source documents shown (if available)

3. **Test Query Modes**
   - Click mode dropdown (Hybrid/Local/Global/Naive)
   - Select "Local"
   - Send query: "Tell me about AI applications"
   - **Expected:** Response uses local context

4. **Test VLM Enhancement**
   - Toggle "Enable VLM" switch
   - Send query: "Explain the concepts in detail"
   - **Expected:** Enhanced response with vision model

---

### Test Chat Features

1. **Test Source Display**
   - Look for source citations in responses
   - **Expected:** Each source shows:
     - Document name
     - Relevance score
     - Content snippet

2. **Test Multiple Messages**
   - Send 3-4 follow-up questions
   - **Expected:** Conversation flows naturally
   - Previous context considered

3. **Test Settings Panel**
   - Click settings icon
   - Adjust temperature (0.0 to 1.0)
   - Adjust top K (5 to 50)
   - **Expected:** Settings save and apply

4. **Test Chat Clear**
   - Click "New Chat" or clear button
   - **Expected:** Chat history cleared

---

## 3️⃣ Knowledge Graph Visualization (5 min)

### Test Graph Display

1. **Navigate to Graph**
   - Open http://localhost:3000/graph
   - **Expected:** Loading indicator → Graph visualization

2. **Verify Graph Elements**
   - **Expected to see:**
     - ✅ Nodes (entities) as circles
     - ✅ Edges (relationships) as lines
     - ✅ Labels on nodes
     - ✅ Color coding by entity type

3. **Test Graph Interactions**
   - **Zoom:** Mouse wheel or pinch
   - **Pan:** Click and drag
   - **Select Node:** Click on a node
   - **Expected:** Node highlights, details shown

---

### Test Graph Controls

1. **Test Layout Options**
   - Click layout dropdown
   - Try: "Force-Directed", "Hierarchical", "Circular"
   - **Expected:** Graph rearranges

2. **Test Filters**
   - Use entity type filter
   - **Expected:** Only selected types shown
   - Clear filters
   - **Expected:** All nodes reappear

3. **Test Search**
   - Type entity name in search
   - **Expected:** Matching entities highlighted

4. **Test Export** (if available)
   - Click export button
   - **Expected:** Graph data downloads

---

## 4️⃣ Vector Space Explorer (5 min)

### Test Vector Visualization

1. **Navigate to Vectors**
   - Open http://localhost:3000/vectors
   - **Expected:** Loading → 3D scatter plot

2. **Verify Visualization**
   - **Expected to see:**
     - ✅ Points in 3D space
     - ✅ Color-coded clusters
     - ✅ Interactive rotation
     - ✅ Labels on hover

3. **Test 3D Controls**
   - **Rotate:** Click and drag
   - **Zoom:** Scroll wheel
   - **Pan:** Right-click and drag
   - **Hover:** See point details

---

### Test Vector Controls

1. **Test Dimension Toggle**
   - Switch between 2D and 3D
   - **Expected:** Visualization updates

2. **Test Projection Method**
   - Try: "UMAP", "t-SNE", "PCA"
   - **Expected:** Points redistribute

3. **Test Clustering**
   - Adjust number of clusters
   - **Expected:** Colors update

4. **Test Point Selection**
   - Click on a point
   - **Expected:** Details panel shows:
     - Content snippet
     - Document source
     - Cluster info

---

## 5️⃣ Analytics Dashboard (3 min)

### Test System Metrics

1. **Navigate to Analytics**
   - Open http://localhost:3000/analytics
   - **Expected:** Dashboard with metrics cards

2. **Verify Metrics Display**
   - **Expected cards:**
     - ✅ Total Documents
     - ✅ Text Chunks
     - ✅ Entities Extracted
     - ✅ Relationships
     - ✅ Total Queries
     - ✅ Average Query Time

3. **Test Refresh**
   - Click refresh button
   - **Expected:** Metrics update

4. **Test Charts** (if available)
   - Scroll down to charts section
   - **Expected:** Visual graphs of data

---

## 6️⃣ Settings Configuration (3 min)

### Test Settings Management

1. **Navigate to Settings**
   - Open http://localhost:3000/settings
   - **Expected:** Settings tabs/sections

2. **Test API Configuration**
   - View API URL setting
   - View API key field (should be masked)
   - **Note:** Don't change unless testing in isolation

3. **Test Model Selection**
   - View LLM model dropdown
   - View Vision model dropdown
   - View Embedding model dropdown
   - **Expected:** Current selections shown

4. **Test Parser Settings**
   - Check parser type (MinerU/Docling)
   - Check parse method (Auto/OCR/Text)
   - Toggle processing options:
     - Enable Image Processing
     - Enable Table Processing
     - Enable Equation Processing

5. **Test Query Settings**
   - Adjust default query mode
   - Toggle VLM enhancement
   - Adjust top K value
   - Adjust temperature

6. **Test Save Settings**
   - Make a small change
   - Click "Save Settings"
   - **Expected:** Success toast notification

7. **Test Reset**
   - Click "Reset to Defaults"
   - **Expected:** Confirmation dialog → Settings reset

---

## 🧪 API Testing (Advanced)

### Test with cURL

1. **Health Check**
   ```bash
   curl http://localhost:8000/health
   ```
   **Expected:** `{"status": "healthy"}`

2. **List Documents**
   ```bash
   curl http://localhost:8000/api/v1/documents/list
   ```
   **Expected:** JSON with documents array

3. **Get Document Details**
   ```bash
   curl http://localhost:8000/api/v1/documents/{document_id}
   ```
   Replace `{document_id}` with actual ID from list

4. **Query**
   ```bash
   curl -X POST http://localhost:8000/api/v1/query/ \
     -H "Content-Type: application/json" \
     -d '{"query": "What is AI?", "mode": "hybrid"}'
   ```

5. **Graph Stats**
   ```bash
   curl http://localhost:8000/api/v1/graph/stats
   ```

6. **Vector Stats**
   ```bash
   curl http://localhost:8000/api/v1/vectors/stats
   ```

---

### Test with Swagger UI

1. **Open API Docs**
   - Navigate to http://localhost:8000/docs
   - **Expected:** Interactive Swagger UI

2. **Test Endpoints**
   - Expand any endpoint
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"
   - **Expected:** Response shown below

3. **Explore All Endpoints**
   - Documents: Upload, List, Get, Delete
   - Query: Standard, Multimodal, History
   - Graph: Data, Search, Stats
   - Vectors: Projection, Search, Stats

---

## ✅ Feature Checklist

Use this checklist to verify all features:

### Documents (7/7)
- [ ] Upload single document
- [ ] Upload multiple documents
- [ ] View document list
- [ ] Search documents
- [ ] Filter by status
- [ ] View document details
- [ ] Delete document

### Chat (6/6)
- [ ] Send basic query
- [ ] View AI response
- [ ] See source citations
- [ ] Switch query modes
- [ ] Toggle VLM enhancement
- [ ] Clear chat history

### Graph (4/4)
- [ ] View knowledge graph
- [ ] Interact with nodes/edges
- [ ] Change layout
- [ ] Filter entities

### Vectors (4/4)
- [ ] View 3D vector plot
- [ ] Rotate and zoom
- [ ] Switch dimensions (2D/3D)
- [ ] Change projection method

### Analytics (2/2)
- [ ] View system metrics
- [ ] Refresh statistics

### Settings (5/5)
- [ ] View API configuration
- [ ] Select models
- [ ] Configure parser settings
- [ ] Adjust query settings
- [ ] Save and reset

---

## 🐛 Common Issues & Solutions

### Issue: "No documents found"
**Solution:**
1. Upload a test document first
2. Wait for processing to complete
3. Refresh the documents page

### Issue: "Query returns no results"
**Solution:**
1. Ensure documents are processed (status: Completed)
2. Try different query modes
3. Check if chunks were extracted (should show in document details)

### Issue: "Graph is empty"
**Solution:**
1. Upload and process documents first
2. Ensure entity extraction ran successfully
3. Refresh graph page

### Issue: "Slow responses"
**Solution:**
1. Check Docker resource allocation (4GB+ RAM recommended)
2. Reduce number of chunks (lower top K in settings)
3. Check OpenAI API rate limits

### Issue: "Upload fails"
**Solution:**
1. Check file size (< 50MB recommended)
2. Check supported formats (PDF, DOCX, TXT, images)
3. View backend logs: `docker compose -f docker-compose.dev.yml logs backend`

---

## 📊 Expected Results Summary

After complete testing, you should have:

- ✅ **3-5 test documents** uploaded and processed
- ✅ **Chat history** with multiple Q&A exchanges
- ✅ **Knowledge graph** with entities and relationships
- ✅ **Vector visualization** showing document embeddings
- ✅ **Analytics** showing accurate counts
- ✅ **Settings** configured to your preference

---

## 🎯 Performance Benchmarks

**Expected Performance:**
- Document upload: < 5 seconds for small files
- Document parsing: 10-60 seconds depending on size
- Query response: 5-30 seconds depending on complexity
- Graph rendering: < 3 seconds for 100 nodes
- Vector visualization: < 5 seconds for 500 points

---

## 📝 Testing Notes

**Create test_results.md:**
```markdown
# Test Results - [Date]

## Documents
- Uploaded: 5 files
- Processed: 5/5 successful
- Issues: None

## Chat
- Queries tested: 10
- Response quality: Good
- Sources shown: Yes
- Issues: None

## Graph
- Entities: 23
- Relationships: 15
- Visualization: Working
- Issues: None

## Vectors
- Points displayed: 156
- Clustering: Working
- Interactions: Smooth
- Issues: None

## Overall: ✅ All features working
```

---

## 🚀 Next Steps

After successful testing:

1. **Production Deployment:**
   - Use `docker-compose.yml` instead of `.dev.yml`
   - Configure production API keys
   - Set up HTTPS
   - Enable authentication

2. **Optimization:**
   - Adjust chunk size for your use case
   - Fine-tune query parameters
   - Configure caching settings

3. **Integration:**
   - Connect to your data sources
   - Customize UI theme
   - Add custom parsers

---

## 📞 Support

**If you encounter issues:**

1. **Check logs:**
   ```bash
   docker compose -f docker-compose.dev.yml logs -f
   ```

2. **Restart services:**
   ```bash
   docker compose -f docker-compose.dev.yml restart
   ```

3. **Review documentation:**
   - `VERIFICATION_COMPLETE.md` - Feature list
   - `DOCKER_QUICKSTART.md` - Setup guide
   - API docs at http://localhost:8000/docs

---

**Happy Testing!** 🎉
