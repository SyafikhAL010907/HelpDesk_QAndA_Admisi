'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLantai1 from '@/components/DenahVisual/DenahGedungLE/Lantai1/MainLantai1';
import MainLantai2 from '@/components/DenahVisual/DenahGedungLE/Lantai2/MainLantai2';
import MainLantai3 from '@/components/DenahVisual/DenahGedungLE/Lantai3/MainLantai3';
import MainLantai4 from '@/components/DenahVisual/DenahGedungLE/Lantai4/MainLantai4';

export default function MainGedungLE() {
  const [activeLantai, setActiveLantai] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Denah Visual Gedung LE
        </h1>
        <p className="text-gray-500 text-base">
          Silakan pilih lantai untuk melihat denah visual
        </p>
      </div>

      {/* Grid 2 Kolom untuk 4 Kotak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        
        {/* Kotak Lantai 1 */}
        <div
          onClick={() => setActiveLantai(1)}
          className="cursor-pointer bg-white border-2 border-blue-100 hover:border-blue-500 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-64"
        >
          <div className="w-full h-36 mb-4 bg-blue-50/50 rounded-xl flex items-center justify-center relative overflow-hidden">
            <img 
              src="/Lantai3.png" 
              alt="Preview Denah Lantai 1" 
              className="w-full h-full object-contain p-2"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Lantai 1</h2>
            <p className="text-sm text-gray-500 mt-1">Buka popup denah Lantai 1</p>
          </div>
        </div>

        {/* Kotak Lantai 2 */}
        <div
          onClick={() => setActiveLantai(2)}
          className="cursor-pointer bg-white border-2 border-indigo-100 hover:border-indigo-500 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-64"
        >
          <div className="w-full h-36 mb-4 bg-indigo-50/50 rounded-xl flex items-center justify-center relative overflow-hidden">
            <img 
              src="/Lantai3.png" 
              alt="Preview Denah Lantai 2" 
              className="w-full h-full object-contain p-2"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">Lantai 2</h2>
            <p className="text-sm text-gray-500 mt-1">Buka popup denah Lantai 2</p>
          </div>
        </div>

        {/* Kotak Lantai 3 */}
        <div
          onClick={() => setActiveLantai(3)}
          className="cursor-pointer bg-white border-2 border-purple-100 hover:border-purple-500 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-64"
        >
          <div className="w-full h-36 mb-4 bg-purple-50/50 rounded-xl flex items-center justify-center relative overflow-hidden">
            <img 
              src="/Lantai3.png" 
              alt="Preview Denah Lantai 3" 
              className="w-full h-full object-contain p-2"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Lantai 3</h2>
            <p className="text-sm text-gray-500 mt-1">Buka popup denah Lantai 3</p>
          </div>
        </div>

        {/* Kotak Lantai 4 */}
        <div
          onClick={() => setActiveLantai(4)}
          className="cursor-pointer bg-white border-2 border-teal-100 hover:border-teal-500 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-64"
        >
          <div className="w-full h-36 mb-4 bg-teal-50/50 rounded-xl flex items-center justify-center relative overflow-hidden">
            <img 
              src="/Lantai3.png" 
              alt="Preview Denah Lantai 4" 
              className="w-full h-full object-contain p-2"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">Lantai 4</h2>
            <p className="text-sm text-gray-500 mt-1">Buka popup denah Lantai 4</p>
          </div>
        </div>

      </div>

      {/* FULLSCREEN POPUP */}
      <AnimatePresence>
        {activeLantai !== null && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center"
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 28,
                duration: 0.22 
              }}
              className="w-full h-full bg-white flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-xs z-10">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-sm shadow-xs">
                    Lantai {activeLantai}
                  </span>
                  <div>
                    <h2 className="font-bold text-gray-900 text-xl leading-tight">
                      Denah Visual Gedung LE - Lantai {activeLantai}
                    </h2>
                    <p className="text-xs text-gray-500">Tampilan denah interaktif layar penuh</p>
                  </div>
                </div>

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
                {activeLantai === 1 && <MainLantai1 />}
                {activeLantai === 2 && <MainLantai2 />}
                {activeLantai === 3 && <MainLantai3 />}
                {activeLantai === 4 && <MainLantai4 />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}