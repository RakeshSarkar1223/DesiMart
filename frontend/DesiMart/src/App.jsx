import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPortal from './components/AuthModal';
import Dashboards from './components/Dashboards';
import ProductList from './components/ProductList';
import AddProductModal from './components/AddProductModal';
import CartSidebar from './components/CartSidebar';
import { useAuth } from './context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('profile'); // 'profile' | 'update_profile'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Programmatic navigation helper
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleProductAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Check URL parameters for OAuth errors
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    if (errorParam) {
      toast.error(decodeURIComponent(errorParam));
      // Remove query parameters from url without reloading the page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Redirect guest if they try to access /profile
  useEffect(() => {
    if (!loading && !user && currentPath === '/profile') {
      navigate('/');
      setShowAuthModal(true);
    }
  }, [user, loading, currentPath]);

  // Reset view to default profile page when user logs out
  useEffect(() => {
    if (!user) {
      setCurrentView('profile');
      setShowCart(false);
      if (currentPath === '/profile') {
        navigate('/');
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-obsidian-darkest text-slate-100">
        <svg className="animate-spin h-10 w-10 text-neon-cyan mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Initiating DesiMart Auth Gate...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-obsidian-darkest text-slate-200 antialiased selection:bg-neon-cyan/30 selection:text-neon-cyan">
      
      {/* Navbar */}
      <Navbar 
        currentPath={currentPath}
        onNavigate={navigate} 
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenAddProduct={() => setShowAddProductModal(true)}
        onOpenCart={() => setShowCart(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-start py-12 px-4 neon-mesh-bg">
        {currentPath === '/profile' && user ? (
          <Dashboards 
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        ) : (
          <ProductList 
            refreshKey={refreshKey} 
            onOpenAuth={() => setShowAuthModal(true)} 
            onOpenCart={() => setShowCart(true)} 
          />
        )}
      </main>

      {/* POPUP MODAL OVERLAYS */}
      {showAuthModal && !user && (
        <AuthPortal onClose={() => setShowAuthModal(false)} />
      )}

      {showAddProductModal && user && (
        <AddProductModal 
          onClose={() => setShowAddProductModal(false)} 
          onProductAdded={handleProductAdded} 
        />
      )}

      {user && (
        <CartSidebar 
          isOpen={showCart} 
          onClose={() => setShowCart(false)} 
        />
      )}

      {/* Footer */}
      <footer className="border-t border-obsidian-border bg-obsidian-darkest/90 py-10 px-4 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-obsidian-border/50 text-left">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-base font-extrabold text-slate-200">DesiMart</span>
                <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulse"></span>
              </div>
              <p className="text-slate-400 max-w-xs leading-relaxed">
                Your premium destination for authentic Indian products, wellness items, handloom fabrics, and organic groceries.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-300 uppercase tracking-widest text-[10px] mb-3">Sellers</h4>
              <ul className="space-y-2">
                <li><span className="hover:text-neon-cyan cursor-pointer transition-colors">Sell on DesiMart</span></li>
                <li><span className="hover:text-neon-cyan cursor-pointer transition-colors">Merchant Portal Guidelines</span></li>
                <li><span className="hover:text-neon-cyan cursor-pointer transition-colors">Seller Protection</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-300 uppercase tracking-widest text-[10px] mb-3">Customer Service</h4>
              <ul className="space-y-2">
                <li><span className="hover:text-neon-cyan cursor-pointer transition-colors">Contact Support</span></li>
                <li><span className="hover:text-neon-cyan cursor-pointer transition-colors">Terms of Service</span></li>
                <li><span className="hover:text-neon-cyan cursor-pointer transition-colors">Privacy Policy</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
            <span>© {new Date().getFullYear()} DesiMart Marketplace. All rights reserved.</span>
            <div className="flex space-x-4">
              <span className="text-slate-600">Premium React Frontend</span>
              <span className="text-slate-600">Secure Express API</span>
            </div>
          </div>
        </div>
      </footer>

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
