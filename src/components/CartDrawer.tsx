"use client";

import { useCart } from "../app/context/CartContext";

export default function CartDrawer({ onClose }: { onClose: () => void }) {
  const { cart, removeFromCart, clearCart, totalCents } = useCart();

  return (
    <div className="fixed right-0 top-0 w-80 h-full bg-white shadow-lg border-l z-50 flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">Your Cart</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <p className="text-gray-500">Cart is empty</p>
        ) : (
          cart.map((item, index) => (
            <div 
              key={item._id || index}  // ✅ ensures unique key
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  ${(item.priceCents / 100).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t space-y-3">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${(totalCents / 100).toFixed(2)}</span>
        </div>
        <button
          disabled={cart.length === 0}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
          onClick={() => alert("Checkout flow here")}
        >
          Checkout
        </button>
        <button
          onClick={clearCart}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
