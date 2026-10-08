package repositories

import (
	"context"
	"time"

	"github.com/andreachizabas/thalu-principal/backend/internal/domain"
)

type MemoryCatalogRepository struct {
	products []domain.Product
	messages []domain.SelfEsteemMessage
}

func NewMemoryCatalogRepository() *MemoryCatalogRepository {
	return &MemoryCatalogRepository{
		products: []domain.Product{
			{
				ID:               "seed-labial-rosa",
				Slug:             "labial-satinado-rosa",
				Name:             "Labial satinado Rosa Suave",
				Brand:            "ThaLu Curated",
				Category:         "Maquillaje",
				PriceCents:       4800000,
				Currency:         "COP",
				ImageURL:         "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
				ShortDescription: "Color cremoso de acabado satinado para acompanar rutinas de dia y noche.",
				Inventory:        18,
				Featured:         true,
				Tags:             []string{"Nuevo", "Favorito"},
			},
			{
				ID:               "seed-serum-luminoso",
				Slug:             "serum-luminoso-facial",
				Name:             "Serum luminoso facial",
				Brand:            "Ritual Botanico",
				Category:         "Skincare",
				PriceCents:       9200000,
				Currency:         "COP",
				ImageURL:         "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
				ShortDescription: "Textura ligera para una rutina facial delicada y una piel con apariencia fresca.",
				Inventory:        11,
				Featured:         true,
				Tags:             []string{"Skincare", "Ritual"},
			},
			{
				ID:               "seed-mascarilla-capilar",
				Slug:             "mascarilla-capilar-nutritiva",
				Name:             "Mascarilla capilar nutritiva",
				Brand:            "Cuidado Esencial",
				Category:         "Cuidado capilar",
				PriceCents:       7600000,
				Currency:         "COP",
				ImageURL:         "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
				ShortDescription: "Tratamiento cosmetico para acompanar el brillo y la suavidad del cabello.",
				Inventory:        9,
				Featured:         true,
				Tags:             []string{"Capilar", "Kit"},
			},
		},
		messages: []domain.SelfEsteemMessage{
			{ID: "seed-message-1", Message: "Tu belleza es unica, igual que tu historia."},
			{ID: "seed-message-2", Message: "Dedicarte tiempo tambien es una forma de quererte."},
			{ID: "seed-message-3", Message: "Tu autenticidad es tu mayor encanto."},
		},
	}
}

func (r *MemoryCatalogRepository) FeaturedProducts(_ context.Context) ([]domain.Product, error) {
	return r.products, nil
}

func (r *MemoryCatalogRepository) RandomActiveSelfEsteemMessage(_ context.Context) (domain.SelfEsteemMessage, error) {
	if len(r.messages) == 0 {
		return domain.SelfEsteemMessage{}, nil
	}
	index := time.Now().In(time.FixedZone("America/Bogota", -5*60*60)).Day() % len(r.messages)
	return r.messages[index], nil
}
