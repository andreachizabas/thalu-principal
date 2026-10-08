import type { Product, SelfEsteemMessage } from "@/types/catalog";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const fallbackProducts: Product[] = [
  {
    id: "demo-labial-rosa",
    slug: "labial-satinado-rosa",
    name: "Labial satinado Rosa Suave",
    brand: "ThaLú Curated",
    category: "Maquillaje",
    priceCents: 4800000,
    currency: "COP",
    imageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    shortDescription:
      "Color cremoso de acabado satinado para acompanar rutinas de dia y noche.",
    inventory: 18,
    featured: true,
    tags: ["Nuevo", "Favorito"],
  },
  {
    id: "demo-serum-luminoso",
    slug: "serum-luminoso-facial",
    name: "Serum luminoso facial",
    brand: "Ritual Botanico",
    category: "Skincare",
    priceCents: 9200000,
    currency: "COP",
    imageUrl:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
    shortDescription:
      "Textura ligera para una rutina facial delicada y una piel con apariencia fresca.",
    inventory: 11,
    featured: true,
    tags: ["Skincare", "Ritual"],
  },
  {
    id: "demo-mascarilla-capilar",
    slug: "mascarilla-capilar-nutritiva",
    name: "Mascarilla capilar nutritiva",
    brand: "Cuidado Esencial",
    category: "Cuidado capilar",
    priceCents: 7600000,
    currency: "COP",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    shortDescription:
      "Tratamiento cosmetico para acompanar el brillo y la suavidad del cabello.",
    inventory: 9,
    featured: true,
    tags: ["Capilar", "Kit"],
  },
];

const fallbackMessages: SelfEsteemMessage[] = [
  {
    id: "demo-1",
    message: "Tu belleza es unica, igual que tu historia.",
  },
  {
    id: "demo-2",
    message: "Dedicarte tiempo tambien es una forma de quererte.",
  },
  {
    id: "demo-3",
    message: "Tu autenticidad es tu mayor encanto.",
  },
];

export function formatCop(priceCents: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/products/featured`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return fallbackProducts;
    }

    return response.json();
  } catch {
    return fallbackProducts;
  }
}

export async function getSelfEsteemMessage(): Promise<SelfEsteemMessage> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/self-esteem-message`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return fallbackMessages[0];
    }

    return response.json();
  } catch {
    const index = new Date().getDate() % fallbackMessages.length;
    return fallbackMessages[index];
  }
}
