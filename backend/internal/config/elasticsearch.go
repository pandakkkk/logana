package config

import (
	"crypto/tls"
	"net/http"
	"os"
	"time"

	"github.com/elastic/go-elasticsearch/v8"
)

const (
	defaultElasticsearchURL = "http://localhost:9200"
	defaultIndexName        = "logs"
)

// ElasticsearchConfig holds the Elasticsearch client configuration
type ElasticsearchConfig struct {
	Client    *elasticsearch.Client
	IndexName string
}

// NewElasticsearchClient creates and returns a new Elasticsearch client
func NewElasticsearchClient() (*ElasticsearchConfig, error) {
	url := getEnvOrDefault("ELASTICSEARCH_URL", defaultElasticsearchURL)
	username := os.Getenv("ELASTICSEARCH_USERNAME")
	password := os.Getenv("ELASTICSEARCH_PASSWORD")
	indexName := getEnvOrDefault("ELASTICSEARCH_INDEX", defaultIndexName)

	cfg := elasticsearch.Config{
		Addresses: []string{url},
		Username:  username,
		Password:  password,
		Transport: &http.Transport{
			MaxIdleConnsPerHost:   10,
			ResponseHeaderTimeout: time.Second * 10,
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: getEnvOrDefault("ELASTICSEARCH_INSECURE", "false") == "true",
			},
		},
	}

	client, err := elasticsearch.NewClient(cfg)
	if err != nil {
		return nil, err
	}

	return &ElasticsearchConfig{
		Client:    client,
		IndexName: indexName,
	}, nil
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
