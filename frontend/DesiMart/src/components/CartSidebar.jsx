import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, updateCartQuantity, removeFromCart, clearCart, loadingCart } = useCart();
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  if (!isOpen) return null;

  // Calculate cart subtotal
  const subtotal = cart && Array.isArray(cart.items)
    ? cart.items.reduce((acc, item) => {
        const price = item.product?.discountedPrice || 0;
        return acc + (price * item.quantity);
      }, 0)
    : 0;

  // Handle quantity modification
  const handleQuantityChange = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      // Remove item if quantity falls to 0
      setUpdatingItemId(productId);
      await removeFromCart(productId);
      setUpdatingItemId(null);
    } else {
      // Otherwise update quantity
      setUpdatingItemId(productId);
      await updateCartQuantity(productId, newQty);
      setUpdatingItemId(null);
    }
  };

  // Handle Checkout Simulation
  const handleCheckout = async () => {
    setCheckingOut(true);
    // Simulate payment / checkout processing delay
    setTimeout(async () => {
      const success = await clearCart(true); // Silent clear
      setCheckingOut(false);
      if (success) {
        toast.success('🎉 Order Placed Successfully! Thank you for shopping with DesiMart.', {
          position: 'top-center',
          autoClose: 5000,
        });
        onClose();
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-obsidian-darkest/70 backdrop-blur-sm animate-fade-in">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Cart Drawer */}
      <div className="relative w-full max-w-md h-full bg-obsidian-dark/95 border-l border-obsidian-border shadow-2xl flex flex-col justify-between z-10 animate-slide-in-right glass-panel">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-obsidian-border/50">
          <div className="flex items-center space-x-2.5">
            <svg className="h-5 w-5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-base font-extrabold text-slate-100 uppercase tracking-wider">Your Cart Bag</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-neon-cyan transition-colors p-1.5 hover:bg-slate-900/60 rounded-full cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Content (Items List) */}
        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
          {loadingCart && cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <svg className="animate-spin h-8 w-8 text-neon-cyan" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Updating Cart...</span>
            </div>
          ) : !cart || !Array.isArray(cart.items) || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-5 py-12">
              <div className="h-16 w-16 bg-slate-900/40 rounded-full border border-obsidian-border flex items-center justify-center">
                <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-300">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto leading-relaxed">
                  Explore DesiMart luxury products and add items to your cart list to view them here.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue text-xs font-bold text-obsidian-darkest hover:opacity-90 transition-all glow-btn-cyan cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.items.map((item) => {
              const product = item.product;
              if (!product) return null;

              const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : null;
              const isItemUpdating = updatingItemId === product._id;

              return (
                <div 
                  key={product._id} 
                  className="flex items-center space-x-4 p-3.5 bg-slate-900/30 rounded-xl border border-obsidian-border/50 hover:border-obsidian-border transition-colors group relative"
                >
                  {/* Product Thumbnail */}
                  <div className="h-16 w-16 bg-obsidian-card rounded-lg overflow-hidden flex-shrink-0 border border-obsidian-border/30">
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-obsidian-dark to-slate-900">
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest text-center">No Pic</span>
                      </div>
                    )}
                  </div>

                  {/* Info details */}
                  <div className="flex-grow overflow-hidden text-left">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block leading-none mb-1">{product.brand}</span>
                    <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-neon-cyan transition-colors">{product.name}</h4>
                    <span className="text-xs font-extrabold text-slate-100 block mt-1 glow-text-cyan">₹{product.discountedPrice}</span>
                    
                    {/* Controls Row */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-obsidian-border bg-obsidian-darkest rounded-lg h-7">
                        <button
                          disabled={isItemUpdating}
                          onClick={() => handleQuantityChange(product._id, item.quantity, -1)}
                          className="px-2 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-30 cursor-pointer h-full flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-[11px] font-bold text-slate-300 min-w-[20px] text-center">
                          {isItemUpdating ? '..' : item.quantity}
                        </span>
                        <button
                          disabled={isItemUpdating}
                          onClick={() => handleQuantityChange(product._id, item.quantity, 1)}
                          className="px-2 text-slate-400 hover:text-neon-cyan transition-colors disabled:opacity-30 cursor-pointer h-full flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button 
                    disabled={isItemUpdating}
                    onClick={() => removeFromCart(product._id)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg cursor-pointer absolute top-2 right-2 disabled:opacity-30"
                    title="Remove item"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer Summary */}
        {cart && Array.isArray(cart.items) && cart.items.length > 0 && (
          <div className="border-t border-obsidian-border bg-obsidian-darkest/90 p-6 space-y-4">
            {/* Price Calculations */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Shipping fee</span>
                <span className="text-neon-cyan uppercase font-bold tracking-widest text-[10px]">Free Shipping</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-obsidian-border/30">
                <span className="text-sm font-bold text-slate-300">Total Subtotal</span>
                <span className="text-lg font-black text-slate-100 glow-text-cyan">₹{subtotal}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <button
                disabled={checkingOut}
                onClick={() => clearCart(false)}
                className="w-full py-3 rounded-xl border border-obsidian-border hover:bg-slate-900/60 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-center disabled:opacity-30"
              >
                Clear Cart
              </button>
              
              <button
                disabled={checkingOut}
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-xs font-bold text-obsidian-darkest glow-btn-cyan cursor-pointer text-center flex items-center justify-center space-x-2 disabled:opacity-75"
              >
                {checkingOut ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-obsidian-darkest" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <span>Checkout</span>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
