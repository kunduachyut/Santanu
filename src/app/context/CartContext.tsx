// app/context/CartContext.tsx (updated)
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type CartItem = {
  _id: string;
  title: string;
  priceCents: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalCents: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existingItem = prev.find(p => p._id === item._id);
      
      if (existingItem) {
        // If item already exists, show a message and don't add it again
        if (typeof window !== 'undefined' && (window as any).toasterRef?.current) {
          (window as any).toasterRef.current.show({
            title: "Already in cart",
            message: `${item.title} is already in your cart`,
            variant: "warning",
            position: "top-right",
            duration: 3000,
          });
        }
        return prev;
      } else {
        // If item doesn't exist, add it and show success toast
        if (typeof window !== 'undefined' && (window as any).toasterRef?.current) {
          (window as any).toasterRef.current.show({
            title: "Added to cart",
            message: `${item.title} added to cart`,
            variant: "success",
            position: "top-right",
            duration: 3000,
          });
        }
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(p => p._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    // Force localStorage update immediately
    localStorage.removeItem('cart');
  };

  const totalCents = cart.reduce((sum, item) => sum + item.priceCents, 0);
  const itemCount = cart.length;

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      totalCents,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}