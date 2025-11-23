"use client";

import ProductCard from "./ProductCard";
import { products } from "../data/products";

export default function ProductList({ refreshCartCount }: { refreshCartCount: () => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 items-stretch">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onCartUpdate={refreshCartCount} // ✅ now it works
        />
      ))}
    </div>
  );
}
