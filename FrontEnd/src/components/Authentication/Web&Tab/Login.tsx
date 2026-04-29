'use client';

import React, { useState } from 'react';
import Logo from '@/components/Shared/Logo';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginProps {
    onNavigate: () => void;
    onLogin: (payload: any) => void;
    loading: boolean;
    captcha: { kode: number, pertanyaan: string, jawaban: string };
    onRefreshCaptcha: () => void;
}

const WebLogin = ({ onNavigate, onLogin, loading, captcha, onRefreshCaptcha }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  
  const isCaptchaSolved = userAnswer === captcha.jawaban;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptchaSolved) return;
    onLogin({ gmail: email, password });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-emerald-200/50 p-10 border border-white relative z-10 transition-all hover:shadow-emerald-200">
        <div className="flex flex-col items-center mb-10">
          <Logo />
          <h2 className="text-xl font-black text-slate-800 mt-8 tracking-tight">Selamat Datang</h2>
          <p className="text-xs font-bold text-slate-400 mt-1 text-center uppercase tracking-widest">Login (DB Captcha Enabled)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kata Sandi</label>
              <a href="#" className="text-[10px] text-emerald-600 font-black uppercase tracking-widest hover:underline">Lupa?</a>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* DB CAPTCHA SECTION */}
          <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 space-y-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">DB Security</span>
                </div>
                <button type="button" onClick={onRefreshCaptcha} className="text-[9px] font-bold text-emerald-600 hover:rotate-180 transition-transform duration-500">REFRESH</button>
             </div>
             <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-white rounded-xl border border-emerald-100 text-lg font-black text-emerald-700 shadow-sm">
                    {captcha.pertanyaan || '...'} = ?
                </div>
                <input 
                    type="text"
                    placeholder="Jawab?"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className={cn(
                        "flex-1 px-4 py-3 rounded-xl text-sm font-black focus:outline-none transition-all",
                        isCaptchaSolved 
                            ? "bg-emerald-100 text-emerald-700 border-emerald-300 ring-4 ring-emerald-500/10" 
                            : "bg-white border-slate-100 text-slate-700"
                    )}
                />
             </div>
          </div>

          <button 
            type="submit"
            disabled={!isCaptchaSolved || loading}
            className={cn(
                "w-full py-5 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2",
                isCaptchaSolved && !loading
                    ? "bg-linear-to-br from-emerald-500 to-emerald-700 text-white shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            )}
          >
            {loading ? 'MEMPROSES...' : 'MASUK SEKARANG'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Belum punya akun?{' '}
            <button onClick={onNavigate} className="text-emerald-600 font-black hover:underline">
              Daftar di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebLogin;
