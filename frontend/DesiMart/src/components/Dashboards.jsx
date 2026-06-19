import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboards({ currentView, setCurrentView }) {
  const { user: currentUser, updateProfile, logout } = useAuth();

  // Edit form states
  const [name, setName] = useState(currentUser?.name || '');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef(null);

  // Sync edit form name when user switches or updates
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    }
  }, [currentUser, currentView]);

  if (!currentUser) return null;

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      if (photo) {
        formData.append('photo', photo);
      }

      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      
      setPhoto(null);
      setPhotoPreview(null);
      
      // Auto-redirect back to profile view after success
      setTimeout(() => {
        setSuccess('');
        setCurrentView('profile');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // ================= VIEW 1: PROFILE DETAILS PAGE =================
  if (currentView === 'profile') {
    return (
      <div className="w-full max-w-md mx-auto rounded-2xl glass-panel border border-obsidian-border shadow-2xl animate-fade-in p-6 text-center">
        
        {/* Profile Header & Avatar */}
        <div className="flex flex-col items-center pb-6 border-b border-obsidian-border/50">
          <div className="relative mb-4">
            {currentUser.avatar?.url ? (
              <img 
                src={currentUser.avatar.url} 
                alt={currentUser.name} 
                className="h-24 w-24 rounded-full object-cover border-2 border-neon-cyan shadow-xl"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-neon-cyan to-neon-blue text-obsidian-darkest font-bold text-3xl uppercase">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <span className="absolute bottom-1 right-1 flex h-4.5 w-4.5 rounded-full bg-green-500 border-2 border-obsidian-darkest animate-pulse" title="Active Session"></span>
          </div>

          <h2 className="text-xl font-bold text-slate-100">{currentUser.name}</h2>
          <p className="text-xs text-slate-400 mt-1">{currentUser.email}</p>
        </div>

        {/* Profile Body Metadata */}
        <div className="py-6 space-y-4 text-left text-xs border-b border-obsidian-border/50">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 uppercase font-semibold tracking-wider text-[10px]">Account Roles</span>
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(currentUser.role) ? currentUser.role : [currentUser.role]).map((r) => (
                <span key={r} className="inline-block text-[10px] font-bold tracking-wide text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-2.5 py-0.5 rounded-full uppercase">
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 uppercase font-semibold tracking-wider text-[10px]">Auth Provider</span>
            <span className="font-semibold text-slate-300 uppercase">{currentUser.authProvider || 'local'}</span>
          </div>
        </div>

        {/* Profile Footer Actions (Logout & Update buttons) */}
        <div className="flex flex-col gap-3 pt-6">
          <button 
            onClick={() => setCurrentView('update_profile')}
            className="w-full rounded-lg bg-gradient-to-r from-neon-cyan to-neon-blue py-2.5 text-xs font-bold text-obsidian-darkest hover:opacity-90 transition-all glow-btn-cyan cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Update Profile
          </button>
          
          <button 
            onClick={logout}
            className="w-full rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 py-2.5 text-xs font-bold text-red-400 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out / Logout
          </button>
        </div>

      </div>
    );
  }

  // ================= VIEW 2: UPDATE PROFILE FORM PAGE =================
  if (currentView === 'update_profile') {
    return (
      <div className="w-full max-w-md mx-auto rounded-2xl glass-panel border border-obsidian-border shadow-2xl animate-fade-in p-6">
        
        {/* Form Header */}
        <div className="relative border-b border-obsidian-border pb-4 mb-6 text-left">
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentView('profile')}
              className="mr-3 text-slate-400 hover:text-neon-cyan transition-colors cursor-pointer"
              title="Back to profile details"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide">
              Update Profile Details
            </h3>
          </div>
        </div>

        {/* Status Indicators */}
        {success && (
          <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-xs text-green-400">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Update Form (Name & Avatar Only) */}
        <form onSubmit={handleUpdateProfile} className="space-y-6 text-left">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Change Full Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Rakesh Sarkar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-obsidian-border bg-obsidian-dark px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-neon-cyan"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Update Avatar Photo</label>
            <div className="flex items-center space-x-4 mt-2">
              <div 
                onClick={() => fileInputRef.current.click()}
                className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-dashed border-obsidian-border bg-obsidian-dark/45 overflow-hidden hover:border-neon-cyan hover:bg-slate-900 transition-all"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : currentUser.avatar?.url ? (
                  <img src={currentUser.avatar.url} alt="Current" className="h-full w-full object-cover" />
                ) : (
                  <svg className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              
              <div className="text-left">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-[11px] font-semibold text-neon-cyan hover:underline cursor-pointer"
                >
                  Select New Image
                </button>
                <p className="text-[9px] text-slate-500">JPG, PNG. Uploads to Cloudinary.</p>
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

          {/* Form Actions (Cancel & Save Buttons) */}
          <div className="flex gap-3 pt-4 border-t border-obsidian-border/50">
            <button 
              type="button"
              onClick={() => setCurrentView('profile')}
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
                  Saving...
                </span>
              ) : 'Save Updates'}
            </button>
          </div>
        </form>

      </div>
    );
  }

  return null;
}
