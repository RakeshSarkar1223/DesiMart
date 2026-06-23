import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, onClose, onOpenCart }) {
  if (!product) return null;

  const { 
    name, 
    description, 
    brand, 
    originalPrice, 
    discountedPrice, 
    category, 
    images, 
    stock,
    averageRating,
    numOfReviews
  } = product;

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const discountPercent = originalPrice > discountedPrice 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  const imageUrl = images && images.length > 0 ? images[0].url : null;

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const success = await addToCart(product._id, quantity);
    setAddingToCart(false);
    if (success) {
      toast.success(`${quantity} x ${name} added to cart!`);
    }
  };

  const handleBuyNow = async () => {
    setAddingToCart(true);
    const success = await addToCart(product._id, quantity);
    setAddingToCart(false);
    if (success) {
      toast.success(`${quantity} x ${name} added to cart!`);
      onClose();
      if (onOpenCart) {
        onOpenCart();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-darkest/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-obsidian-border shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-neon-cyan transition-colors p-2 hover:bg-slate-900/60 rounded-full cursor-pointer"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Side: Product Image Display */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="relative pt-[80%] bg-obsidian-dark rounded-2xl overflow-hidden border border-obsidian-border/50">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-obsidian-dark to-slate-900 flex flex-col items-center justify-center">
                <svg className="h-16 w-16 text-neon-cyan/35 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs uppercase tracking-widest font-bold text-slate-500">DesiMart Product Image</span>
              </div>
            )}
            
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Product Details & Specs */}
        <div className="w-full md:w-1/2 flex flex-col justify-between text-left">
          <div>
            {/* Category and Brand */}
            <div className="flex gap-2 items-center mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{brand}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan/50"></span>
              <span className="text-[10px] font-bold text-neon-cyan bg-neon-cyan/5 border border-neon-cyan/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {category}
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight leading-tight mb-3">
              {name}
            </h2>

            {/* Ratings & Reviews */}
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`h-4.5 w-4.5 ${i < Math.round(averageRating || 0) ? 'fill-current' : 'text-slate-600'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.587 1.813l-3.974 2.896a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.104c-.773-.562-.373-1.813.587-1.813h4.907a1 1 0 00.95-.69l1.52-4.674z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {averageRating ? averageRating.toFixed(1) : 'No'} rating ({numOfReviews || 0} reviews)
              </span>
            </div>

            {/* Pricing Details */}
            <div className="flex items-baseline space-x-3 mb-6 bg-obsidian-dark/45 border border-obsidian-border/50 rounded-2xl p-4">
              <span className="text-2xl font-black text-slate-100 glow-text-cyan">
                ₹{discountedPrice}
              </span>
              {originalPrice > discountedPrice && (
                <>
                  <span className="text-sm text-slate-500 line-through">
                    ₹{originalPrice}
                  </span>
                  <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded uppercase">
                    Save ₹{originalPrice - discountedPrice}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h4>
              <p className="text-xs text-slate-300 leading-relaxed max-h-40 overflow-y-auto pr-2">
                {description}
              </p>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="space-y-4 pt-4 border-t border-obsidian-border/50">
            {/* Stock status and Quantity Selector */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400">Stock Availability:</span>
              {stock > 0 ? (
                <span className="font-bold text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full uppercase text-[10px]">
                  {stock} Items Left
                </span>
              ) : (
                <span className="font-bold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full uppercase text-[10px]">
                  Sold Out
                </span>
              )}
            </div>

            {stock > 0 && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400">Quantity:</span>
                <div className="flex items-center border border-obsidian-border rounded-lg overflow-hidden bg-obsidian-dark">
                  <button 
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(q => q - 1)}
                    className="px-3 py-1 hover:bg-slate-900 text-slate-400 disabled:opacity-30 cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-slate-200">{quantity}</span>
                  <button 
                    disabled={quantity >= stock}
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-1 hover:bg-slate-900 text-slate-400 disabled:opacity-30 cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Actions Buttons */}
            {stock > 0 ? (
              <div className="flex gap-3">
                <button 
                  disabled={addingToCart}
                  onClick={handleAddToCart}
                  className="w-1/2 rounded-xl border border-obsidian-border bg-obsidian-dark hover:bg-slate-900/50 py-3 text-xs font-bold text-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                
                <button 
                  onClick={handleBuyNow}
                  className="w-1/2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue py-3 text-xs font-bold text-obsidian-darkest glow-btn-cyan cursor-pointer text-center"
                >
                  Buy It Now
                </button>
              </div>
            ) : (
              <button 
                disabled
                className="w-full rounded-xl border border-obsidian-border bg-obsidian-dark/45 py-3 text-xs font-bold text-slate-600 cursor-not-allowed"
              >
                Out Of Stock
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
