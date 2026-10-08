package config

import (
	"os"
	"strings"
	"time"
)

type Config struct {
	AppEnv             string
	Port               string
	DatabaseURL        string
	CORSAllowedOrigins []string
	AdminAPIKey        string
	ReadTimeout        time.Duration
	WriteTimeout       time.Duration
}

func Load() Config {
	return Config{
		AppEnv:             getEnv("APP_ENV", "development"),
		Port:               getEnv("PORT", "8080"),
		DatabaseURL:        os.Getenv("DATABASE_URL"),
		CORSAllowedOrigins: splitCSV(getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000")),
		AdminAPIKey:        os.Getenv("ADMIN_API_KEY"),
		ReadTimeout:        10 * time.Second,
		WriteTimeout:       10 * time.Second,
	}
}

func getEnv(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func splitCSV(value string) []string {
	parts := strings.Split(value, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}
