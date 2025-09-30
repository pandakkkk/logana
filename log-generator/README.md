# Log Generator

A command-line tool to generate and send sample logs to the Logana backend.

## Features

- Configurable log generation rate
- Multiple concurrent workers
- Batch sending support
- Real-time metrics
- Graceful shutdown
- Various log levels and sources
- Random but realistic log messages
- Customizable metadata

## Usage

```bash
# Build the tool
go build -o log-generator

# Run with default settings (10 logs/sec for 5 minutes)
./log-generator

# Run with custom settings
./log-generator \
  --backend="http://localhost:8080" \
  --rate=100 \
  --duration=1h \
  --concurrent=10 \
  --batch=5 \
  --metrics=true
```

## Command Line Options

| Flag        | Default               | Description                               |
|-------------|----------------------|-------------------------------------------|
| backend     | http://localhost:8080 | Backend API URL                           |
| rate        | 10                   | Number of logs to generate per second     |
| duration    | 5m                   | Duration to run (e.g., 5m, 1h)           |
| concurrent  | 5                    | Number of concurrent workers              |
| batch       | 1                    | Number of logs to send in each request    |
| metrics     | true                 | Show metrics while running                |

## Log Format

The generator creates logs with the following structure:

```json
{
  "level": "INFO|WARN|ERROR|DEBUG",
  "message": "Random message with variables",
  "source": "app-server|web-server|database|cache|auth-service",
  "timestamp": "2025-09-30T12:00:00Z",
  "metadata": {
    "host": "server-1",
    "region": "region-1",
    "instance_id": "abc123",
    "request_id": "xyz789",
    "response_time": "123"
  }
}
```

## Examples

1. Generate 1000 logs per second for 10 minutes:
```bash
./log-generator --rate=1000 --duration=10m
```

2. Use 20 concurrent workers with batch size of 10:
```bash
./log-generator --concurrent=20 --batch=10
```

3. Send logs to a different backend:
```bash
./log-generator --backend="http://api.example.com"
```

4. Run indefinitely until interrupted:
```bash
./log-generator --duration=0
```

## Building with Docker

```bash
# Build the image
docker build -t log-generator .

# Run with default settings
docker run log-generator

# Run with custom settings
docker run log-generator --rate=100 --duration=1h
```

## Development

1. Clone the repository:
```bash
git clone https://github.com/sanjeevmurmu/logana.git
cd logana/log-generator
```

2. Install dependencies:
```bash
go mod download
```

3. Build the tool:
```bash
go build
```

4. Run tests:
```bash
go test ./...
``` 