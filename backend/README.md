# Logana Backend

This is the backend service for the Logana log analytics platform, built with Go.

## Prerequisites

- Go 1.21 or later
- PostgreSQL 13 or later
- Make (optional, for using Makefile commands)

## Project Structure

```
logana-backend/
├── internal/
│   ├── handler/     # HTTP handlers
│   ├── models/      # Data models
│   ├── repository/  # Data access layer
│   └── service/     # Business logic
├── main.go         # Application entry point
├── go.mod          # Go module file
└── .env            # Environment variables (create from .env.example)
```

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd logana-backend
   ```

2. Install dependencies:
   ```bash
   go mod download
   ```

3. Create and configure your `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Create a PostgreSQL database:
   ```bash
   createdb logana
   ```

## Running the Application

1. Start the server:
   ```bash
   go run main.go
   ```

The server will start on port 8080 by default (configurable via PORT environment variable).

## API Endpoints

### Logs

- `POST /api/logs` - Create a new log entry
- `GET /api/logs` - List all logs (with pagination)
- `GET /api/logs/:id` - Get a specific log by ID
- `PUT /api/logs/:id` - Update a log entry
- `DELETE /api/logs/:id` - Delete a log entry

### Health Check

- `GET /health` - Check server health

## Environment Variables

- `PORT` - Server port (default: 8080)
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres)
- `DB_NAME` - Database name (default: logana)
- `LOG_LEVEL` - Logging level (default: debug)

## Development

The project follows standard Go project layout and clean architecture principles:

- `handler` - HTTP request handlers
- `service` - Business logic layer
- `repository` - Data access layer
- `models` - Data models and types

## License

MIT 