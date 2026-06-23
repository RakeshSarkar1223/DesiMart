import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function ProductList({ onOpenAuth, onOpenCart }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Seller toggle: show all products vs only seller's own products
  const [showOnlyOwnProducts, setShowOnlyOwnProducts] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Categories list
  const categories = ['All', 'Groceries', 'Fashion', 'Wellness', 'Handloom'];

  // Check if current user is a Seller
  const isSeller = user && (Array.isArray(user.role) ? user.role.includes('seller') : user.role === 'seller');

  // Reset seller toggle if user logs out or role changes
  useEffect(() => {
    if (!isSeller) {
      setShowOnlyOwnProducts(false);
    }
  }, [user, isSeller]);

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const url = showOnlyOwnProducts 
        ? 'http://localhost:5000/api/v1/products/seller'
        : 'http://localhost:5000/api/v1/products';
      const response = await axios.get(url, { withCredentials: true });
      setProducts(response.data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load products.');
      setProducts([]);
      toast.error(err.response?.data?.message || 'Error loading product catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [showOnlyOwnProducts]);

  // Filter & Sort Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') {
      return a.discountedPrice - b.discountedPrice;
    }
    if (sortBy === 'price_desc') {
      return b.discountedPrice - a.discountedPrice;
    }
    if (sortBy === 'rating') {
      return (b.averageRating || 0) - (a.averageRating || 0);
    }
    return 0; // default order
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Catalog Header Hero */}
      <div className="text-center py-10 md:py-16 mb-10 rounded-3xl bg-gradient-to-r from-obsidian-card via-obsidian-dark to-obsidian-card border border-obsidian-border/70 p-6 md:p-12 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-neon-blue/5 rounded-full blur-3xl"></div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-neon-cyan via-white to-neon-blue bg-clip-text text-transparent glow-text-cyan">
          {showOnlyOwnProducts ? 'My Listed Products' : 'Experience Desi Luxury'}
        </h1>
        <p className="mt-4 text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          {showOnlyOwnProducts 
            ? 'Manage and review your store inventory items currently listed on DesiMart marketplace.'
            : 'Discover handpicked artisanal creations, organic farm goods, and premium wellness essentials sourced directly from diverse regions of India.'}
        </p>
      </div>

      {/* Catalog Search & Filters Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8 border border-obsidian-border bg-obsidian-card/45 backdrop-blur-md rounded-2xl p-4">
        
        {/* Left Side: Search & Seller Toggle */}
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3 items-center">
          {/* Search Field */}
          <div className="relative w-full sm:w-64">
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-obsidian-border bg-obsidian-dark px-3.5 py-2 pl-9 text-xs text-slate-200 outline-none focus:border-neon-cyan transition-colors"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Seller Toggle Segmented Control */}
          {isSeller && (
            <div className="flex bg-obsidian-dark border border-obsidian-border p-1 rounded-xl w-full sm:w-auto text-left">
              <button
                type="button"
                onClick={() => setShowOnlyOwnProducts(false)}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  !showOnlyOwnProducts 
                    ? 'bg-neon-cyan text-obsidian-darkest glow-btn-cyan' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Marketplace
              </button>
              <button
                type="button"
                onClick={() => setShowOnlyOwnProducts(true)}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  showOnlyOwnProducts 
                    ? 'bg-neon-cyan text-obsidian-darkest glow-btn-cyan' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                My Products
              </button>
            </div>
          )}
        </div>

        {/* Center: Categories Selector */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer border uppercase tracking-wider ${
                selectedCategory === cat 
                  ? 'bg-neon-cyan text-obsidian-darkest border-neon-cyan glow-btn-cyan' 
                  : 'bg-obsidian-dark border-obsidian-border text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Side: Sort Dropdown */}
        <div className="relative w-full lg:w-44 flex items-center space-x-2 text-left">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-grow rounded-lg border border-obsidian-border bg-obsidian-dark px-3 py-2 text-xs text-slate-300 outline-none focus:border-neon-cyan cursor-pointer transition-colors"
          >
            <option value="default">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

      </div>

      {/* Skeletons Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-panel rounded-2xl h-[380px] border border-obsidian-border p-5 flex flex-col justify-between">
              <div className="w-full bg-obsidian-dark rounded-xl h-44 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3.5 bg-obsidian-dark rounded w-2/3"></div>
                <div className="h-3 bg-obsidian-dark rounded w-full"></div>
                <div className="h-3 bg-obsidian-dark rounded w-5/6"></div>
              </div>
              <div className="h-6 bg-obsidian-dark rounded w-1/3 mt-6"></div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        /* Empty Catalog State (User request: show no product found) */
        <div className="glass-panel border border-obsidian-border rounded-2xl p-16 text-center animate-fade-in max-w-md mx-auto my-12">
          <svg className="mx-auto h-12 w-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-base font-bold text-slate-300">No Products Found</h3>
          <p className="mt-2 text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {showOnlyOwnProducts 
              ? "You have not listed any products yet. Open your dashboard to post a new listing."
              : "There are no products available in the store at the moment. Please check back later."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSortBy('default'); }}
              className="rounded-lg border border-obsidian-border bg-obsidian-dark hover:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <button 
              onClick={fetchProducts}
              className="rounded-lg bg-obsidian-border hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              Retry Load
            </button>
          </div>
        </div>
      ) : (
        /* Products Catalog Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16 animate-fade-in">
          {sortedProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onClick={(p) => setSelectedProduct(p)} 
            />
          ))}
        </div>
      )}

      {/* Product Detailed Spec Modal Overlay */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onOpenCart={onOpenCart}
        />
      )}

    </div>
  );
}
