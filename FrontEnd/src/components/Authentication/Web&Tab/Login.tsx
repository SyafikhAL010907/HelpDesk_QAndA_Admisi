'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Shared/Logo';
import { ShieldCheck, Mail, Lock, RefreshCw, ArrowRight, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F0FDF4] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* SOPHISTICATED BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[150px]" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-5xl flex bg-white/60 backdrop-blur-3xl rounded-[48px] shadow-[0_32px_80px_rgba(16,185,129,0.12)] border border-white relative z-10 overflow-hidden">
        
        {/* LEFT PANEL - LIGHT GREEN GRADIENT BRANDING */}
        <div className="hidden lg:flex flex-1 bg-linear-to-br from-emerald-400 via-emerald-500 to-emerald-600 p-16 flex-col justify-center items-center relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-300/30 rounded-full blur-[80px] -ml-20 -mb-20" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <div className="mb-10 drop-shadow-2xl">
              <Logo onlyLogo width={150} height={150} />
            </div>
            <h1 className="text-4xl font-black text-white leading-tight drop-shadow-sm">
              Sistem Bantuan <br /> 
              <span className="text-emerald-100 italic">Admisi UNJ</span>
            </h1>
            <p className="text-emerald-50 mt-4 text-base max-w-xs leading-relaxed font-medium">
              Kelola pertanyaan calon user dengan lebih cepat, aman, dan profesional melalui dashboard terpadu.
            </p>
          </motion.div>
        </div>

        {/* RIGHT PANEL - LOGIN FORM */}
        <div className="flex-[0.8] p-12 lg:p-20 flex flex-col justify-center bg-white/40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="mb-12">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Selamat Datang</h2>
              <p className="text-slate-500 font-medium mt-2">Masuk ke akun admin Anda untuk melanjutkan.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Komersial</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@unj.ac.id"
                    className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[24px] text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kata Sandi</label>
                  <button type="button" className="text-[10px] text-emerald-600 font-black uppercase tracking-widest hover:underline">Lupa Password?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[24px] text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* LIGHT GREEN GRADIENT CAPTCHA */}
              <div className="pt-4">
                <div className="p-6 bg-linear-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-[32px] shadow-xl shadow-emerald-900/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -mr-16 -mt-16" />
                  
                  <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <ShieldCheck size={16} className="text-emerald-500" />
                      </div>
                      <span className="text-[10px] font-black text-emerald-800/60 uppercase tracking-[0.2em]">Security Verification</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        onRefreshCaptcha();
                        setUserAnswer('');
                      }} 
                      className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 hover:bg-emerald-500 hover:text-white transition-all text-emerald-600 shadow-sm border border-emerald-100"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">Refresh</span>
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                      >
                        <RefreshCw size={14} />
                      </motion.div>
                    </button>
                  </div>

                  <div className="flex items-center gap-6 relative z-10">
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black text-emerald-800/40 uppercase tracking-widest mb-1">Verify Calculation:</p>
                      <div className="text-3xl font-black text-emerald-900 tracking-tight flex items-center gap-3 whitespace-nowrap">
                        <span className="shrink-0">{captcha.pertanyaan || '...'}</span>
                        <span className="text-emerald-500">=</span>
                        <span className="text-emerald-400 animate-pulse">?</span>
                      </div>
                    </div>
                    <div className="w-32 shrink-0">
                      <input 
                        type="text"
                        placeholder="Hasil"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className={cn(
                          "w-full px-5 py-4 rounded-2xl text-center text-lg font-black focus:outline-none transition-all",
                          isCaptchaSolved 
                            ? "bg-emerald-500 text-white shadow-lg" 
                            : "bg-white border border-emerald-200 text-emerald-900 placeholder:text-emerald-200 focus:border-emerald-400"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!isCaptchaSolved || loading}
                className={cn(
                  "w-full py-5 rounded-[24px] font-black text-sm shadow-xl transition-all mt-6 flex items-center justify-center gap-3 tracking-widest",
                  isCaptchaSolved && !loading
                    ? "bg-linear-to-br from-emerald-500 to-emerald-700 text-white shadow-emerald-200"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                )}
              >
                {loading ? (
                  <RefreshCw className="animate-spin" size={20} />
                ) : (
                  <>
                    MASUK KE DASHBOARD
                    <ArrowRight size={20} className="opacity-50" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-12 pt-10 border-t border-slate-50 text-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Belum punya akun  ?{' '}
                <button onClick={onNavigate} className="text-emerald-600 font-black hover:underline ml-2">
                  Daftar sekarang
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WebLogin;
