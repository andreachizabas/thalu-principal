package handlers_test

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/andreachizabas/thalu-principal/backend/internal/config"
	"github.com/andreachizabas/thalu-principal/backend/internal/domain"
	"github.com/andreachizabas/thalu-principal/backend/internal/handlers"
	"github.com/andreachizabas/thalu-principal/backend/internal/repositories"
	"github.com/andreachizabas/thalu-principal/backend/internal/services"
)

func TestFeaturedProductsEndpoint(t *testing.T) {
	router := handlers.NewRouter(handlers.RouterDependencies{
		Config:  config.Load(),
		Catalog: services.NewCatalogService(repositories.NewMemoryCatalogRepository()),
		Logger:  slog.Default(),
	})

	request := httptest.NewRequest(http.MethodGet, "/api/v1/products/featured", nil)
	response := httptest.NewRecorder()

	router.ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", response.Code)
	}

	var products []domain.Product
	if err := json.Unmarshal(response.Body.Bytes(), &products); err != nil {
		t.Fatalf("response is not valid product json: %v", err)
	}

	if len(products) == 0 {
		t.Fatal("expected seed products")
	}
}
