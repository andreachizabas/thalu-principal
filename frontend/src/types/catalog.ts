export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  priceCents: number;
  currency: "COP";
  imageUrl: string;
  shortDescription: string;
  inventory: number;
  featured: boolean;
  tags: string[];
};

export type SelfEsteemMessage = {
  id: string;
  message: string;
};
