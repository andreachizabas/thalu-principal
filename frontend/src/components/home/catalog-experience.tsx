"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HomeSections } from "@/components/home/home-sections";
import { ProductShowcase } from "@/components/products/product-showcase";
import type { Product } from "@/types/catalog";

export function CatalogExperience({ products }: { products: Product[] }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categorySlugs: Record<string, string> = {
    Maquillaje: "maquillaje",
    Skincare: "skincare",
    "Cuidado capilar": "cuidado-capilar",
  };

  function selectCategory(category: string) {
    setSelectedCategory(category);
    const slug = categorySlugs[category];

    if (slug) {
      router.push(`/catalogo/${slug}`);
    }
  }

  return (
    <>
      <HomeSections
        selectedCategory={selectedCategory}
        onCategorySelect={selectCategory}
      />
      <ProductShowcase
        products={products}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </>
  );
}
