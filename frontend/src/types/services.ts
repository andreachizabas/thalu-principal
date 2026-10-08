export type BeautyService = {
  id: string;
  name: string;
  description: string;
  category: "Uñas" | "Cuidado capilar";
  imageUrl: string;
  priceCents?: number;
  currency: string;
  durationMinutes?: number;
  active: boolean;
  sortOrder: number;
};

export type ServiceRequestPayload = {
  fullName: string;
  phone: string;
  city: "Manizales" | "Villamaría";
  address: string;
  neighborhood: string;
  serviceId: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
};
