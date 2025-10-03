FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and setup files
COPY requirements.txt .
COPY setup.py .
COPY pyproject.toml .
COPY MANIFEST.in .

# Copy raganything package
COPY raganything ./raganything

# Install Python dependencies and raganything package
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install -e .

# Copy backend application
COPY backend/app ./app

# Create necessary directories
RUN mkdir -p /app/rag_storage /app/output /app/inputs

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
