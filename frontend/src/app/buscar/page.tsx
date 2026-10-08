import { ProductShowcase } from "@/components/products/product-showcase";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getAllCatalogProducts } from "@/services/catalog";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = ((await searchParams).q ?? "").trim();
  const normalizedQuery = query.toLocaleLowerCase("es-CO");
  const products = getAllCatalogProducts().filter((product) => {
    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      product.name,
      product.brand,
      product.category,
      product.shortDescription,
      ...product.tags,
    ]
      .join(" ")
      .toLocaleLowerCase("es-CO");

    return searchableText.includes(normalizedQuery);
  });

  return (
    <div className="min-h-screen bg-salmon text-ink">
      <SiteHeader />
      <main>
        <section className="bg-salmon px-5 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-rosewood">
              Resultados de búsqueda
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.96] sm:text-7xl">
              {query ? `Resultados para “${query}”` : "Encuentra tu próximo ritual."}
            </h1>
            <p className="mt-5 text-base font-medium text-ink/80">
              {products.length} {products.length === 1 ? "producto encontrado" : "productos encontrados"}
            </p>
          </div>
        </section>
        <ProductShowcase products={products} showFilters={false} />
      </main>
      <SiteFooter />
    </div>
  );
}
