import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ currentPath, onNavigate, onOpenAuth, onOpenAddProduct, onOpenCart }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isSeller = user && (Array.isArray(user.role) ? user.role.includes('seller') : user.role === 'seller');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-obsidian-border bg-obsidian-darkest/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={() => onNavigate('/')}
            className="flex items-center space-x-2 focus:outline-none cursor-pointer group text-left"
          >
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent glow-text-cyan group-hover:opacity-90 transition-opacity">
              DesiMart
            </span>
            <span className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse"></span>
            <span className="hidden sm:inline-block text-[10px] text-slate-500 uppercase tracking-widest pl-2 border-l border-obsidian-border font-semibold">
              E-Commerce Store
            </span>
          </button>

          {/* Right Section: Authentication / Profile Dropdown or Login button */}
          <div className="flex items-center space-x-4">
            {isSeller && (
              <button
                type="button"
                onClick={onOpenAddProduct}
                className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-accent-purple to-neon-blue px-3 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs font-bold text-slate-100 hover:opacity-90 transition-all glow-btn-cyan cursor-pointer"
              >
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Product</span>
              </button>
            )}

            {user && (
              <button
                type="button"
                onClick={onOpenCart}
                className="relative p-2 text-slate-400 hover:text-neon-cyan transition-colors rounded-full hover:bg-slate-900/50 cursor-pointer border border-transparent hover:border-obsidian-border"
                title="Open Cart"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-[9px] font-black text-white shadow-md shadow-red-500/20">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Trigger Button */}
                <button
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className="flex items-center space-x-2 focus:outline-none cursor-pointer group p-1 rounded-full hover:bg-slate-900/50 transition-all border border-transparent hover:border-obsidian-border"
                >
                  {user.avatar?.url ? (
                    <img 
                      src={user.avatar.url} 
                      alt={user.name} 
                      className="h-9 w-9 rounded-full object-cover border-2 border-neon-cyan group-hover:border-neon-blue transition-colors shadow-lg"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-neon-cyan to-neon-blue text-obsidian-darkest font-bold text-sm uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="hidden md:inline-block text-xs font-semibold text-slate-300 group-hover:text-slate-100 transition-colors max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <svg 
                    className={`h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu (Glassmorphic) */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-60 rounded-xl border border-obsidian-border bg-obsidian-dark/95 backdrop-blur-xl shadow-2xl p-4 animate-fade-in text-left">
                    <div className="flex items-center space-x-3 pb-3 border-b border-obsidian-border/50">
                      {user.avatar?.url ? (
                        <img 
                          src={user.avatar.url} 
                          alt={user.name} 
                          className="h-10 w-10 rounded-full object-cover border border-neon-cyan"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-neon-cyan to-neon-blue text-obsidian-darkest font-bold text-sm uppercase">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold text-slate-100 truncate">{user.name}</span>
                        <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
                      </div>
                    </div>

                    <div className="py-2.5 space-y-2 border-b border-obsidian-border/50">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onNavigate('/profile');
                        }}
                        className="w-full text-left px-2 py-1.5 hover:bg-slate-800/40 rounded text-xs text-slate-300 hover:text-neon-cyan transition-colors font-medium flex items-center gap-2 cursor-pointer"
                      >
                        <svg className="h-4 w-4 text-slate-400 group-hover:text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile / Details
                      </button>

                      <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-semibold tracking-wider px-2">
                        <span>Roles</span>
                        <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
                          {(Array.isArray(user.role) ? user.role : [user.role]).map((r) => (
                            <span key={r} className="text-[9px] font-bold text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-1.5 py-0.5 rounded uppercase">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full mt-3 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 py-2 text-xs font-semibold text-red-400 transition-colors cursor-pointer text-center"
                    >
                      Sign Out / Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue px-5 py-2 text-xs font-semibold text-obsidian-darkest glow-btn-cyan cursor-pointer hover:opacity-90 transition-all"
              >
                Sign In / Register
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
