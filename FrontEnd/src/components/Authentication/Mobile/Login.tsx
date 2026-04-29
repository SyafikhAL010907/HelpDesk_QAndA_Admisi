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

const MobileLogin = ({ onNavigate, onLogin, loading, captcha, onRefreshCaptcha }: LoginProps) => {
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
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-slate-50 flex flex-col p-8 relative overflow-hidden font-sans">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"></div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="flex flex-col items-center mb-12">
          <Logo />
          <h2 className="text-2xl font-black text-slate-800 mt-10 tracking-tight">Masuk HelpDesk</h2>
          <p className="text-xs font-bold text-slate-400 mt-2 text-center uppercase tracking-widest">Mobile Auth (DB Captcha)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kata Sandi</label>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>

          {/* DB CAPTCHA SECTION */}
          <div className="p-4 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 space-y-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">DB Captcha</span>
                </div>
                <button type="button" onClick={onRefreshCaptcha} className="text-[9px] font-bold text-emerald-600">REFRESH</button>
             </div>
             <div className="flex items-center gap-3">
                <div className="px-3 py-2 bg-white rounded-xl border border-emerald-100 text-base font-black text-emerald-700 shadow-sm">
                    {captcha.pertanyaan || '...'} = ?
                </div>
                <input 
                    type="text"
                    placeholder="Hasil?"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className={cn(
                        "flex-1 px-4 py-3 rounded-xl text-sm font-black focus:outline-none transition-all",
                        isCaptchaSolved 
                            ? "bg-emerald-100 text-emerald-700 border-emerald-300 ring-4 ring-emerald-500/10" 
                            : "bg-white border-slate-100 text-slate-700 shadow-sm"
                    )}
                />
             </div>
          </div>

          <button 
            type="submit"
            disabled={!isCaptchaSolved || loading}
            className={cn(
                "w-full py-5 rounded-2xl font-black text-base shadow-xl transition-all mt-4 flex items-center justify-center gap-2",
                isCaptchaSolved && !loading
                    ? "bg-linear-to-br from-emerald-500 to-emerald-700 text-white shadow-emerald-200 active:scale-[0.97]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            {loading ? 'MEMPROSES...' : 'LANJUT SEKARANG'}
          </button>
        </form>

        <div className="text-center mt-8">
          <a href="#" className="text-[10px] text-emerald-600 font-black uppercase tracking-widest hover:underline">Lupa password?</a>
        </div>
      </div>

      <div className="pb-4 text-center relative z-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Belum punya akun?{' '}
          <button onClick={onNavigate} className="text-emerald-600 font-black">
            Daftar Sekarang
          </button>
        </p>
      </div>
    </div>
  );
};

export default MobileLogin;
