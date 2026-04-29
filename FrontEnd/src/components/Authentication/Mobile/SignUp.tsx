'use client';

import React, { useState } from 'react';
import Logo from '@/components/Shared/Logo';

interface SignUpProps {
    onNavigate: () => void;
    onSignUp: (payload: any) => void;
    loading: boolean;
}

const MobileSignUp = ({ onNavigate, onSignUp, loading }: SignUpProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp({ username, gmail: email, password, role: 'user' });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-slate-50 flex flex-col p-8 relative overflow-hidden font-sans">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"></div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="flex flex-col items-center mb-12">
          <Logo />
          <h2 className="text-2xl font-black text-slate-800 mt-10 tracking-tight">Daftar HelpDesk</h2>
          <p className="text-xs font-bold text-slate-400 mt-2 text-center uppercase tracking-widest">Buat akun baru</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="syafikh_unj"
              className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="syafikh@gmail.com"
              className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kata Sandi</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-br from-emerald-500 to-emerald-700 text-white py-5 rounded-2xl font-black text-base shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'MEMPROSES...' : 'DAFTAR SEKARANG'}
          </button>
        </form>

        <div className="pb-4 text-center mt-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Sudah punya akun?{' '}
            <button onClick={onNavigate} className="text-emerald-600 font-black">
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileSignUp;
