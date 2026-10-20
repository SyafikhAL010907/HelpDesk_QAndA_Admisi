'use client';

/**
 * Denah Gedung SFD - Lantai 3 (Tower A)
 * MOBILE VIEW (Premium UI + Animasi Fullscreen)
 */

import React, { useState } from 'react';

// 🔥 Vasya AI Note: Kita IMPORT Data, SVG, & Modal Premium dari WebTabLayout!
import { DenahL3SFD as DenahSvgSfd } from '../DenahL3SFD/DenahL3SFD';
import { 
  Legenda, 
  RoomPopupSfd, 
  DaftarRuangan, 
  cariRuangan 
} from '../Web&Tab/Web&TabLayout';

export default function MobileLayoutSfd() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.6);
  
  const selectedRoom = selectedCode ? cariRuangan(selectedCode) : null;
  const ubahZoom = (d: number) => setZoom((z) => Math.min(3, Math.max(1, Math.round((z + d) * 10) / 10)));

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen pb-10">
      
      {/* Header Premium */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Gedung SFD · Lt. 3</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Geser peta, zoom, & ketuk ruangan.</p>
      </div>

      {/* Area Denah (Zoomable) */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <Legenda />
          <div className="flex shrink-0 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 active:bg-slate-100 font-bold shadow-sm" onClick={() => ubahZoom(-0.4)} disabled={zoom <= 1}>−</button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 active:bg-slate-100 font-bold shadow-sm" onClick={() => ubahZoom(0.4)} disabled={zoom >= 3}>+</button>
          </div>
        </div>
        
        {/* SVG Container dgn Zoom */}
        <div className="overflow-auto rounded-xl bg-slate-50/50 border border-slate-100">
          <div style={{ width: `${zoom * 100}%`, transition: 'width 0.25s ease-out' }}>
            <DenahSvgSfd 
              selectedCode={selectedCode} 
              onSelectRoom={setSelectedCode} 
              className="block h-auto w-full" 
            />
          </div>
        </div>
      </div>

      {/* Daftar Ruangan List View */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <h3 className="mb-3 px-1 text-sm font-bold text-slate-800 uppercase tracking-wider">Daftar Ruangan</h3>
        <DaftarRuangan selected={selectedCode} onSelect={setSelectedCode} grid />
      </div>

      {/* Trigger Modal Premium (Tampil Fullscreen di Mobile dgn Animasi) */}
      {selectedRoom && (
        <RoomPopupSfd 
          key={selectedRoom.kode} 
          ruangan={selectedRoom} 
          onClose={() => setSelectedCode(null)} 
        />
      )}
    </div>
  );
}