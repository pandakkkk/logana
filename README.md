# Logana - Elasticsearch Log Analyzer

A web application for analyzing and viewing Elasticsearch indices and their documents.

## Quick Start Guide

### 1. Start Core Services

```bash
# Start all services (Elasticsearch, Backend, Frontend)
docker compose up -d

# Wait for services to be ready (about 30 seconds)
# You can check logs while waiting:
docker compose logs -f
```

### 2. Verify Services

Check if all services are running:
```bash
# Check service status
docker compose ps

# Check individual service health
curl http://localhost:9200    # Elasticsearch
curl http://localhost:8080/health    # Backend
curl http://localhost:3000    # Frontend
```

### 3. Generate Sample Logs

```bash
# Go to log generator directory
cd log-generator

# Build the log generator
go build -o log-generator

# Run with default settings (10 logs/sec for 5 minutes)
./log-generator

# Or run with custom settings
./log-generator \
  --rate=100 \
  --duration=1h \
  --concurrent=10 \
  --batch=5
```

### 4. View Logs

1. Open http://localhost:3000 in your browser
2. You should see logs appearing in real-time
3. Use the search and filter options to analyze logs

## Service URLs

- Frontend UI: http://localhost:3000
- Backend API: http://localhost:8080
- Elasticsearch: http://localhost:9200

## Sample Log Types

The log generator creates various types of logs:

1. **Authentication Logs**:
```json
{
  "level": "INFO",
  "message": "User logged in successfully",
  "source": "auth-service",
  "metadata": {
    "user_id": "user_789",
    "ip_address": "192.168.1.100",
    "login_type": "2fa"
  }
}
```

2. **Performance Logs**:
```json
{
  "level": "WARN",
  "message": "Slow query detected",
  "source": "database",
  "metadata": {
    "query_id": "q_123456",
    "execution_time": "1532ms",
    "cpu_usage": "85%"
  }
}
```

## Stopping Services

```bash
# Stop log generator (if running)
Ctrl+C

# Stop all services
docker compose down

# To also remove data volumes
docker compose down -v
```

## Troubleshooting

### 1. Services Won't Start

Check if ports are available:
```bash
# Check port usage
lsof -i :9200  # Elasticsearch
lsof -i :8080  # Backend
lsof -i :3000  # Frontend
```

### 2. Can't See Logs

Check if logs are being generated:
```bash
# Check log generator output
./log-generator --rate=1 --duration=1m

# Check backend logs
docker compose logs backend

# Check Elasticsearch indices
curl http://localhost:9200/_cat/indices
```

### 3. Performance Issues

If the system is slow:
```bash
# Check resource usage
docker stats

# Reduce log generation rate
./log-generator --rate=10 --concurrent=2
```

## Development Setup

### Backend Development
```bash
cd backend
go mod download
go run main.go
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Log Generator Development
```bash
cd log-generator
go mod download
go run main.go
```

## Environment Variables

Create a `.env` file in the backend directory:
```env
ELASTICSEARCH_URL=http://localhost:9200
GIN_MODE=release
```

## Additional Commands

### Docker Commands
```bash
# Rebuild specific service
docker compose up -d --build backend

# View service logs
docker compose logs -f backend
docker compose logs -f frontend

# Get shell access
docker compose exec backend sh
```

### Log Generator Commands
```bash
# Generate high volume of logs
./log-generator --rate=1000 --duration=10m

# Generate logs indefinitely
./log-generator --duration=0

# Generate logs with specific batch size
./log-generator --batch=10 --rate=100
```