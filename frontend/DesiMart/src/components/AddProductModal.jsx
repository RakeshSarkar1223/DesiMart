import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AddProductModal({ onClose, onProductAdded }) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [stock, setStock] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = ['Groceries', 'Fashion', 'Wellness', 'Handloom'];

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setPhotos((prev) => [...prev, ...files]);
      
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validations
    if (name.length < 3 || name.length > 100) {
      return toast.error('Product Name must be between 3 and 100 characters.');
    }
    if (brand.length < 2 || brand.length > 50) {
      return toast.error('Brand must be between 2 and 50 characters.');
    }
    if (description.length < 10 || description.length > 1000) {
      return toast.error('Description must be between 10 and 1000 characters.');
    }
    
    const origPriceNum = parseFloat(originalPrice);
    const discPriceNum = parseFloat(discountedPrice);
    const stockNum = parseInt(stock, 10);

    if (isNaN(origPriceNum) || origPriceNum <= 0) {
      return toast.error('Original Price must be a positive number.');
    }
    if (isNaN(discPriceNum) || discPriceNum <= 0) {
      return toast.error('Discounted Price must be a positive number.');
    }
    if (discPriceNum > origPriceNum) {
      return toast.error('Discounted Price cannot be higher than Original Price.');
    }
    if (isNaN(stockNum) || stockNum < 0) {
      return toast.error('Stock must be a non-negative integer.');
    }

    setLoading(true);
    try {
      // Build FormData payload for multi-part file uploads
      const formData = new FormData();
      formData.append('name', name);
      formData.append('brand', brand);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('originalPrice', origPriceNum);
      formData.append('discountedPrice', discPriceNum);
      formData.append('stock', stockNum);
      
      photos.forEach((photo) => {
        formData.append('photos', photo);
      });

      const response = await axios.post(
        'http://localhost:5000/api/v1/products/create',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      if (response.status === 201) {
        toast.success(`Successfully listed "${name}"!`);
        onProductAdded();
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to list product.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-darkest/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl glass-panel border border-obsidian-border shadow-2xl p-6 md:p-8 text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-neon-cyan transition-colors p-2 hover:bg-slate-900/60 rounded-full cursor-pointer"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wide mb-6 border-b border-obsidian-border pb-3">
          List New Product
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Product Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Organic Turmeric"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-obsidian-border bg-obsidian-dark px-3 py-2 text-xs text-slate-200 outline-none focus:border-neon-cyan"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Brand</label>
              <input 
                type="text" 
                required
                placeholder="e.g. PureDesi"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-lg border border-obsidian-border bg-obsidian-dark px-3 py-2 text-xs text-slate-200 outline-none focus:border-neon-cyan"
              />
            </div>
          </div>

          {/* Row 2: Category & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-obsidian-border bg-obsidian-dark px-3 py-2 text-xs text-slate-300 outline-none focus:border-neon-cyan cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Stock Quantity</label>
              <input 
                type="number" 
                required
                min="0"
                placeholder="e.g. 50"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-lg border border-obsidian-border bg-obsidian-dark px-3 py-2 text-xs text-slate-200 outline-none focus:border-neon-cyan"
              />
            </div>
          </div>

          {/* Row 3: Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Original Price (₹)</label>
              <input 
                type="number" 
                required
                min="1"
                step="any"
                placeholder="e.g. 499"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full rounded-lg border border-obsidian-border bg-obsidian-dark px-3 py-2 text-xs text-slate-200 outline-none focus:border-neon-cyan"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Discounted Price (₹)</label>
              <input 
                type="number" 
                required
                min="1"
                step="any"
                placeholder="e.g. 399"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                className="w-full rounded-lg border border-obsidian-border bg-obsidian-dark px-3 py-2 text-xs text-slate-200 outline-none focus:border-neon-cyan"
              />
            </div>
          </div>

          {/* Row 4: Photos Upload */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Product Photos</label>
            <div className="flex flex-wrap gap-3 items-center mt-1">
              {photoPreviews.map((preview, index) => (
                <div key={index} className="relative h-14 w-14 rounded-lg overflow-hidden border border-obsidian-border bg-obsidian-dark">
                  <img src={preview} alt={`preview-${index}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-0 right-0 bg-red-600/80 text-white rounded-bl p-0.5 hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              
              <label className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg border border-dashed border-obsidian-border bg-obsidian-dark hover:border-neon-cyan hover:bg-slate-900 transition-all">
                <svg className="h-5 w-5 text-slate-500 hover:text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <input 
                  type="file" 
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden" 
                />
              </label>
            </div>
            <p className="text-[9px] text-slate-500 mt-1">Upload multiple PNG/JPG product images.</p>
          </div>

          {/* Row 5: Description */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Description</label>
            <textarea 
              required
              rows="4"
              placeholder="Provide a detailed description of the product (min 10 characters)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-obsidian-border bg-obsidian-dark px-3 py-2 text-xs text-slate-200 outline-none focus:border-neon-cyan resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-obsidian-border/50">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/2 rounded-lg border border-obsidian-border bg-obsidian-dark py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-900 transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-1/2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-blue py-2.5 text-xs font-bold text-obsidian-darkest glow-btn-cyan cursor-pointer flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-obsidian-darkest" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Listing...
                </span>
              ) : 'List Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
