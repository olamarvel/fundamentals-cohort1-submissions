
"use client";

import { useEffect, useState } from "react";
import api from "@/api";
import getGuestId from "@/utils/guestid";

interface Product {
  id: number;
  name: string;
  image: string;
  priceCents: number;
}

interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [shippingFee, setShippingFee] = useState<number>(0);

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      const guestId = getGuestId();
      const res = await api.get(`/cart/${guestId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);


  const handleRemoveItem = async (itemId: string) => {
    try {
       await api.delete(`/cart/${itemId}`); 

        // Refresh cart items after deletion
       setCartItems((prev) => prev.filter((item) => item._id  !== itemId));

       // Notify other tabs about cart update
       localStorage.setItem("cartUpdated", Date.now().toString());
       window.dispatchEvent(new StorageEvent("storage", { key: "cartUpdated"}));
    } catch (err) {
      console.error("Error removing item;", err);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.priceCents * item.quantity,
    0
  );
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + tax + shippingFee;

  // Handle date selection and calculate shipping fee
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);

    // calculate shipping fee based on date
    const today = new Date();
    const chosen = new Date(date);
    const diffDays = Math.ceil(
      (chosen.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) setShippingFee(1000); // same-day delivery
    else if (diffDays <= 2) setShippingFee(500); // next 2 days
    else setShippingFee(0); // standard
  };

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6">
      {/* Left: Cart items + date picker */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        {/* Date Picker */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Select Delivery Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border px-3 py-2 rounded w-full"
            min={new Date().toISOString().split("T")[0]} // prevent past dates
          />
        </div>

        {/* Selected Date Display */}
        {selectedDate && (
          <div className="mb-4 p-2 rounded-2xl text-black">
            Selected Delivery: {new Date(selectedDate).toDateString()} | 
            Shipping Fee: ${(shippingFee / 100).toFixed(2)}
          </div>
        )}

        {/* Cart Items */}
        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center border rounded p-4 gap-4"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p>
                  ${((item.product.priceCents * item.quantity) / 100).toFixed(2)}{" "}
                  ({item.quantity} pcs)
                </p>
              </div>
  
              <button
               onClick={() => handleRemoveItem(item._id)}
               className="text-black-500 hover: underline text-1xl">
                Remove Item 
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="w-full md:w-1/3 p-4 border rounded h-fit">
        <h3 className="text-lg font-bold mb-4">Order Summary</h3>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${(subtotal / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax (7%)</span>
          <span>${(tax / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>${(shippingFee / 100).toFixed(2)}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${(total / 100).toFixed(2)}</span>
        </div>

        <button
          className="mt-4 w-full  bg-yellow-400 text-white py-2 rounded hover:bg-green-700"
          disabled={!selectedDate || cartItems.length === 0}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
