# Build stage
FROM golang:1.21-alpine AS builder

# Install git and build dependencies
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Download dependencies first (better caching)
COPY go.mod go.sum ./
RUN go mod download

# Copy only necessary files
COPY internal/ internal/
COPY main.go .

# Build the application with optimizations
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s" \
    -o main .

# Final stage
FROM alpine:latest

# Add ca certificates and curl
RUN apk --no-cache add ca-certificates curl

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/main .

# Set environment variables
ENV ELASTICSEARCH_URL=http://elasticsearch:9200 \
    GIN_MODE=debug \
    ELASTICSEARCH_INDEX=logs \
    LOG_LEVEL=debug

# Expose port
EXPOSE 8080

# Command to run
CMD ["./main"] 