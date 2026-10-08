import { Hero } from "@/components/home/hero";
import { CatalogExperience } from "@/components/home/catalog-experience";
import { SelfEsteemBanner } from "@/components/home/self-esteem-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getFeaturedProducts, getSelfEsteemMessage } from "@/services/catalog";

export default async function Home() {
  const [products, message] = await Promise.all([
    getFeaturedProducts(),
    getSelfEsteemMessage(),
  ]);

  return (
    <div className="min-h-screen bg-salmon text-ink">
      <SiteHeader />
      <main>
        <Hero />
        <CatalogExperience products={products} />
        <SelfEsteemBanner message={message} />
      </main>
      <SiteFooter />
    </div>
  );
}
