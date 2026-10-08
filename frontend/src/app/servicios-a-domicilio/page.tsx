import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BeautyServicesExperience } from "@/components/services/beauty-services-experience";
import { getBeautyServices } from "@/services/beauty-services";

export default async function BeautyServicesPage() {
  const services = await getBeautyServices();
  return (
    <div className="min-h-screen bg-salmon text-ink">
      <SiteHeader />
      <main><BeautyServicesExperience services={services} /></main>
      <SiteFooter />
    </div>
  );
}
