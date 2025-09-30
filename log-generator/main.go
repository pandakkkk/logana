package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"sync/atomic"
	"syscall"
	"time"
)

type LogEntry struct {
	Level     string            `json:"level"`
	Message   string            `json:"message"`
	Source    string            `json:"source"`
	Timestamp time.Time         `json:"timestamp"`
	Metadata  map[string]string `json:"metadata,omitempty"`
}

var (
	logLevels = []string{"INFO", "WARN", "ERROR", "DEBUG"}
	sources   = []string{"app-server", "web-server", "database", "cache", "auth-service"}
	messages  = []string{
		"User logged in successfully",
		"Failed to connect to database",
		"Cache miss for key: %s",
		"Request processed in %dms",
		"Memory usage at %d%%",
		"CPU load average: %f",
		"Network latency: %dms",
		"Authentication failed for user: %s",
		"Rate limit exceeded for IP: %s",
		"Successfully processed batch of %d items",
	}
)

func generateRandomLog() LogEntry {
	level := logLevels[rand.Intn(len(logLevels))]
	source := sources[rand.Intn(len(sources))]
	messageTemplate := messages[rand.Intn(len(messages))]

	var message string
	switch {
	case strings.Contains(messageTemplate, "%s"):
		message = fmt.Sprintf(messageTemplate, generateRandomString(8))
	case strings.Contains(messageTemplate, "%d"):
		message = fmt.Sprintf(messageTemplate, rand.Intn(1000))
	case strings.Contains(messageTemplate, "%f"):
		message = fmt.Sprintf(messageTemplate, rand.Float64()*4)
	default:
		message = messageTemplate
	}

	metadata := map[string]string{
		"host":          fmt.Sprintf("server-%d", rand.Intn(5)+1),
		"region":        fmt.Sprintf("region-%d", rand.Intn(3)+1),
		"instance_id":   generateRandomString(10),
		"request_id":    generateRandomString(16),
		"response_time": fmt.Sprintf("%d", rand.Intn(500)),
	}

	return LogEntry{
		Level:     level,
		Message:   message,
		Source:    source,
		Timestamp: time.Now(),
		Metadata:  metadata,
	}
}

func generateRandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}

func sendLog(client *http.Client, backendURL string, log LogEntry) error {
	jsonData, err := json.Marshal(log)
	if err != nil {
		return fmt.Errorf("failed to marshal log: %v", err)
	}

	resp, err := client.Post(backendURL+"/api/logs", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to send log: %v", err)
	}
	defer resp.Body.Close()

	// Read response body for error details
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %v", err)
	}

	if resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("unexpected status code: %d, body: %s", resp.StatusCode, string(body))
	}

	return nil
}

func main() {
	var (
		backendURL  = flag.String("backend", "http://localhost:8080", "Backend API URL")
		ratePerSec  = flag.Int("rate", 10, "Number of logs to generate per second")
		duration    = flag.Duration("duration", 5*time.Minute, "Duration to run (e.g., 5m, 1h)")
		concurrent  = flag.Int("concurrent", 5, "Number of concurrent workers")
		batchSize   = flag.Int("batch", 1, "Number of logs to send in each request")
		showMetrics = flag.Bool("metrics", true, "Show metrics while running")
	)
	flag.Parse()

	// Initialize random seed
	rand.Seed(time.Now().UnixNano())

	// Create HTTP client with longer timeout
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	// Create channels for coordination
	logChan := make(chan LogEntry, *ratePerSec**concurrent)
	done := make(chan bool)
	var wg sync.WaitGroup

	// Create atomic counter for successful sends
	var successCount int64

	// Start metrics reporter
	if *showMetrics {
		go func() {
			ticker := time.NewTicker(1 * time.Second)
			defer ticker.Stop()
			start := time.Now()

			for {
				select {
				case <-ticker.C:
					elapsed := time.Since(start).Seconds()
					rate := float64(atomic.LoadInt64(&successCount)) / elapsed
					fmt.Printf("\rLogs sent: %d, Rate: %.2f logs/sec", atomic.LoadInt64(&successCount), rate)
				case <-done:
					return
				}
			}
		}()
	}

	// Start worker pool
	for i := 0; i < *concurrent; i++ {
		wg.Add(1)
		go func(workerID int) {
			defer wg.Done()
			batch := make([]LogEntry, 0, *batchSize)

			for log := range logChan {
				batch = append(batch, log)

				if len(batch) >= *batchSize {
					if err := sendLog(client, *backendURL, batch[0]); err != nil {
						fmt.Printf("\nWorker %d: Error sending batch: %v", workerID, err)
					} else {
						atomic.AddInt64(&successCount, 1)
					}
					batch = batch[:0]
				}
			}

			// Send remaining logs in batch
			if len(batch) > 0 {
				if err := sendLog(client, *backendURL, batch[0]); err != nil {
					fmt.Printf("\nWorker %d: Error sending final batch: %v", workerID, err)
				} else {
					atomic.AddInt64(&successCount, 1)
				}
			}
		}(i)
	}

	// Set up signal handling
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Start log generator
	ticker := time.NewTicker(time.Second / time.Duration(*ratePerSec))
	defer ticker.Stop()

	start := time.Now()
	fmt.Printf("Starting log generator:\n- Backend URL: %s\n- Rate: %d logs/sec\n- Duration: %s\n- Workers: %d\n- Batch Size: %d\n\n",
		*backendURL, *ratePerSec, *duration, *concurrent, *batchSize)

	for {
		select {
		case <-ticker.C:
			if time.Since(start) > *duration {
				goto cleanup
			}
			logChan <- generateRandomLog()
		case <-sigChan:
			fmt.Println("\nReceived interrupt signal, shutting down...")
			goto cleanup
		}
	}

cleanup:
	close(logChan)
	close(done)
	wg.Wait()
	fmt.Printf("\nLog generator stopped. Total logs sent: %d\n", atomic.LoadInt64(&successCount))
}
