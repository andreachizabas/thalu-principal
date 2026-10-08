package repositories

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/andreachizabas/thalu-principal/backend/internal/domain"
)

var ErrServiceNotFound = errors.New("service not found")

type BeautyServicesRepository interface {
	ActiveBeautyServices(context.Context) ([]domain.BeautyService, error)
	FindActiveBeautyService(context.Context, string) (domain.BeautyService, error)
	CreateServiceRequest(context.Context, domain.ServiceRequestInput, domain.BeautyService, string) (domain.ServiceRequest, error)
	BeautyServiceRequests(context.Context) ([]domain.ServiceRequest, error)
	UpdateBeautyServiceRequestStatus(context.Context, string, string) (domain.ServiceRequest, error)
}

type MemoryBeautyServicesRepository struct {
	mu       sync.Mutex
	services []domain.BeautyService
	requests []domain.ServiceRequest
}

func NewMemoryBeautyServicesRepository() *MemoryBeautyServicesRepository {
	image := "/images/thalu-beauty.png"
	return &MemoryBeautyServicesRepository{services: []domain.BeautyService{
		{ID: "manicure-tradicional", Name: "Manicure tradicional", Description: "Arreglo y esmaltado de uñas de las manos.", Category: "Uñas", ImageURL: image, Currency: "COP", Active: true, SortOrder: 1},
		{ID: "unas-semipermanentes", Name: "Uñas semipermanentes", Description: "Aplicación de esmalte semipermanente en las manos.", Category: "Uñas", ImageURL: "/images/thalu-makeup.png", Currency: "COP", Active: true, SortOrder: 2},
		{ID: "unas-press-on", Name: "Uñas Press On", Description: "Aplicación de uñas Press On.", Category: "Uñas", ImageURL: "/images/thalu-lipstick.png", Currency: "COP", Active: true, SortOrder: 3},
		{ID: "semipermanente-pies", Name: "Semipermanente en pies", Description: "Esmaltado semipermanente para uñas de los pies.", Category: "Uñas", ImageURL: "/images/thalu-blossom.png", Currency: "COP", Active: true, SortOrder: 4},
		{ID: "cepillado-cabello", Name: "Cepillado de cabello", Description: "Cepillado y peinado mediante herramientas apropiadas.", Category: "Cuidado capilar", ImageURL: "/images/thalu-beauty.png", Currency: "COP", Active: true, SortOrder: 5},
		{ID: "planchado-cabello", Name: "Planchado de cabello", Description: "Alisado temporal y acabado mediante plancha de cabello.", Category: "Cuidado capilar", ImageURL: "/images/thalu-hair-mask.png", Currency: "COP", Active: true, SortOrder: 6},
	}}
}

func (r *MemoryBeautyServicesRepository) ActiveBeautyServices(_ context.Context) ([]domain.BeautyService, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	return append([]domain.BeautyService(nil), r.services...), nil
}
func (r *MemoryBeautyServicesRepository) FindActiveBeautyService(_ context.Context, id string) (domain.BeautyService, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	for _, service := range r.services {
		if service.ID == id && service.Active {
			return service, nil
		}
	}
	return domain.BeautyService{}, ErrServiceNotFound
}
func (r *MemoryBeautyServicesRepository) CreateServiceRequest(_ context.Context, input domain.ServiceRequestInput, service domain.BeautyService, id string) (domain.ServiceRequest, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	now := time.Now().UTC()
	request := domain.ServiceRequest{ID: id, FullName: input.FullName, Phone: input.Phone, City: input.City, Address: input.Address, Neighborhood: input.Neighborhood, ServiceID: service.ID, ServiceName: service.Name, PreferredDate: input.PreferredDate, PreferredTime: input.PreferredTime, Notes: input.Notes, Status: "Nueva", CreatedAt: now, UpdatedAt: now}
	r.requests = append(r.requests, request)
	return request, nil
}
func (r *MemoryBeautyServicesRepository) BeautyServiceRequests(_ context.Context) ([]domain.ServiceRequest, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	return append([]domain.ServiceRequest(nil), r.requests...), nil
}
func (r *MemoryBeautyServicesRepository) UpdateBeautyServiceRequestStatus(_ context.Context, id, status string) (domain.ServiceRequest, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	for index := range r.requests {
		if r.requests[index].ID == id {
			r.requests[index].Status = status
			r.requests[index].UpdatedAt = time.Now().UTC()
			return r.requests[index], nil
		}
	}
	return domain.ServiceRequest{}, ErrServiceNotFound
}
