package domain

import "time"

type BeautyService struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	Description     string `json:"description"`
	Category        string `json:"category"`
	ImageURL        string `json:"imageUrl"`
	PriceCents      *int64 `json:"priceCents,omitempty"`
	Currency        string `json:"currency"`
	DurationMinutes *int   `json:"durationMinutes,omitempty"`
	Active          bool   `json:"active"`
	SortOrder       int    `json:"sortOrder"`
}

type ServiceRequestInput struct {
	FullName      string `json:"fullName"`
	Phone         string `json:"phone"`
	City          string `json:"city"`
	Address       string `json:"address"`
	Neighborhood  string `json:"neighborhood"`
	ServiceID     string `json:"serviceId"`
	PreferredDate string `json:"preferredDate"`
	PreferredTime string `json:"preferredTime"`
	Notes         string `json:"notes"`
}

type ServiceRequest struct {
	ID            string    `json:"id"`
	FullName      string    `json:"fullName"`
	Phone         string    `json:"phone"`
	City          string    `json:"city"`
	Address       string    `json:"address"`
	Neighborhood  string    `json:"neighborhood"`
	ServiceID     string    `json:"serviceId"`
	ServiceName   string    `json:"serviceName"`
	PreferredDate string    `json:"preferredDate,omitempty"`
	PreferredTime string    `json:"preferredTime,omitempty"`
	Notes         string    `json:"notes,omitempty"`
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}
