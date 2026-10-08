package repositories

import (
	"context"

	"github.com/andreachizabas/thalu-principal/backend/internal/domain"
)

type CatalogRepository interface {
	FeaturedProducts(ctx context.Context) ([]domain.Product, error)
	RandomActiveSelfEsteemMessage(ctx context.Context) (domain.SelfEsteemMessage, error)
}
