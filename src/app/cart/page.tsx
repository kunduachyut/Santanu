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
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestTopic, setRequestTopic] = useState("");
  const [wordCount, setWordCount] = useState(500);

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

  const openContentModal = (item: any) => {
    setSelectedItem(item);
    setShowContentModal(true);
  };

  const openRequestModal = (item: any) => {
    setSelectedItem(item);
    setShowRequestModal(true);
  };

  const handleContentRequest = async () => {
    if (!requestTopic.trim()) {
      alert("Please enter a topic for your content request");
      return;
    }

    try {
      // Send content request to the server
      const res = await fetch("/api/content-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteId: selectedItem._id,
          websiteTitle: selectedItem.title,
          topic: requestTopic,
          wordCount: wordCount,
          customerId: userId,
          customerEmail: "user@example.com" // In a real app, get from user profile
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      alert("Content request submitted successfully!");
      setShowRequestModal(false);
      setRequestTopic("");
      setWordCount(500);
      
    } catch (err) {
      console.error("Failed to submit content request:", err);
      alert("Failed to submit content request. Please try again.");
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
            <div className="col-span-5">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {cart.map((item, idx) => (
            <div key={item._id ?? idx} className="grid grid-cols-12 gap-4 py-4 border-b items-center">
              <div className="col-span-5">
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
              <div className="col-span-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => openContentModal(item)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  My Content
                </button>
                <button
                  onClick={() => openRequestModal(item)}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  Request Content
                </button>
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

      {/* My Content Modal */}
      {showContentModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Content for {selectedItem.title}</h3>
              <button
                onClick={() => setShowContentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Available Content:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sample content items - in a real app, these would come from the database */}
                <div className="border rounded p-3">
                  <h5 className="font-medium">Introduction to Web Development</h5>
                  <p className="text-sm text-gray-600 mt-1">A comprehensive guide to getting started with web development...</p>
                  <button className="mt-2 text-blue-500 text-sm hover:underline">View Details</button>
                </div>
                <div className="border rounded p-3">
                  <h5 className="font-medium">Advanced JavaScript Techniques</h5>
                  <p className="text-sm text-gray-600 mt-1">Learn advanced JavaScript patterns and best practices...</p>
                  <button className="mt-2 text-blue-500 text-sm hover:underline">View Details</button>
                </div>
                <div className="border rounded p-3">
                  <h5 className="font-medium">CSS Layout Mastery</h5>
                  <p className="text-sm text-gray-600 mt-1">Master CSS layout techniques including Flexbox and Grid...</p>
                  <button className="mt-2 text-blue-500 text-sm hover:underline">View Details</button>
                </div>
                <div className="border rounded p-3">
                  <h5 className="font-medium">React Best Practices</h5>
                  <p className="text-sm text-gray-600 mt-1">Learn how to structure React applications for maintainability...</p>
                  <button className="mt-2 text-blue-500 text-sm hover:underline">View Details</button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowContentModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Content Modal */}
      {showRequestModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Request Content for {selectedItem.title}</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <input
                type="text"
                value={requestTopic}
                onChange={(e) => setRequestTopic(e.target.value)}
                placeholder="Enter the topic for your content"
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Word Count
              </label>
              <select
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              >
                <option value="500">500 words</option>
                <option value="1000">1000 words</option>
                <option value="1500">1500 words</option>
                <option value="2000">2000 words</option>
                <option value="2500">2500+ words</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                placeholder="Any specific requirements or details..."
                className="w-full p-2 border rounded-md h-24"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleContentRequest}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}