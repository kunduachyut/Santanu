// app/cart/page.tsx (updated)
"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalCents } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const { userId, isSignedIn } = useAuth();

  const handleCheckout = async () => {
    if (!isSignedIn) {
      alert("Please sign in to proceed with checkout");
      return;
    }

    setIsProcessing(true);
    try {
      // Send purchase requests to super admin
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items: cart.map(item => ({
            websiteId: item._id,
            title: item.title,
            priceCents: item.priceCents,
            quantity: item.quantity
          })),
          customerId: userId,
          customerEmail: "user@example.com" // In a real app, get from user profile
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      // Clear cart on successful purchase request
      clearCart();
      alert("Purchase request sent! The administrator will review your order.");
      
    } catch (err) {
      console.error("Failed to complete purchase:", err);
      alert("Failed to complete purchase. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some websites to your cart to get started.</p>
          <Link
            href="/dashboard/consumer"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <Link
          href="/dashboard/consumer"
          className="text-blue-500 hover:text-blue-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Continue Shopping
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700 pb-4">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {cart.map((item, idx) => (
            <div key={item._id ?? idx} className="grid grid-cols-12 gap-4 py-4 border-b items-center">
              <div className="col-span-6">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
              </div>
              <div className="col-span-2 text-center text-gray-700">
                ${(item.priceCents / 100).toFixed(2)}
              </div>
              <div className="col-span-2 flex justify-center">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <span className="text-gray-700 font-medium mr-4">
                  ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 flex justify-between items-center">
          <button
            onClick={clearCart}
            className="text-gray-500 hover:text-gray-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Cart
          </button>

          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              Total: ${(totalCents / 100).toFixed(2)}
            </div>
            <button
              onClick={handleCheckout}
              disabled={isProcessing || !isSignedIn}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? "Processing..." : "Proceed to Checkout"}
            </button>
            {!isSignedIn && (
              <p className="text-sm text-red-600 mt-2">Please sign in to checkout</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}