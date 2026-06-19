import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function AuthPortal({ onClose }) {
  const { login, register } = useAuth();

  // States: 'select_role' | 'customer' | 'seller' | 'admin'
  const [stage, setStage] = useState('select_role');
  
  // Tabs: 'signin' | 'signup'
  const [tab, setTab] = useState('signin');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef(null);

  const handleBack = () => {
    setStage('select_role');
    setError('');
    setSuccess('');
    clearForm();
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const roleMapping = {
      customer: 'user',
      seller: 'seller',
      admin: 'admin'
    };
    const targetRole = roleMapping[stage];

    try {
      if (tab === 'signup') {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', targetRole);
        if (photo) {
          formData.append('photo', photo);
        }

        await register(formData);
        setSuccess('Account created successfully!');
      } else {
        await login(email, password, targetRole);
        setSuccess('Login successful!');
      }
      
      // Close modal on auth success
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md mx-auto overflow-hidden rounded-2xl glass-panel border border-obsidian-border shadow-2xl p-6 relative">
        
        {/* Portal Header */}
        <div className="relative border-b border-obsidian-border pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {stage !== 'select_role' && (
                <button 
                  onClick={handleBack}
                  className="mr-3 text-slate-400 hover:text-neon-cyan transition-colors cursor-pointer"
                  title="Back to role selection"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                {stage === 'select_role' && 'DesiMart Gateway'}
                {stage === 'customer' && (tab === 'signin' ? 'Customer Sign In' : 'Customer Register')}
                {stage === 'seller' && (tab === 'signin' ? 'Seller Sign In' : 'Seller Register')}
                {stage === 'admin' && (tab === 'signin' ? 'Admin Sign In' : 'Admin Register')}
              </h3>
            </div>
            
            {/* Close Button */}
            {onClose && (
              <button 
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-800/40"
                title="Close Portal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-xs text-green-400">
            {success}
          </div>
        )}

        {/* STAGE 1: ROLE SELECTION */}
        {stage === 'select_role' && (
          <div className="space-y-4">
            <p className="text-center text-xs text-slate-400 mb-6 leading-relaxed">
              Select your account type to connect with the backend server database.
            </p>
            
            {/* Customer Button */}
            <button 
              onClick={() => { setStage('customer'); setTab('signin'); }}
              className="flex w-full items-center p-4 rounded-xl border border-obsidian-border bg-obsidian-dark/50 hover:bg-slate-900/60 hover:border-neon-cyan/60 group transition-all duration-200 cursor-pointer"
            >
              <div className="rounded-lg bg-neon-cyan/10 p-2.5 text-neon-cyan group-hover:bg-neon-cyan/20 transition-all">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-neon-cyan transition-colors">Customer Portal</h4>
                <p className="text-[10px] text-slate-500">Access buyer profile tools.</p>
              </div>
            </button>

            {/* Seller Button */}
            <button 
              onClick={() => { setStage('seller'); setTab('signin'); }}
              className="flex w-full items-center p-4 rounded-xl border border-obsidian-border bg-obsidian-dark/50 hover:bg-slate-900/60 hover:border-neon-blue/60 group transition-all duration-200 cursor-pointer"
            >
              <div className="rounded-lg bg-neon-blue/10 p-2.5 text-neon-blue group-hover:bg-neon-blue/20 transition-all">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-neon-blue transition-colors">Seller Dashboard</h4>
                <p className="text-[10px] text-slate-500">List and manage inventory.</p>
              </div>
            </button>

            {/* Admin Button */}
            <button 
              onClick={() => { setStage('admin'); setTab('signin'); }}
              className="flex w-full items-center p-4 rounded-xl border border-obsidian-border bg-obsidian-dark/50 hover:bg-slate-900/60 hover:border-accent-purple/60 group transition-all duration-200 cursor-pointer"
            >
              <div className="rounded-lg bg-accent-purple/10 p-2.5 text-accent-purple group-hover:bg-accent-purple/20 transition-all">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-accent-purple transition-colors">Admin Console</h4>
                <p className="text-[10px] text-slate-500">Moderate accounts and platform.</p>
              </div>
            </button>
          </div>
        )}

        {/* STAGE 2: CREDENTIALS PORTAL */}
        {stage !== 'select_role' && (
          <div>
            {/* Tab Selector */}
            <div className="flex border-b border-obsidian-border mb-6">
              <button 
                type="button"
                onClick={() => { setTab('signin'); setError(''); }}
                className={`w-1/2 pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${tab === 'signin' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-slate-500'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => { setTab('signup'); setError(''); }}
                className={`w-1/2 pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${tab === 'signup' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-slate-500'}`}
              >
                Create Account
              </button>
            </div>

            {/* Google Login button only for Customer */}
            {stage === 'customer' && (
              <div className="mb-6">
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-obsidian-border bg-obsidian-dark py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <div className="my-5 flex items-center justify-between">
                  <span className="w-1/5 border-b border-obsidian-border/50"></span>
                  <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">or local credentials</span>
                  <span className="w-1/5 border-b border-obsidian-border/50"></span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Rakesh Sarkar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-obsidian-border bg-obsidian-dark px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-neon-cyan"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-obsidian-border bg-obsidian-dark px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-obsidian-border bg-obsidian-dark px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-neon-cyan"
                />
              </div>

              {tab === 'signup' && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Avatar Photo</label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-dashed border-obsidian-border bg-obsidian-dark/40 overflow-hidden hover:border-neon-cyan hover:bg-slate-900 transition-all"
                    >
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="text-left">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="text-[10px] font-semibold text-neon-cyan hover:underline cursor-pointer"
                      >
                        Upload Picture
                      </button>
                      <p className="text-[9px] text-slate-500">JPG, PNG format</p>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handlePhotoChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-neon-cyan to-neon-blue py-2.5 text-xs font-bold text-obsidian-darkest glow-btn-cyan cursor-pointer flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-obsidian-darkest" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (tab === 'signin' ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
