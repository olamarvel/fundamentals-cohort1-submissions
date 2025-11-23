"use client";
import { useState } from "react";
import api from "@/api";
import getGuestId from "@/utils/guestid";

interface Product {
  id: number;
  image: string;
  name: string;
  priceCents: number;
}

export default function ProductCard({ product, onCartUpdate, }: { product: Product; onCartUpdate: () => void;}) 
{
  const [loading, setLoading] = useState(false); // ✅ track loading state

  // ✅ add-to-cart logic
  const handleAddToCart = async () => {
  try {
    setLoading(true);
    const guestId = getGuestId();
    await api.post("/cart", {
      userId: guestId,
      product: { id: product.id, 
      name: product.name, 
      image: product.image, 
      priceCents: product.priceCents },
      quantity: 1,
    });

    onCartUpdate();

   localStorage.setItem("cartUpdated", Date.now().toString());
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="border rounded-lg shadow-md p-4 flex flex-col items-center  h-full">

      {/* Show product image */}
      <img
        src={product.image}
        alt={product.name}
        className="mb-4 object-cover w-40 h-30 rounded-2xl"
      />

      <h2 className=" text-1xl font-semibold mb-2 text-black text-center">{product.name}</h2>

      {/* Convert cents to dollars */}
      <p className="text-black mb-4 text-center font-extrabold">
        ${ (product.priceCents / 100).toFixed(2) }
      </p>
 
      {/* Add to cart button */}
       <button
        onClick={handleAddToCart}
        disabled={loading}      
        className="mt-3 bg-yellow-400 text-white px-2 py-2 rounded-1.5xl w-35 hover:bg-yellow-500 disabled:bg-gray-400"
      >
        {loading ? "Adding..." : "Add to Cart"} {/* ✅ loading feedback */}
      </button>
    </div>
  );
}
