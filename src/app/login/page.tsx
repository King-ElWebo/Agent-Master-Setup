'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setPassword('');
        router.push('/admin');
      } else {
        setError(data.error || 'Access denied');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('A system error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 text-brand-100 flex flex-col items-center justify-center p-6 selection:bg-white selection:text-black relative overflow-hidden">
      {/* High-end monochrome background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_65%)] pointer-events-none" />

      <div className="w-full max-w-md flex flex-col items-center space-y-10 relative z-10">
        
        {/* Minimalist Tech Lock Emblem */}
        <div className="w-20 h-20 relative mix-blend-plus-lighter">
          <div className="absolute inset-0 border border-brand-100/10 rounded-premium-lg flex items-center justify-center bg-brand-100/[0.02] shadow-[inset_0_0_12px_rgba(255,255,255,0.01)]">
            <svg 
              className={`w-8 h-8 text-brand-100 ${isLoading ? 'animate-pulse' : ''} transition-colors duration-[100ms]`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-brand-950 flex items-center justify-center">
              <div className="w-1 h-1 bg-brand-950 rounded-full animate-ping" />
            </div>
          </div>
        </div>

        {/* Brand Typography */}
        <div className="w-full space-y-3 text-center">
          <span className="text-xs tracking-[0.35em] uppercase font-semibold text-brand-100/40">
            Secure Core Gateway
          </span>
          <h1 className="text-4xl font-light tracking-tight text-brand-100">
            System Identity
          </h1>
          <p className="text-xs tracking-[0.1em] text-brand-100/30 uppercase max-w-xs mx-auto">
            Authorized Administrator Personnel Only
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-6 bg-brand-100/[0.01] border border-brand-100/5 p-8 rounded-premium-md shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.25em] text-brand-100/40 uppercase font-semibold block px-1">
              Access Token
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER SYSTEM TOKEN" 
              disabled={isLoading}
              className="w-full bg-brand-950/80 border border-brand-100/10 focus:border-white focus:ring-1 focus:ring-white/10 rounded-premium-sm py-4 px-4 text-center text-sm tracking-[0.3em] uppercase focus:outline-none transition-[border-color,box-shadow] duration-[100ms] ease-out text-brand-100 placeholder:text-brand-100/20 disabled:opacity-40"
              required
            />
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            disabled={isLoading || !password}
            className="w-full bg-brand-100 text-brand-950 hover:bg-white hover:text-brand-950 disabled:bg-brand-100/10 disabled:text-brand-100/30 py-4 rounded-premium-sm text-[11px] tracking-[0.25em] font-bold uppercase cursor-pointer active:scale-[0.97] transition-[color,background-color,transform] duration-[100ms] ease-out disabled:cursor-not-allowed select-none"
          >
            {isLoading ? 'Sealing Session...' : 'Initialize Session'}
          </button>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-950/30 border border-red-500/20 text-red-400 py-3.5 px-4 rounded-premium-sm text-xs text-center tracking-wide animate-[fluid-in_250ms_ease-out] flex items-center justify-center space-x-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
