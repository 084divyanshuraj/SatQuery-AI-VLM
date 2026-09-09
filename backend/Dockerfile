# SatQuery AI - Production Backend Dockerfile (SIH PS-26167)
FROM python:3.11-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=7001 \
    HOST=0.0.0.0

WORKDIR /app

# Install essential C-level geospatial libraries & compilation tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    gdal-bin \
    libgdal-dev \
    libproj-dev \
    && rm -rf /var/lib/apt/lists/*

# Layer caching optimization: Install dependencies before source code
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

EXPOSE 7001

# Healthcheck for orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:7001/api/health || exit 1

CMD ["uvicorn", "main.py:app", "--host", "0.0.0.0", "--port", "7001"]
