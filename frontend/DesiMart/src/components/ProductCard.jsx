import React from 'react';

export default function ProductCard({ product, onClick }) {
  const { name, description, brand, originalPrice, discountedPrice, category, images, stock } = product;

  // Calculate discount percentage
  const discountPercent = originalPrice > discountedPrice 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  // Primary image url or default abstract gradient
  const imageUrl = images && images.length > 0 ? images[0].url : null;

  return (
    <div 
      onClick={() => onClick(product)}
      className="glass-panel glass-panel-hover rounded-2xl overflow-hidden cursor-pointer group flex flex-col h-full border border-obsidian-border"
    >
      {/* Product Image Area */}
      <div className="relative pt-[75%] bg-obsidian-dark overflow-hidden border-b border-obsidian-border/50">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-obsidian-dark to-slate-900 flex items-center justify-center group-hover:from-slate-900 group-hover:to-obsidian-dark transition-all duration-500">
            <div className="flex flex-col items-center space-y-2 opacity-40 group-hover:opacity-60 transition-opacity">
              <svg className="h-10 w-10 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">DesiMart Product</span>
            </div>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {discountPercent}% OFF
          </span>
        )}

        {/* Out of Stock Badge */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-obsidian-darkest/75 backdrop-blur-sm flex items-center justify-center">
            <span className="text-[11px] font-bold tracking-widest text-red-400 border border-red-500/30 px-3 py-1 rounded bg-red-950/20 uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex flex-col flex-grow text-left">
        {/* Brand & Category */}
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{brand}</span>
          <span className="text-[9px] font-bold text-neon-cyan bg-neon-cyan/5 border border-neon-cyan/10 px-2 py-0.5 rounded uppercase tracking-wider">
            {category}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-sm font-bold text-slate-200 line-clamp-1 group-hover:text-neon-cyan transition-colors mb-1.5">
          {name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-grow">
          {description}
        </p>

        {/* Price Tag Info */}
        <div className="flex items-baseline space-x-2 pt-3 border-t border-obsidian-border/30">
          <span className="text-base font-extrabold text-slate-100 glow-text-cyan">
            ₹{discountedPrice}
          </span>
          {originalPrice > discountedPrice && (
            <span className="text-xs text-slate-500 line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
