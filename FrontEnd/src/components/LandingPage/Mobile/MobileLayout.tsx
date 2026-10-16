'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Building2, 
  LogIn, 
  MapPin, 
  ArrowRight,
  MessageSquare,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Calendar
} from 'lucide-react';

const gedungList = [
  {
    name: 'Gedung LE',
    subtitle: 'Rumpun Elektro',
    desc: 'Denah interaktif Lantai 1–4, Lab & Ruang Dosen',
    href: '/denah-le',
    bgLight: 'bg-blue-50',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    badgeText: '4 Lantai',
  },
  {
    name: 'Gedung LS',
    subtitle: 'Rumpun Sipil',
    desc: 'Denah interaktif Lantai 1–4, Kelas & Fasilitas',
    href: '/denah-ls',
    bgLight: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    badgeText: '4 Lantai',
  },
  {
    name: 'Gedung SFD',
    subtitle: 'Tower Smart Floor',
    desc: 'Denah interaktif Lantai 3 & Lantai 8 Tower A',
    href: '/denah-sfd',
    bgLight: 'bg-teal-50',
    iconColor: 'text-teal-600',
    badge: 'bg-teal-100 text-teal-700',
    badgeText: 'Lt. 3 & 8',
  },
];

export default function MobileLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-8">
      
      {/* Mobile Top Header (Emerald Theme matching User & Admin Mobile) */}
      <div className="bg-emerald-800 rounded-b-[36px] px-6 pt-10 pb-12 shadow-xl shadow-emerald-900/10 relative overflow-hidden shrink-0">
        <div className="absolute -top-5 -right-5 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>

        <header className="relative z-10 flex flex-col gap-6">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Image
                  src="/unj.png"
                  alt="Logo UNJ"
                  width={42}
                  height={42}
                  className="drop-shadow-lg"
                  priority
                />
              </motion.div>
              <div>
                <h1 className="text-lg font-black tracking-tight leading-none">Admin UNJ</h1>
                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mt-1">HelpDesk Admisi</p>
              </div>
            </div>

            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 rounded-xl text-white text-xs font-black transition-all active:scale-95"
            >
              <LogIn size={14} />
              Masuk
            </Link>
          </div>

          <div className="text-white mt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full mb-3 text-[10px] font-bold text-emerald-200 backdrop-blur-xs">
              <Sparkles size={12} className="text-emerald-300" />
              <span>Pusat Layanan Mahasiswa Baru</span>
            </div>
            <h2 className="text-2xl font-black leading-tight">
              Selamat Datang di HelpDesk UNJ
            </h2>
            <p className="text-xs text-emerald-100/70 font-medium mt-2 leading-relaxed">
              Cari denah ruangan gedung kampus atau konsultasikan pertanyaan admisi Anda.
            </p>
          </div>
        </header>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 px-4 -mt-6 relative z-20 flex flex-col gap-5">
        
        {/* Quick Action Primary Card */}
        <div className="bg-white rounded-3xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full flex items-center justify-between p-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl transition-all shadow-lg shadow-emerald-200/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-wide">Konsultasi Langsung</p>
                <p className="text-[11px] text-emerald-100 font-medium">Chat dengan Tim HelpDesk</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-emerald-200" />
          </Link>

          <Link
            href="/login"
            className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 active:scale-[0.98] text-slate-700 rounded-2xl transition-all border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-800">Jadwal PENMABA 2026</p>
                <p className="text-[10px] text-slate-400 font-medium">Info pendaftaran & jadwal ujian</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>
        </div>

        {/* Section Header: Denah Gedung */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={16} className="text-emerald-600" />
              Denah Visual Gedung
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Pilih gedung untuk melihat tata letak ruangan</p>
          </div>
        </div>

        {/* Gedung Cards List */}
        <div className="flex flex-col gap-3">
          {gedungList.map((gedung, i) => (
            <motion.div
              key={gedung.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.3 }}
            >
              <Link
                href={gedung.href}
                className="w-full bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-all duration-200 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl ${gedung.bgLight} flex items-center justify-center ${gedung.iconColor} shrink-0`}>
                    <Building2 size={22} />
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-800 tracking-tight">{gedung.name}</h4>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${gedung.badge}`}>
                        {gedung.badgeText}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 mt-0.5">{gedung.subtitle}</span>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-0.5">{gedung.desc}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0 ml-2">
                  <ChevronRight size={16} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Info Card FAQ */}
        <div className="bg-emerald-50/60 border border-emerald-100/70 p-4 rounded-3xl flex items-start gap-3 mt-1">
          <HelpCircle size={18} className="text-emerald-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
            Perlu bantuan mendesak mengenai admisi UNJ? Silakan <Link href="/login" className="font-bold underline text-emerald-900">masuk ke akun</Link> untuk mengirim pesan ke admin secara instan.
          </p>
        </div>

      </main>

      {/* Mobile Footer */}
      <footer className="mt-8 px-6 text-center">
        <p className="text-[10px] text-slate-400 font-medium">
          © 2026 Universitas Negeri Jakarta — HelpDesk Admisi
        </p>
      </footer>

    </div>
  );
}
