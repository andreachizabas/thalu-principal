package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/andreachizabas/thalu-principal/backend/internal/config"
	"github.com/andreachizabas/thalu-principal/backend/internal/database"
	"github.com/andreachizabas/thalu-principal/backend/internal/handlers"
	"github.com/andreachizabas/thalu-principal/backend/internal/repositories"
	"github.com/andreachizabas/thalu-principal/backend/internal/services"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	cfg := config.Load()

	ctx := context.Background()
	repository := repositories.CatalogRepository(repositories.NewMemoryCatalogRepository())

	pool, err := database.Open(ctx, cfg.DatabaseURL)
	if err != nil {
		if errors.Is(err, database.ErrMissingDatabaseURL) {
			logger.Warn("DATABASE_URL not configured; using seed catalog data for development")
		} else {
			logger.Warn("database unavailable; using seed catalog data for development", "error", err)
		}
	} else {
		defer pool.Close()
		repository = repositories.NewPostgresCatalogRepository(pool)
		logger.Info("database connection ready")
	}

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handlers.NewRouter(handlers.RouterDependencies{Config: cfg, Catalog: services.NewCatalogService(repository), Logger: logger}),
		ReadTimeout:  cfg.ReadTimeout,
		WriteTimeout: cfg.WriteTimeout,
	}

	go func() {
		logger.Info("api listening", "port", cfg.Port, "environment", cfg.AppEnv)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("server failed", "error", err)
			os.Exit(1)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		logger.Error("graceful shutdown failed", "error", err)
	}
}
