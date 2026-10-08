"use client";

import { useState } from "react";
import { HomeSections } from "@/components/home/home-sections";
import { ProductShowcase } from "@/components/products/product-showcase";
import type { Product } from "@/types/catalog";

export function CatalogExperience({ products }: { products: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  function selectCategory(category: string) {
    setSelectedCategory(category);
    document.getElementById("productos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
