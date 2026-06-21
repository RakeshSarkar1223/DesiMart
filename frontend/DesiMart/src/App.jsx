import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPortal from './components/AuthModal';
import Dashboards from './components/Dashboards';
import { useAuth } from './context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('profile'); // 'profile' | 'update_profile'
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  // Reset view to default profile page when user logs out
  useEffect(() => {
    if (!user) {
      setCurrentView('profile');
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
        onNavigateProfile={() => setCurrentView('profile')} 
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-center py-12 px-4 neon-mesh-bg">
        {!user ? (
          
          /* LOGGED OUT - SIMPLIFIED HOME SCREEN */
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent glow-text-cyan">
              DesiMart
            </h1>
            <p className="mt-3 text-xs text-slate-500 max-w-xs leading-relaxed">
              Welcome to DesiMart. Please sign in or register using the button in the top-right corner to access your account dashboard.
            </p>
          </div>

        ) : (
          
          /* LOGGED IN DASHBOARD INTERFACE */
          <Dashboards 
            currentView={currentView}
            setCurrentView={setCurrentView}
          />

        )}
      </main>

      {/* POPUP MODAL OVERLAY */}
      {showAuthModal && !user && (
        <AuthPortal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Footer */}
      <footer className="border-t border-obsidian-border bg-obsidian-darkest py-6 px-4 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-300">DesiMart</span>
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan"></span>
            <span className="text-[10px]">Auth Gate Center v1.0</span>
          </div>

          <div className="flex space-x-6 text-[10px]">
            <span className="text-slate-600">Vite React Frontend</span>
            <span className="text-slate-600">Node Express Backend</span>
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
