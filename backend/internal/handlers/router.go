package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"log/slog"
	"net/http"
	"time"

	"github.com/andreachizabas/thalu-principal/backend/internal/config"
	"github.com/andreachizabas/thalu-principal/backend/internal/domain"
	"github.com/andreachizabas/thalu-principal/backend/internal/services"
)

type RouterDependencies struct {
	Config         config.Config
	Catalog        *services.CatalogService
	BeautyServices *services.BeautyServicesService
	Logger         *slog.Logger
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
	mux.HandleFunc("GET /api/v1/services", func(w http.ResponseWriter, r *http.Request) {
		items, err := deps.BeautyServices.ActiveServices(r.Context())
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "services unavailable"})
			return
		}
		writeJSON(w, http.StatusOK, items)
	})
	mux.HandleFunc("POST /api/v1/service-requests", func(w http.ResponseWriter, r *http.Request) {
		var input domain.ServiceRequestInput
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 32*1024)).Decode(&input); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request"})
			return
		}
		request, err := deps.BeautyServices.CreateRequest(r.Context(), input, newRequestID())
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "Revisa los datos y el servicio seleccionado."})
			return
		}
		writeJSON(w, http.StatusCreated, request)
	})
	mux.HandleFunc("GET /api/v1/admin/service-requests", func(w http.ResponseWriter, r *http.Request) {
		if !authorized(deps.Config.AdminAPIKey, r) {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
			return
		}
		items, err := deps.BeautyServices.Requests(r.Context())
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "requests unavailable"})
			return
		}
		writeJSON(w, http.StatusOK, items)
	})
	mux.HandleFunc("PATCH /api/v1/admin/service-requests/{id}", func(w http.ResponseWriter, r *http.Request) {
		if !authorized(deps.Config.AdminAPIKey, r) {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
			return
		}
		var body struct {
			Status string `json:"status"`
		}
		if json.NewDecoder(r.Body).Decode(&body) != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request"})
			return
		}
		item, err := deps.BeautyServices.UpdateStatus(r.Context(), r.PathValue("id"), body.Status)
		if err != nil {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "request not found"})
			return
		}
		writeJSON(w, http.StatusOK, item)
	})

	return withLogging(deps.Logger, withCORS(deps.Config.CORSAllowedOrigins, mux))
}

func authorized(key string, r *http.Request) bool {
	return key != "" && r.Header.Get("Authorization") == "Bearer "+key
}
func newRequestID() string {
	bytes := make([]byte, 8)
	if _, err := rand.Read(bytes); err != nil {
		return "THA-SOLICITUD"
	}
	return "THA-" + hex.EncodeToString(bytes)
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
