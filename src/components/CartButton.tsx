"use client";

import { ShoppingCart } from "lucide-react"; // install lucide-react if not already
import { useCart } from "../app/context/CartContext";

export default function CartButton({ onClick }: { onClick: () => void }) {
  const { cart } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      <ShoppingCart className="w-5 h-5" />
      {cart.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
          {cart.length}
        </span>
      )}
    </button>
  );
}
