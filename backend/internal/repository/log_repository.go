package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/sanjeevmurmu/logana/logana-backend/internal/config"
	"github.com/sanjeevmurmu/logana/logana-backend/internal/models"
)

type LogRepository interface {
	Create(ctx context.Context, log *models.Log) error
	GetAll(ctx context.Context, page, limit int) ([]models.Log, error)
	GetByID(ctx context.Context, id string) (*models.Log, error)
	Update(ctx context.Context, log *models.Log) error
	Delete(ctx context.Context, id string) error
	Search(ctx context.Context, query string, page, limit int) ([]models.Log, error)
}

type logRepository struct {
	es *config.ElasticsearchConfig
}

func NewLogRepository(es *config.ElasticsearchConfig) LogRepository {
	return &logRepository{es: es}
}

func (r *logRepository) Create(ctx context.Context, log *models.Log) error {
	body, err := json.Marshal(log)
	if err != nil {
		return fmt.Errorf("error marshaling log: %w", err)
	}

	res, err := r.es.Client.Index(
		r.es.IndexName,
		strings.NewReader(string(body)),
		r.es.Client.Index.WithContext(ctx),
		r.es.Client.Index.WithRefresh("true"),
	)
	if err != nil {
		return fmt.Errorf("error indexing log: %w", err)
	}
	defer res.Body.Close()

	if res.IsError() {
		return fmt.Errorf("error indexing log: %s", res.String())
	}

	return nil
}

func (r *logRepository) GetAll(ctx context.Context, page, limit int) ([]models.Log, error) {
	from := (page - 1) * limit

	query := map[string]interface{}{
		"from": from,
		"size": limit,
		"sort": []map[string]interface{}{
			{"timestamp": map[string]string{"order": "desc"}},
		},
	}

	var buf strings.Builder
	if err := json.NewEncoder(&buf).Encode(query); err != nil {
		return nil, fmt.Errorf("error encoding query: %w", err)
	}

	res, err := r.es.Client.Search(
		r.es.Client.Search.WithContext(ctx),
		r.es.Client.Search.WithIndex(r.es.IndexName),
		r.es.Client.Search.WithBody(strings.NewReader(buf.String())),
	)
	if err != nil {
		return nil, fmt.Errorf("error searching logs: %w", err)
	}
	defer res.Body.Close()

	if res.IsError() {
		return nil, fmt.Errorf("error searching logs: %s", res.String())
	}

	var result map[string]interface{}
	if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error parsing response: %w", err)
	}

	hits := result["hits"].(map[string]interface{})["hits"].([]interface{})
	logs := make([]models.Log, len(hits))

	for i, hit := range hits {
		source := hit.(map[string]interface{})["_source"]
		sourceBytes, err := json.Marshal(source)
		if err != nil {
			return nil, fmt.Errorf("error marshaling hit source: %w", err)
		}

		if err := json.Unmarshal(sourceBytes, &logs[i]); err != nil {
			return nil, fmt.Errorf("error unmarshaling log: %w", err)
		}
	}

	return logs, nil
}

func (r *logRepository) GetByID(ctx context.Context, id string) (*models.Log, error) {
	res, err := r.es.Client.Get(
		r.es.IndexName,
		id,
		r.es.Client.Get.WithContext(ctx),
	)
	if err != nil {
		return nil, fmt.Errorf("error getting log: %w", err)
	}
	defer res.Body.Close()

	if res.IsError() {
		if res.StatusCode == 404 {
			return nil, nil
		}
		return nil, fmt.Errorf("error getting log: %s", res.String())
	}

	var result map[string]interface{}
	if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error parsing response: %w", err)
	}

	source := result["_source"]
	sourceBytes, err := json.Marshal(source)
	if err != nil {
		return nil, fmt.Errorf("error marshaling source: %w", err)
	}

	var log models.Log
	if err := json.Unmarshal(sourceBytes, &log); err != nil {
		return nil, fmt.Errorf("error unmarshaling log: %w", err)
	}

	return &log, nil
}

func (r *logRepository) Update(ctx context.Context, log *models.Log) error {
	body, err := json.Marshal(log)
	if err != nil {
		return fmt.Errorf("error marshaling log: %w", err)
	}

	res, err := r.es.Client.Update(
		r.es.IndexName,
		log.ID,
		strings.NewReader(fmt.Sprintf(`{"doc":%s}`, string(body))),
		r.es.Client.Update.WithContext(ctx),
		r.es.Client.Update.WithRefresh("true"),
	)
	if err != nil {
		return fmt.Errorf("error updating log: %w", err)
	}
	defer res.Body.Close()

	if res.IsError() {
		return fmt.Errorf("error updating log: %s", res.String())
	}

	return nil
}

func (r *logRepository) Delete(ctx context.Context, id string) error {
	res, err := r.es.Client.Delete(
		r.es.IndexName,
		id,
		r.es.Client.Delete.WithContext(ctx),
		r.es.Client.Delete.WithRefresh("true"),
	)
	if err != nil {
		return fmt.Errorf("error deleting log: %w", err)
	}
	defer res.Body.Close()

	if res.IsError() {
		return fmt.Errorf("error deleting log: %s", res.String())
	}

	return nil
}

func (r *logRepository) Search(ctx context.Context, query string, page, limit int) ([]models.Log, error) {
	from := (page - 1) * limit

	searchQuery := map[string]interface{}{
		"from": from,
		"size": limit,
		"query": map[string]interface{}{
			"multi_match": map[string]interface{}{
				"query":  query,
				"fields": []string{"message", "source", "level", "metadata"},
			},
		},
		"sort": []map[string]interface{}{
			{"timestamp": map[string]string{"order": "desc"}},
		},
	}

	var buf strings.Builder
	if err := json.NewEncoder(&buf).Encode(searchQuery); err != nil {
		return nil, fmt.Errorf("error encoding query: %w", err)
	}

	res, err := r.es.Client.Search(
		r.es.Client.Search.WithContext(ctx),
		r.es.Client.Search.WithIndex(r.es.IndexName),
		r.es.Client.Search.WithBody(strings.NewReader(buf.String())),
	)
	if err != nil {
		return nil, fmt.Errorf("error searching logs: %w", err)
	}
	defer res.Body.Close()

	if res.IsError() {
		return nil, fmt.Errorf("error searching logs: %s", res.String())
	}

	var result map[string]interface{}
	if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error parsing response: %w", err)
	}

	hits := result["hits"].(map[string]interface{})["hits"].([]interface{})
	logs := make([]models.Log, len(hits))

	for i, hit := range hits {
		source := hit.(map[string]interface{})["_source"]
		sourceBytes, err := json.Marshal(source)
		if err != nil {
			return nil, fmt.Errorf("error marshaling hit source: %w", err)
		}

		if err := json.Unmarshal(sourceBytes, &logs[i]); err != nil {
			return nil, fmt.Errorf("error unmarshaling log: %w", err)
		}
	}

	return logs, nil
}
