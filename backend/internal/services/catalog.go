package services

import (
	"context"

	"github.com/andreachizabas/thalu-principal/backend/internal/domain"
	"github.com/andreachizabas/thalu-principal/backend/internal/repositories"
)

type CatalogService struct {
	repository repositories.CatalogRepository
}

func NewCatalogService(repository repositories.CatalogRepository) *CatalogService {
	return &CatalogService{repository: repository}
}

func (s *CatalogService) FeaturedProducts(ctx context.Context) ([]domain.Product, error) {
	return s.repository.FeaturedProducts(ctx)
}

func (s *CatalogService) SelfEsteemMessage(ctx context.Context) (domain.SelfEsteemMessage, error) {
	return s.repository.RandomActiveSelfEsteemMessage(ctx)
}
