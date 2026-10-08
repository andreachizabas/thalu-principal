package repositories

import (
	"context"
	"fmt"
	"github.com/andreachizabas/thalu-principal/backend/internal/domain"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresBeautyServicesRepository struct{ pool *pgxpool.Pool }

func NewPostgresBeautyServicesRepository(pool *pgxpool.Pool) *PostgresBeautyServicesRepository {
	return &PostgresBeautyServicesRepository{pool: pool}
}
func (r *PostgresBeautyServicesRepository) ActiveBeautyServices(ctx context.Context) ([]domain.BeautyService, error) {
	rows, err := r.pool.Query(ctx, `select id::text,name,description,category,image_url,price_cents,currency,duration_minutes,active,sort_order from beauty_services where active=true order by sort_order,name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	result := make([]domain.BeautyService, 0)
	for rows.Next() {
		var s domain.BeautyService
		if err := rows.Scan(&s.ID, &s.Name, &s.Description, &s.Category, &s.ImageURL, &s.PriceCents, &s.Currency, &s.DurationMinutes, &s.Active, &s.SortOrder); err != nil {
			return nil, err
		}
		result = append(result, s)
	}
	return result, rows.Err()
}
func (r *PostgresBeautyServicesRepository) FindActiveBeautyService(ctx context.Context, id string) (domain.BeautyService, error) {
	var s domain.BeautyService
	err := r.pool.QueryRow(ctx, `select id::text,name,description,category,image_url,price_cents,currency,duration_minutes,active,sort_order from beauty_services where id::text=$1 and active=true`, id).Scan(&s.ID, &s.Name, &s.Description, &s.Category, &s.ImageURL, &s.PriceCents, &s.Currency, &s.DurationMinutes, &s.Active, &s.SortOrder)
	if err != nil {
		return s, ErrServiceNotFound
	}
	return s, nil
}
func (r *PostgresBeautyServicesRepository) CreateServiceRequest(ctx context.Context, in domain.ServiceRequestInput, s domain.BeautyService, id string) (domain.ServiceRequest, error) {
	var out domain.ServiceRequest
	err := r.pool.QueryRow(ctx, `insert into beauty_service_requests(id,full_name,phone,city,address,neighborhood,service_id,preferred_date,preferred_time,notes) values($1,$2,$3,$4,$5,$6,$7,$8::date,$9::time,$10) returning id::text,full_name,phone,city,address,neighborhood,service_id::text,$7::text,coalesce(preferred_date::text,''),coalesce(preferred_time::text,''),notes,status,created_at,updated_at`, id, in.FullName, in.Phone, in.City, in.Address, in.Neighborhood, s.ID, nullIfEmpty(in.PreferredDate), nullIfEmpty(in.PreferredTime), in.Notes).Scan(&out.ID, &out.FullName, &out.Phone, &out.City, &out.Address, &out.Neighborhood, &out.ServiceID, &out.ServiceName, &out.PreferredDate, &out.PreferredTime, &out.Notes, &out.Status, &out.CreatedAt, &out.UpdatedAt)
	return out, err
}
func nullIfEmpty(v string) any {
	if v == "" {
		return nil
	}
	return v
}
func (r *PostgresBeautyServicesRepository) BeautyServiceRequests(ctx context.Context) ([]domain.ServiceRequest, error) {
	rows, err := r.pool.Query(ctx, `select r.id::text,r.full_name,r.phone,r.city,r.address,r.neighborhood,r.service_id::text,s.name,coalesce(r.preferred_date::text,''),coalesce(r.preferred_time::text,''),r.notes,r.status,r.created_at,r.updated_at from beauty_service_requests r join beauty_services s on s.id=r.service_id order by r.created_at desc`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	result := make([]domain.ServiceRequest, 0)
	for rows.Next() {
		var q domain.ServiceRequest
		if err := rows.Scan(&q.ID, &q.FullName, &q.Phone, &q.City, &q.Address, &q.Neighborhood, &q.ServiceID, &q.ServiceName, &q.PreferredDate, &q.PreferredTime, &q.Notes, &q.Status, &q.CreatedAt, &q.UpdatedAt); err != nil {
			return nil, err
		}
		result = append(result, q)
	}
	return result, rows.Err()
}
func (r *PostgresBeautyServicesRepository) UpdateBeautyServiceRequestStatus(ctx context.Context, id, status string) (domain.ServiceRequest, error) {
	var q domain.ServiceRequest
	err := r.pool.QueryRow(ctx, `update beauty_service_requests r set status=$2,updated_at=now() from beauty_services s where r.id::text=$1 and s.id=r.service_id returning r.id::text,r.full_name,r.phone,r.city,r.address,r.neighborhood,r.service_id::text,s.name,coalesce(r.preferred_date::text,''),coalesce(r.preferred_time::text,''),r.notes,r.status,r.created_at,r.updated_at`, id, status).Scan(&q.ID, &q.FullName, &q.Phone, &q.City, &q.Address, &q.Neighborhood, &q.ServiceID, &q.ServiceName, &q.PreferredDate, &q.PreferredTime, &q.Notes, &q.Status, &q.CreatedAt, &q.UpdatedAt)
	if err != nil {
		return q, fmt.Errorf("%w: request", ErrServiceNotFound)
	}
	return q, nil
}
