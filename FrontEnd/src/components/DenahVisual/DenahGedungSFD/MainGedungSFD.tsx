'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MainGedungSFD() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Tombol Kembali ke Beranda */}
      <div className="w-full max-w-5xl mb-6 flex items-center justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:text-[#183449] hover:border-[#588CBC]/40 hover:shadow-xs transition-all"
        >
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Denah Visual Gedung SFD
        </h1>
        <p className="text-gray-500 text-base md:text-lg">
          Silakan pilih lantai untuk melihat denah visual Gedung SFD
        </p>
      </div>

      {/* Grid 2 Kolom - Titik tengah: max-w-5xl */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">

        {/* Kotak Lantai 3 */}
        <Link
          href="/denah-sfd/lantai3"
          className="cursor-pointer bg-white border-2 border-slate-100 hover:border-[#588CBC] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group min-h-100"
        >
          {/* Container Gambar - Proporsi pas h-64 */}
          <div className="w-full h-64 mb-6 bg-[#588CBC]/5 rounded-xl flex items-center justify-center relative overflow-hidden">
            <img
              src="/Lantai3.png"
              alt="Preview Denah Lantai 3"
              className="w-full h-full object-contain p-3"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col items-center text-center mt-auto">
            <h2 className="text-2xl font-bold text-gray-800 group-hover:text-[#183449] transition-colors">
              Lantai 3
            </h2>
            <p className="text-base text-gray-500 mt-2">Buka denah Lantai 3</p>
          </div>
        </Link>

        {/* Kotak Lantai 8 */}
        <Link
          href="/denah-sfd/lantai8"
          className="cursor-pointer bg-white border-2 border-teal-100 hover:border-teal-500 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group min-h-100"
        >
          {/* Container Gambar - Proporsi pas h-64 */}
          <div className="w-full h-64 mb-6 bg-teal-50/50 rounded-xl flex items-center justify-center relative overflow-hidden">
            <img
              src="/Lantai3.png"
              alt="Preview Denah Lantai 8"
              className="w-full h-full object-contain p-3"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col items-center text-center mt-auto">
            <h2 className="text-2xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
              Lantai 8
            </h2>
            <p className="text-base text-gray-500 mt-2">Buka denah Lantai 8</p>
          </div>
        </Link>

      </div>
    </div>
  );
}