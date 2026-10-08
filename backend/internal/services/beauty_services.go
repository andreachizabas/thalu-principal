package services

import (
	"context"
	"errors"
	"fmt"
	"regexp"
	"strings"

	"github.com/andreachizabas/thalu-principal/backend/internal/domain"
	"github.com/andreachizabas/thalu-principal/backend/internal/repositories"
)

var ErrInvalidServiceRequest = errors.New("invalid service request")
var colombianMobile = regexp.MustCompile(`^3\d{9}$`)

type BeautyServicesService struct {
	repository repositories.BeautyServicesRepository
}

func NewBeautyServicesService(repository repositories.BeautyServicesRepository) *BeautyServicesService {
	return &BeautyServicesService{repository: repository}
}
func (s *BeautyServicesService) ActiveServices(ctx context.Context) ([]domain.BeautyService, error) {
	return s.repository.ActiveBeautyServices(ctx)
}
func (s *BeautyServicesService) CreateRequest(ctx context.Context, input domain.ServiceRequestInput, id string) (domain.ServiceRequest, error) {
	input.Phone = strings.Join(strings.Fields(input.Phone), "")
	if strings.TrimSpace(input.FullName) == "" || !colombianMobile.MatchString(input.Phone) || input.City != "Manizales" && input.City != "Villamaría" || strings.TrimSpace(input.Address) == "" || strings.TrimSpace(input.Neighborhood) == "" {
		return domain.ServiceRequest{}, ErrInvalidServiceRequest
	}
	service, err := s.repository.FindActiveBeautyService(ctx, input.ServiceID)
	if err != nil {
		return domain.ServiceRequest{}, fmt.Errorf("%w: service", ErrInvalidServiceRequest)
	}
	return s.repository.CreateServiceRequest(ctx, input, service, id)
}
func (s *BeautyServicesService) Requests(ctx context.Context) ([]domain.ServiceRequest, error) {
	return s.repository.BeautyServiceRequests(ctx)
}
func (s *BeautyServicesService) UpdateStatus(ctx context.Context, id, status string) (domain.ServiceRequest, error) {
	return s.repository.UpdateBeautyServiceRequestStatus(ctx, id, status)
}
