'use client';

/**
 * Booking - Gedung LS Lantai 2
 * Mobile Layout
 */

import React from 'react';
import Link from 'next/link';
import { ROOMS } from '../../Web&Tab/Web&TabLayout';

export default function MobileLayout() {
  const rooms = Object.values(ROOMS);

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-10 space-y-4">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <Link
          href="/denah-ls/lantai2"
          className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-sky-600"
        >
          ← Kembali
        </Link>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Booking · Lt. 2
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Gedung LS · Semua ruangan
        </p>
      </div>

      <div className="space-y-3">
        {rooms.map((r) => (
          <Link
            key={r.kode}
            href={`/denah-ls/lantai2/${encodeURIComponent(r.kode)}`}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-sm active:bg-slate-50"
          >
            <span className={`h-3 w-3 shrink-0 rounded-full ${r.bookable ? 'bg-sky-500' : 'bg-slate-300'}`} />
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-800 truncate">{r.nama}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {r.bookable ? "Tersedia" : "Tidak tersedia"}
                
              </p>
            </div>
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
