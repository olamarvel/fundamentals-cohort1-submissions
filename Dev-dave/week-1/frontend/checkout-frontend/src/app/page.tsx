"use client";

import ProductList from "./components/ProductList";
import HomeHeader from "./components/Header/HomeHeader";
import Headerbutton from "./components/Header/Headerbutton";

export default function Home() {
  const refreshCartCount = () => {
    // 👈 You can call the Headerbutton’s fetchCartCount via localStorage event
    localStorage.setItem("cartUpdated", Date.now().toString());
    window.dispatchEvent(new StorageEvent("storage", { key: "cartUpdated" }));
  };

  return (
    <>
      <HomeHeader />
      <main>
        <ProductList refreshCartCount={refreshCartCount} />
      </main>
    </>
  );
}
