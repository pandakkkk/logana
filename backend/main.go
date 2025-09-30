package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/sanjeevmurmu/logana/logana-backend/internal/config"
	"github.com/sanjeevmurmu/logana/logana-backend/internal/handler"
	"github.com/sanjeevmurmu/logana/logana-backend/internal/repository"
	"github.com/sanjeevmurmu/logana/logana-backend/internal/service"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	// Initialize Elasticsearch client
	esConfig, err := config.NewElasticsearchClient()
	if err != nil {
		log.Fatalf("Failed to create Elasticsearch client: %v", err)
	}

	// Initialize components
	logRepo := repository.NewLogRepository(esConfig)
	logService := service.NewLogService(logRepo)
	logHandler := handler.NewLogHandler(logService)

	// Set up Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Register routes
	logHandler.RegisterRoutes(r)

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
