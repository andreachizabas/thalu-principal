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

const categoryProducts: Record<string, Product[]> = {
  maquillaje: [
    {
      id: "catalogo-labial-rosa",
      slug: "labial-rosa-editorial",
      name: "Labial rosa editorial",
      brand: "ThaLú Beauty",
      category: "Maquillaje",
      priceCents: 5200000,
      currency: "COP",
      imageUrl: "/images/thalu-lipstick.png",
      shortDescription: "Color satinado y luminoso para labios con presencia suave.",
      inventory: 12,
      featured: true,
      tags: ["Favorito", "Nuevo"],
    },
    {
      id: "catalogo-base-luminosa",
      slug: "base-luminosa-natural",
      name: "Base luminosa natural",
      brand: "Ritual Beauty",
      category: "Maquillaje",
      priceCents: 8600000,
      currency: "COP",
      imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
      shortDescription: "Cobertura ligera para una piel fresca y uniforme.",
      inventory: 8,
      featured: true,
      tags: ["Piel", "Luminoso"],
    },
    {
      id: "catalogo-rubor-crema",
      slug: "rubor-crema-coral",
      name: "Rubor en crema coral",
      brand: "Maison Color",
      category: "Maquillaje",
      priceCents: 3900000,
      currency: "COP",
      imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85",
      shortDescription: "Un toque de color cremoso para mejillas naturalmente radiantes.",
      inventory: 15,
      featured: true,
      tags: ["Coral", "Crema"],
    },
    {
      id: "catalogo-paleta-rosada",
      slug: "paleta-rosada-esencial",
      name: "Paleta rosada esencial",
      brand: "Color Ritual",
      category: "Maquillaje",
      priceCents: 6800000,
      currency: "COP",
      imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85",
      shortDescription: "Tonos suaves para crear looks de día y de noche.",
      inventory: 7,
      featured: true,
      tags: ["Paleta", "Esencial"],
    },
  ],
  skincare: [
    {
      id: "catalogo-serum-rosa",
      slug: "serum-luminoso-rosa",
      name: "Serum luminoso rosa",
      brand: "ThaLú Skin",
      category: "Skincare",
      priceCents: 9200000,
      currency: "COP",
      imageUrl: "/images/thalu-serum.png",
      shortDescription: "Textura ligera para una piel hidratada y con apariencia fresca.",
      inventory: 11,
      featured: true,
      tags: ["Favorito", "Glow"],
    },
    {
      id: "catalogo-crema-facial",
      slug: "crema-facial-nutritiva",
      name: "Crema facial nutritiva",
      brand: "Botánica Rosa",
      category: "Skincare",
      priceCents: 7400000,
      currency: "COP",
      imageUrl: "/images/thalu-cream.png",
      shortDescription: "Ritual cremoso para acompañar la suavidad de tu piel.",
      inventory: 10,
      featured: true,
      tags: ["Hidratación", "Ritual"],
    },
    {
      id: "catalogo-limpiador-suave",
      slug: "limpiador-suave-facial",
      name: "Limpiador facial suave",
      brand: "Pure Skin",
      category: "Skincare",
      priceCents: 4600000,
      currency: "COP",
      imageUrl: "https://images.unsplash.com/photo-1556228578-8c89eab0f7f7?auto=format&fit=crop&w=900&q=85",
      shortDescription: "Limpieza delicada para comenzar tu rutina con calma.",
      inventory: 14,
      featured: true,
      tags: ["Limpieza", "Suave"],
    },
    {
      id: "catalogo-contorno-ojos",
      slug: "contorno-de-ojos",
      name: "Contorno de ojos revitalizante",
      brand: "Lumière Care",
      category: "Skincare",
      priceCents: 6100000,
      currency: "COP",
      imageUrl: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85",
      shortDescription: "Cuidado concentrado para una mirada descansada y luminosa.",
      inventory: 6,
      featured: true,
      tags: ["Mirada", "Cuidado"],
    },
  ],
  "cuidado-capilar": [
    {
      id: "catalogo-mascarilla-rosa",
      slug: "mascarilla-capilar-rosa",
      name: "Mascarilla capilar nutritiva",
      brand: "ThaLú Hair",
      category: "Cuidado capilar",
      priceCents: 7600000,
      currency: "COP",
      imageUrl: "/images/thalu-hair-mask.png",
      shortDescription: "Tratamiento cremoso para acompañar el brillo y la suavidad.",
      inventory: 9,
      featured: true,
      tags: ["Favorito", "Nutrición"],
    },
    {
      id: "catalogo-shampoo-brillo",
      slug: "shampoo-brillo-suave",
      name: "Shampoo brillo suave",
      brand: "Botánica Hair",
      category: "Cuidado capilar",
      priceCents: 4300000,
      currency: "COP",
      imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85",
      shortDescription: "Limpieza suave para una rutina capilar equilibrada.",
      inventory: 13,
      featured: true,
      tags: ["Brillo", "Ritual"],
    },
    {
      id: "catalogo-aceite-capilar",
      slug: "aceite-capilar-ligero",
      name: "Aceite capilar ligero",
      brand: "Ritual Hair",
      category: "Cuidado capilar",
      priceCents: 5800000,
      currency: "COP",
      imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=900&q=85",
      shortDescription: "Acabado luminoso para puntas suaves y manejables.",
      inventory: 8,
      featured: true,
      tags: ["Suavidad", "Puntas"],
    },
    {
      id: "catalogo-acondicionador",
      slug: "acondicionador-hidratante",
      name: "Acondicionador hidratante",
      brand: "Cuidado Esencial",
      category: "Cuidado capilar",
      priceCents: 4900000,
      currency: "COP",
      imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",
      shortDescription: "Hidratación diaria para acompañar movimiento y brillo.",
      inventory: 10,
      featured: true,
      tags: ["Hidratación", "Diario"],
    },
  ],
};

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

export function getCategoryProducts(category: string): Product[] {
  return categoryProducts[category] ?? [];
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
