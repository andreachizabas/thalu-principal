package repositories

import (
	"context"

	"github.com/andreachizabas/thalu-principal/backend/internal/domain"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresCatalogRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresCatalogRepository(pool *pgxpool.Pool) *PostgresCatalogRepository {
	return &PostgresCatalogRepository{pool: pool}
}

func (r *PostgresCatalogRepository) FeaturedProducts(ctx context.Context) ([]domain.Product, error) {
	rows, err := r.pool.Query(ctx, `
		select
			p.id::text,
			p.slug,
			p.name,
			b.name as brand,
			c.name as category,
			p.price_cents,
			p.currency,
			coalesce(pi.url, '') as image_url,
			p.short_description,
			coalesce(i.available_stock, 0) as inventory,
			p.featured,
			coalesce(p.tags, '{}') as tags
		from products p
		join brands b on b.id = p.brand_id
		join categories c on c.id = p.category_id
		left join product_images pi on pi.product_id = p.id and pi.is_primary = true
		left join inventory i on i.product_id = p.id
		where p.active = true and p.featured = true
		order by p.created_at desc
		limit 12
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	products := make([]domain.Product, 0)
	for rows.Next() {
		var product domain.Product
		if err := rows.Scan(
			&product.ID,
			&product.Slug,
			&product.Name,
			&product.Brand,
			&product.Category,
			&product.PriceCents,
			&product.Currency,
			&product.ImageURL,
			&product.ShortDescription,
			&product.Inventory,
			&product.Featured,
			&product.Tags,
		); err != nil {
			return nil, err
		}
		products = append(products, product)
	}

	return products, rows.Err()
}

func (r *PostgresCatalogRepository) RandomActiveSelfEsteemMessage(ctx context.Context) (domain.SelfEsteemMessage, error) {
	var message domain.SelfEsteemMessage
	err := r.pool.QueryRow(ctx, `
		select id::text, message
		from self_esteem_messages
		where active = true
		order by random()
		limit 1
	`).Scan(&message.ID, &message.Message)
	return message, err
}
