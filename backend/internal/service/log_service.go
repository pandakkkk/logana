package service

import (
	"context"

	"github.com/sanjeevmurmu/logana/logana-backend/internal/models"
	"github.com/sanjeevmurmu/logana/logana-backend/internal/repository"
)

type LogService interface {
	CreateLog(ctx context.Context, log *models.Log) error
	GetLogs(ctx context.Context, page, limit int) ([]models.Log, error)
	GetLogByID(ctx context.Context, id string) (*models.Log, error)
	UpdateLog(ctx context.Context, log *models.Log) error
	DeleteLog(ctx context.Context, id string) error
	SearchLogs(ctx context.Context, query string, page, limit int) ([]models.Log, error)
}

type logService struct {
	repo repository.LogRepository
}

func NewLogService(repo repository.LogRepository) LogService {
	return &logService{repo: repo}
}

func (s *logService) CreateLog(ctx context.Context, log *models.Log) error {
	return s.repo.Create(ctx, log)
}

func (s *logService) GetLogs(ctx context.Context, page, limit int) ([]models.Log, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	return s.repo.GetAll(ctx, page, limit)
}

func (s *logService) GetLogByID(ctx context.Context, id string) (*models.Log, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *logService) UpdateLog(ctx context.Context, log *models.Log) error {
	return s.repo.Update(ctx, log)
}

func (s *logService) DeleteLog(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

func (s *logService) SearchLogs(ctx context.Context, query string, page, limit int) ([]models.Log, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	return s.repo.Search(ctx, query, page, limit)
}
