import { Hero } from "@/components/home/hero";
import { HomeSections } from "@/components/home/home-sections";
import { SelfEsteemBanner } from "@/components/home/self-esteem-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductShowcase } from "@/components/products/product-showcase";
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
        <HomeSections />
        <ProductShowcase products={products} />
        <SelfEsteemBanner message={message} />
      </main>
      <SiteFooter />
    </div>
  );
}
