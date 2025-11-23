"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/api";
import getGuestId from "@/utils/guestid"

export default function Headerbutton() {
  const [count, setCount] = useState(0);

  // Fetch cart count for current guest
  const fetchCartCount = async () => {
    try {
      const guestId = getGuestId();
      const res = await api.get(`/cart/${guestId}`);
      setCount(res.data.length);
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  // Load count on mount
  useEffect(() => {
    fetchCartCount();
  

  // Listen for cart updates in Local storage
   const handleStorageChange = (event: StorageEvent) => {
     if (event.key === "cartUpdated") {
        fetchCartCount();
     }
   };
   
   window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Link href="/cart">
      <div className="relative flex items-center gap-2 px-3 py-2 border rounded-2g cursor-pointer hover:bg-gray-700">
        {/* Badge (number of items in cart) */}
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
            {count}
          </span>
        )}

        {/* Icon */}
        <ShoppingCart className="w-5 h-5 text-white sm:w-5 md:w-5 sm:h-5 md:h-5" />

        {/* Text */}
        <span className="font-light text-white sm:font-thin md:font-medium">Cart</span>
      </div>
    </Link>
  );
}
