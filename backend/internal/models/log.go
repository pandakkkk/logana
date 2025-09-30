package models

import (
	"time"
)

type Log struct {
	ID        string            `json:"id,omitempty"`
	Level     string            `json:"level"`
	Message   string            `json:"message"`
	Source    string            `json:"source"`
	Timestamp time.Time         `json:"timestamp"`
	Metadata  map[string]string `json:"metadata,omitempty"`
	CreatedAt time.Time         `json:"created_at"`
	UpdatedAt time.Time         `json:"updated_at"`
}
