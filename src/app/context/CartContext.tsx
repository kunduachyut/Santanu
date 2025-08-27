// app/context/CartContext.tsx (updated)
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type CartItem = {
  _id: string;
  title: string;
  priceCents: number;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
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
        // If item already exists, increase quantity
        return prev.map(p => 
          p._id === item._id 
            ? { ...p, quantity: p.quantity + 1 } 
            : p
        );
      } else {
        // If item doesn't exist, add it with quantity 1
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(p => p._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCart(prev => 
      prev.map(p => 
        p._id === id ? { ...p, quantity } : p
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalCents = cart.reduce((sum, item) => sum + (item.priceCents * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      updateQuantity,
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