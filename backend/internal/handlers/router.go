package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"time"

	"github.com/andreachizabas/thalu-principal/backend/internal/config"
	"github.com/andreachizabas/thalu-principal/backend/internal/services"
)

type RouterDependencies struct {
	Config  config.Config
	Catalog *services.CatalogService
	Logger  *slog.Logger
}

func NewRouter(deps RouterDependencies) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{
			"status": "ok",
			"time":   time.Now().UTC().Format(time.RFC3339),
		})
	})

	mux.HandleFunc("GET /api/v1/products/featured", func(w http.ResponseWriter, r *http.Request) {
		products, err := deps.Catalog.FeaturedProducts(r.Context())
		if err != nil {
			deps.Logger.Error("featured products failed", "error", err)
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "catalog unavailable"})
			return
		}
		writeJSON(w, http.StatusOK, products)
	})

	mux.HandleFunc("GET /api/v1/self-esteem-message", func(w http.ResponseWriter, r *http.Request) {
		message, err := deps.Catalog.SelfEsteemMessage(r.Context())
		if err != nil {
			deps.Logger.Error("self esteem message failed", "error", err)
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "message unavailable"})
			return
		}
		writeJSON(w, http.StatusOK, message)
	})

	return withLogging(deps.Logger, withCORS(deps.Config.CORSAllowedOrigins, mux))
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
	}
}

func withLogging(logger *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		logger.Info("request completed", "method", r.Method, "path", r.URL.Path, "duration_ms", time.Since(start).Milliseconds())
	})
}

func withCORS(allowedOrigins []string, next http.Handler) http.Handler {
	allowed := make(map[string]struct{}, len(allowedOrigins))
	for _, origin := range allowedOrigins {
		allowed[origin] = struct{}{}
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if _, ok := allowed[origin]; ok {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization,Idempotency-Key")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
