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
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Clock,
  Compass
} from 'lucide-react';

const gedungList = [
  {
    name: 'Gedung LE',
    subtitle: 'Rumpun Elektro',
    desc: 'Lihat denah visual Gedung LE lantai 1–4, ruangan laboratorium, dan ruang dosen.',
    href: '/denah-le',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    badge: 'bg-blue-100/70 text-blue-700',
    borderHover: 'hover:border-blue-400 hover:shadow-blue-100',
    iconColor: 'text-blue-600',
    floors: '4 Lantai',
  },
  {
    name: 'Gedung LS',
    subtitle: 'Rumpun Sipil',
    desc: 'Lihat denah visual Gedung LS lantai 1–4, ruang kelas, dan fasilitas praktikum.',
    href: '/denah-ls',
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    badge: 'bg-emerald-100/70 text-emerald-700',
    borderHover: 'hover:border-emerald-400 hover:shadow-emerald-100',
    iconColor: 'text-emerald-600',
    floors: '4 Lantai',
  },
  {
    name: 'Gedung SFD',
    subtitle: 'Tower Smart Floor',
    desc: 'Eksplorasi denah interaktif lantai 3 dan lantai 8 Gedung SFD Tower A.',
    href: '/denah-sfd',
    color: 'from-teal-500 to-cyan-600',
    bgLight: 'bg-teal-50',
    badge: 'bg-teal-100/70 text-teal-700',
    borderHover: 'hover:border-teal-400 hover:shadow-teal-100',
    iconColor: 'text-teal-600',
    floors: 'Lantai 3 & 8',
  },
];

const highlights = [
  {
    icon: Compass,
    title: 'Denah Visual Interaktif',
    desc: 'Navigasi denah ruangan kampus dengan mudah per lantai secara visual.',
  },
  {
    icon: MessageSquare,
    title: 'Live Chat Bantuan',
    desc: 'Terhubung langsung dengan tim HelpDesk Admisi UNJ secara real-time.',
  },
  {
    icon: Clock,
    title: 'Informasi Terpadu 2026',
    desc: 'Akses jadwal penting PENMABA, ruang ujian, dan panduan admisi lengkap.',
  },
];

export default function WebTabLayout() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/20 flex flex-col font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* Navbar Desktop & Tablet */}
      <nav className="w-full px-8 lg:px-14 py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3.5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Image
              src="/unj.png"
              alt="Logo UNJ"
              width={44}
              height={44}
              className="object-contain drop-shadow-sm"
              priority
            />
          </motion.div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Admin UNJ</h1>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">HelpDesk Admisi</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#denah-gedung"
            className="text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors px-4 py-2 rounded-xl hover:bg-slate-50"
          >
            Denah Kampus
          </a>
          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-emerald-200/50 hover:shadow-emerald-300/60 active:scale-[0.97]"
          >
            <LogIn size={15} />
            Masuk Akun
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-8 lg:px-14 py-16 lg:py-24 max-w-6xl mx-auto w-full">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full mb-6 shadow-xs">
            <Sparkles size={14} className="text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700">Pusat Bantuan & Navigasi Kampus UNJ</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            Selamat Datang di{' '}
            <span className="bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              HelpDesk UNJ
            </span>
          </h2>

          <p className="text-base lg:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Portal resmi layanan informasi dan bantuan calon mahasiswa baru Universitas Negeri Jakarta. Temukan lokasi gedung, jadwal penting, atau konsultasi langsung dengan staf HelpDesk.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-row items-center justify-center gap-4 mb-20"
        >
          <Link
            href="/login"
            className="flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black transition-all duration-300 shadow-xl shadow-emerald-200/60 hover:shadow-emerald-300/70 hover:-translate-y-0.5 active:scale-[0.98] group"
          >
            <MessageSquare size={18} />
            Chat dengan Admin
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#denah-gedung"
            className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 rounded-2xl text-sm font-black transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5"
          >
            <MapPin size={18} />
            Eksplorasi Denah
          </a>
        </motion.div>

        {/* Highlight Features Row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-20"
        >
          {highlights.map((item) => (
            <div
              key={item.title}
              className="bg-white/70 backdrop-blur-sm border border-slate-100 p-6 rounded-3xl shadow-xs flex items-start gap-4 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <item.icon size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Denah Gedung Section */}
        <motion.div
          id="denah-gedung"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full mb-3 text-slate-600 text-xs font-bold">
              <MapPin size={13} className="text-emerald-600" />
              <span>Peta Kampus</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Denah Gedung Kampus
            </h3>
            <p className="text-sm text-slate-400 font-medium mt-2 max-w-md mx-auto">
              Pilih gedung yang ingin Anda kunjungi untuk melihat peta visual interaktif per lantai
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gedungList.map((gedung, idx) => (
              <motion.div
                key={gedung.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={gedung.href}
                  className={`block h-full p-7 bg-white border-2 border-slate-100 ${gedung.borderHover} rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-14 h-14 ${gedung.bgLight} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Building2 size={26} className={gedung.iconColor} />
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${gedung.badge}`}>
                        {gedung.floors}
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-slate-800 mb-0.5 group-hover:text-slate-900 transition-colors">
                      {gedung.name}
                    </h4>
                    <p className="text-xs font-bold text-emerald-600 mb-2">{gedung.subtitle}</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                      {gedung.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-emerald-600 group-hover:text-emerald-700">
                    <span>Lihat Denah Visual</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </section>

      {/* Footer Desktop */}
      <footer className="w-full px-8 lg:px-14 py-6 border-t border-slate-100 bg-white/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>© 2026 Universitas Negeri Jakarta — Sistem Bantuan & Informasi Admisi</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#denah-gedung" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
              Denah Gedung
            </a>
            <Link
              href="/login"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              Login HelpDesk →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
