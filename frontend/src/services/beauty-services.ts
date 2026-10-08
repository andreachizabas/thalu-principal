import type { BeautyService, ServiceRequestPayload } from "@/types/services";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const fallbackServices: BeautyService[] = [
  { id: "manicure-tradicional", name: "Manicure tradicional", description: "Arreglo y esmaltado de uñas de las manos.", category: "Uñas", imageUrl: "/images/thalu-beauty.png", currency: "COP", active: true, sortOrder: 1 },
  { id: "unas-semipermanentes", name: "Uñas semipermanentes", description: "Color duradero para manos cuidadas y luminosas.", category: "Uñas", imageUrl: "/images/thalu-makeup.png", currency: "COP", active: true, sortOrder: 2 },
  { id: "unas-press-on", name: "Uñas Press On", description: "Aplicación de uñas Press On para un acabado especial.", category: "Uñas", imageUrl: "/images/thalu-lipstick.png", currency: "COP", active: true, sortOrder: 3 },
  { id: "semipermanente-pies", name: "Semipermanente en pies", description: "Esmaltado semipermanente para las uñas de los pies.", category: "Uñas", imageUrl: "/images/thalu-blossom.png", currency: "COP", active: true, sortOrder: 4 },
  { id: "cepillado-cabello", name: "Cepillado de cabello", description: "Cepillado y peinado con herramientas apropiadas.", category: "Cuidado capilar", imageUrl: "/images/thalu-beauty.png", currency: "COP", active: true, sortOrder: 5 },
  { id: "planchado-cabello", name: "Planchado de cabello", description: "Alisado temporal y acabado mediante plancha de cabello.", category: "Cuidado capilar", imageUrl: "/images/thalu-hair-mask.png", currency: "COP", active: true, sortOrder: 6 },
];

export async function getBeautyServices(): Promise<BeautyService[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/services`, { next: { revalidate: 60 } });
    if (response.ok) return response.json();
  } catch {
    // The public catalog remains available while the API is offline.
  }
  return fallbackServices;
}

export async function submitServiceRequest(payload: ServiceRequestPayload) {
  const response = await fetch(`${apiBaseUrl}/api/v1/service-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "No pudimos registrar la solicitud.");
  return data as { id: string };
}

export { fallbackServices };
