import { notFound } from "next/navigation";
import { ProductShowcase } from "@/components/products/product-showcase";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCategoryProducts } from "@/services/catalog";

const categoryPages = {
  maquillaje: {
    eyebrow: "Colección de maquillaje",
    title: "Color para expresarte a tu manera.",
    description:
      "Texturas, tonos y acabados seleccionados para acompañar cada versión de ti.",
    image: "/images/thalu-lipstick.png",
  },
  skincare: {
    eyebrow: "Colección de skincare",
    title: "Rituales para volver a ti.",
    description:
      "Fórmulas pensadas para cuidar tu piel con calma, constancia y luminosidad.",
    image: "/images/thalu-serum.png",
  },
  "cuidado-capilar": {
    eyebrow: "Colección de cuidado capilar",
    title: "Brillo, suavidad y movimiento.",
    description:
      "Tratamientos y esenciales para acompañar la belleza natural de tu cabello.",
    image: "/images/thalu-hair-mask.png",
  },
} as const;

export function generateStaticParams() {
  return Object.keys(categoryPages).map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const page = categoryPages[category as keyof typeof categoryPages];

  if (!page) {
    notFound();
  }

  const products = getCategoryProducts(category);

  return (
    <div className="min-h-screen bg-salmon text-ink">
      <SiteHeader />
      <main>
        <section className="bg-salmon px-5 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-rosewood">
                {page.eyebrow}
              </p>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.96] sm:text-7xl">
                {page.title}
              </h1>
              <p className="mt-6 max-w-xl text-base font-medium leading-7 text-ink/85 sm:text-lg">
                {page.description}
              </p>
            </div>
            <div
              className="mx-auto aspect-[4/3] w-full max-w-xl rounded-[2rem] border-8 border-ink bg-cover bg-center shadow-2xl shadow-ink/20"
              style={{ backgroundImage: `url(${page.image})` }}
              aria-hidden="true"
            />
          </div>
        </section>
        <ProductShowcase products={products} showFilters={false} />
      </main>
      <SiteFooter />
    </div>
  );
}
