'use client';

/**
 * Booking - Gedung LE Lantai 2
 * Web & Tablet Layout
 */

import React from 'react';
import Link from 'next/link';
import { ROOMS } from '../../Web&Tab/Web&TabLayout';

export default function WebTabLayout() {
  const rooms = Object.values(ROOMS);

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50 p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
      <header className="mb-6">
        <Link
          href="/denah-le/lantai2"
          className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-700 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Kembali ke Denah Lantai 2
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Booking · Gedung LE · Lantai 2
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Daftar booking di semua ruangan lantai 2.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((r) => (
          <Link
            key={r.kode}
            href={`/denah-le/lantai2/${encodeURIComponent(r.kode)}`}
            className="group rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:border-sky-300 hover:shadow-md"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`h-3 w-3 rounded-full ${r.bookable ? 'bg-sky-500 shadow-sm shadow-sky-400' : 'bg-slate-300'}`} />
              <h3 className="font-bold text-slate-800 group-hover:text-sky-700 transition-colors">{r.nama}</h3>
            </div>
            <p className="text-xs text-slate-500">
              {r.bookable ? "Tersedia" : "Tidak tersedia"}
              
            </p>
          </Link>
        ))}
      </div>
      </div>
    </div>
  );
}
