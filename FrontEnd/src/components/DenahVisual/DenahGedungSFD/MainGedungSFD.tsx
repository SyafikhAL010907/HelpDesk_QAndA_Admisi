'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLantai3 from '@/components/DenahVisual/DenahGedungSFD/Lantai3/MainLantai3';
import MainLantai8 from '@/components/DenahVisual/DenahGedungSFD/Lantai8/MainLantai8';

export default function MainGedungSFD() {
  const [activeLantai, setActiveLantai] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
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
        <div
          onClick={() => setActiveLantai(3)}
          className="cursor-pointer bg-white border-2 border-emerald-100 hover:border-emerald-500 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group min-h-100"
        >
          {/* Container Gambar - Proporsi pas h-64 */}
          <div className="w-full h-64 mb-6 bg-emerald-50/50 rounded-xl flex items-center justify-center relative overflow-hidden">
            <img 
              src="/Lantai3.png" 
              alt="Preview Denah Lantai 3" 
              className="w-full h-full object-contain p-3"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col items-center text-center mt-auto">
            <h2 className="text-2xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
              Lantai 3
            </h2>
            <p className="text-base text-gray-500 mt-2">Buka popup denah Lantai 3</p>
          </div>
        </div>

        {/* Kotak Lantai 8 */}
        <div
          onClick={() => setActiveLantai(8)}
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
            <p className="text-base text-gray-500 mt-2">Buka popup denah Lantai 8</p>
          </div>
        </div>
        
      </div>

      {/* FULLSCREEN POPUP DENGAN ANIMASI ZOOM MEMBESAR & MENGECIL (FRAMER MOTION) */}
      <AnimatePresence>
        {activeLantai !== null && (
          <motion.div
            key="modal-backdrop-sfd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center"
          >
            <motion.div
              key="modal-content-sfd"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 28,
                duration: 0.22,
              }}
              className="w-full h-full bg-white flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Fullscreen Popup */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-xs z-10">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-sm shadow-xs">
                    Lantai {activeLantai}
                  </span>
                  <div>
                    <h2 className="font-bold text-gray-900 text-xl leading-tight">
                      Denah Visual Gedung SFD - Lantai {activeLantai}
                    </h2>
                    <p className="text-xs text-gray-500">Tampilan denah interaktif layar penuh</p>
                  </div>
                </div>

                {/* Tombol Silang (X) untuk Menutup */}
                <button
                  onClick={() => setActiveLantai(null)}
                  aria-label="Tutup popup"
                  className="cursor-pointer p-2.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all duration-200"
                >
                  <X className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>

              {/* Konten Fullscreen (Scrollable) */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
                {activeLantai === 3 && <MainLantai3 />}
                {activeLantai === 8 && <MainLantai8 />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}