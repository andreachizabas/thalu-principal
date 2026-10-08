package domain

type Product struct {
	ID               string   `json:"id"`
	Slug             string   `json:"slug"`
	Name             string   `json:"name"`
	Brand            string   `json:"brand"`
	Category         string   `json:"category"`
	PriceCents       int64    `json:"priceCents"`
	Currency         string   `json:"currency"`
	ImageURL         string   `json:"imageUrl"`
	ShortDescription string   `json:"shortDescription"`
	Inventory        int      `json:"inventory"`
	Featured         bool     `json:"featured"`
	Tags             []string `json:"tags"`
}

type SelfEsteemMessage struct {
	ID      string `json:"id"`
	Message string `json:"message"`
}
