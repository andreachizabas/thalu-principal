package handlers_test

import (
	"bytes"
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
		Config:         config.Load(),
		Catalog:        services.NewCatalogService(repositories.NewMemoryCatalogRepository()),
		BeautyServices: services.NewBeautyServicesService(repositories.NewMemoryBeautyServicesRepository()),
		Logger:         slog.Default(),
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

func TestServiceRequestEndpointValidatesAndCreatesRequest(t *testing.T) {
	router := handlers.NewRouter(handlers.RouterDependencies{
		Config: config.Load(), Catalog: services.NewCatalogService(repositories.NewMemoryCatalogRepository()),
		BeautyServices: services.NewBeautyServicesService(repositories.NewMemoryBeautyServicesRepository()), Logger: slog.Default(),
	})
	body := []byte(`{"fullName":"Andrea Chizabas","phone":"3001234567","city":"Manizales","address":"Calle 1 # 2-3","neighborhood":"Centro","serviceId":"manicure-tradicional"}`)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, httptest.NewRequest(http.MethodPost, "/api/v1/service-requests", bytes.NewReader(body)))
	if response.Code != http.StatusCreated {
		t.Fatalf("expected status 201, got %d", response.Code)
	}
	var request domain.ServiceRequest
	if err := json.Unmarshal(response.Body.Bytes(), &request); err != nil {
		t.Fatalf("invalid request response: %v", err)
	}
	if request.Status != "Nueva" || request.ID == "" {
		t.Fatalf("unexpected request: %+v", request)
	}
}

func TestServiceRequestEndpointRejectsUnsupportedCity(t *testing.T) {
	router := handlers.NewRouter(handlers.RouterDependencies{
		Config: config.Load(), Catalog: services.NewCatalogService(repositories.NewMemoryCatalogRepository()),
		BeautyServices: services.NewBeautyServicesService(repositories.NewMemoryBeautyServicesRepository()), Logger: slog.Default(),
	})
	body := []byte(`{"fullName":"Andrea","phone":"3001234567","city":"Bogota","address":"Calle 1","neighborhood":"Centro","serviceId":"manicure-tradicional"}`)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, httptest.NewRequest(http.MethodPost, "/api/v1/service-requests", bytes.NewReader(body)))
	if response.Code != http.StatusBadRequest {
		t.Fatalf("expected status 400, got %d", response.Code)
	}
}
