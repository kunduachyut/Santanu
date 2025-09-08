"use client";

import { useCart } from "../app/context/CartContext";

export default function CartDrawer({ onClose }: { onClose: () => void }) {
  const { cart, removeFromCart, clearCart, totalCents } = useCart();

  return (
    <div className="fixed right-0 top-0 w-80 h-full shadow-lg z-50 flex flex-col" style={{backgroundColor: 'var(--base-primary)', borderLeft: '1px solid var(--base-tertiary)'}}>
      <div className="p-4 flex justify-between items-center" style={{borderBottom: '1px solid var(--base-tertiary)'}}>
        <h2 className="text-lg font-bold" style={{color: 'var(--secondary-primary)'}}>Your Cart</h2>
        <button 
          onClick={onClose} 
          className="transition-colors" 
          style={{color: 'var(--secondary-lighter)'}}
          onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--secondary-primary)'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--secondary-lighter)'}
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <p style={{color: 'var(--secondary-lighter)'}}>Cart is empty</p>
        ) : (
          cart.map((item, index) => (
            <div 
              key={item._id || index}  // ✅ ensures unique key
              className="flex justify-between items-center pb-2"
              style={{borderBottom: '1px solid var(--base-tertiary)'}}
            >
              <div>
                <h3 className="font-medium" style={{color: 'var(--secondary-primary)'}}>{item.title}</h3>
                <p className="text-sm" style={{color: 'var(--secondary-lighter)'}}>
                  ${(item.priceCents / 100).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-sm transition-colors"
                style={{color: 'var(--error)'}}
                onMouseEnter={(e) => (e.target as HTMLElement).style.textDecoration = 'underline'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.textDecoration = 'none'}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 space-y-3" style={{borderTop: '1px solid var(--base-tertiary)'}}>
        <div className="flex justify-between font-semibold" style={{color: 'var(--secondary-primary)'}}>
          <span>Total</span>
          <span>${(totalCents / 100).toFixed(2)}</span>
        </div>
        <button
          disabled={cart.length === 0}
          className="w-full px-4 py-2 rounded-lg transition"
          style={{
            backgroundColor: cart.length === 0 ? 'var(--base-tertiary)' : 'var(--success)',
            color: cart.length === 0 ? 'var(--secondary-lighter)' : 'white',
            cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (cart.length > 0) {
              (e.target as HTMLElement).style.backgroundColor = 'var(--success)';
              (e.target as HTMLElement).style.filter = 'brightness(0.9)';
            }
          }}
          onMouseLeave={(e) => {
            if (cart.length > 0) {
              (e.target as HTMLElement).style.backgroundColor = 'var(--success)';
              (e.target as HTMLElement).style.filter = 'brightness(1)';
            }
          }}
          onClick={() => alert("Checkout flow here")}
        >
          Checkout
        </button>
        <button
          onClick={clearCart}
          className="w-full px-4 py-2 rounded-lg transition"
          style={{
            backgroundColor: 'var(--base-secondary)',
            color: 'var(--secondary-primary)'
          }}
          onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--base-secondary)'}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}