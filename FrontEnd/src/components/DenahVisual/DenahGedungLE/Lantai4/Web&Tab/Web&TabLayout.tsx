'use client';

import React, { useEffect, useMemo, useState } from 'react';

// ============================================================================
// 1. DATA RUANGAN & TIPE - LANTAI 4
// ============================================================================
export type Hari = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
export type RoomCode =
  | 'DOSEN_INSTRUMENTASI'
  | 'R401'
  | 'TOILET'
  | 'DOSEN_ELEKTRONIKA'
  | 'TPJM'
  | 'R403'
  | 'DOSEN_MEKATRONIKA'
  | 'R407'
  | 'R406B'
  | 'DOSEN_TELEKOMUNIKASI'
  | 'R406A'
  | 'R405';

export const URUTAN_HARI: Hari[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
export const HARI_DARI_INDEX: Hari[] = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export type Jadwal = { hari: Hari; mulai: string; selesai: string; kegiatan: string; kelas: string; prodi: string; dosen: string; pj: string; kontak: string; };
export type RoomInfo = { kode: RoomCode; nama: string; bookable: boolean; kapasitas?: number; keterangan?: string; fasilitas: string[]; jadwal: Jadwal[]; };

const j = (hari: Hari, mulai: string, selesai: string, kegiatan: string, kelas: string, prodi: string, dosen: string, pj: string, kontak: string): Jadwal =>
  ({ hari, mulai, selesai, kegiatan, kelas, prodi, dosen, pj, kontak });

const PTE = 'Pendidikan Teknik Elektro';
const PTMK = 'Pendidikan Teknik Mekatronika';

// DATA DI BAWAH INI DUMMY - ganti dengan data asli / fetch API
export const ROOMS: Record<RoomCode, RoomInfo> = {
  // ===== KODE RUANGAN: DOSEN_INSTRUMENTASI - R. Dosen Instrumentasi Kendali =====
  DOSEN_INSTRUMENTASI: {
    kode: 'DOSEN_INSTRUMENTASI', nama: 'R. Dosen Instrumentasi Kendali', bookable: false, keterangan: 'Ruang khusus dosen Instrumentasi Kendali.',
    fasilitas: ['AC', 'Meja Kerja Dosen', 'WiFi'], jadwal: [],
  },

  // ===== KODE RUANGAN: R401 - R. 401 Ruang Teknisi Laboratorium/Toolman =====
  R401: {
    kode: 'R401', nama: 'R. 401 Ruang Teknisi Laboratorium/Toolman', bookable: false, keterangan: 'Ruang khusus teknisi laboratorium dan toolman.',
    fasilitas: ['Lemari Peralatan', 'Meja Kerja', 'Rak Tools'], jadwal: [],
  },

  // ===== KODE RUANGAN: TOILET =====
  TOILET: {
    kode: 'TOILET', nama: 'Toilet', bookable: false, keterangan: 'Fasilitas umum lantai 4.',
    fasilitas: ['Wastafel', 'Bilik toilet'], jadwal: [],
  },

  // ===== KODE RUANGAN: DOSEN_ELEKTRONIKA - R. Dosen Elektronika Dasar =====
  DOSEN_ELEKTRONIKA: {
    kode: 'DOSEN_ELEKTRONIKA', nama: 'R. Dosen Elektronika Dasar', bookable: false, keterangan: 'Ruang khusus dosen Elektronika Dasar.',
    fasilitas: ['AC', 'Meja Kerja Dosen', 'WiFi'], jadwal: [],
  },

  // ===== KODE RUANGAN: TPJM - R. TPjM =====
  TPJM: {
    kode: 'TPJM', nama: 'R. TPjM', bookable: false, keterangan: 'Ruang TPjM.',
    fasilitas: ['AC', 'Meja Kerja', 'WiFi'], jadwal: [],
  },

  // ===== KODE RUANGAN: R403 - R. 403 Lab. Mekatronika dan Robotika =====
  R403: {
    kode: 'R403', nama: 'R. 403 Lab. Mekatronika dan Robotika', bookable: true, kapasitas: 30,
    fasilitas: ['Trainer Mekatronika', 'Kit Robotika', 'PLC Trainer', 'PC Workstation', 'AC', 'Proyektor'],
    jadwal: [
      j('Senin', '08:00', '11:00', 'Praktikum Mekatronika', 'PTMK-3A', PTMK, 'Pak Eko, M.T.', 'Rangga', '0812-4030-0001'),
      j('Rabu', '13:00', '16:00', 'Praktikum Robotika', 'PTMK-3B', PTMK, 'Bu Wulan, M.T.', 'Dina', '0812-4030-0002'),
    ],
  },

  // ===== KODE RUANGAN: DOSEN_MEKATRONIKA - R. Dosen Mekatronika dan Robotika =====
  DOSEN_MEKATRONIKA: {
    kode: 'DOSEN_MEKATRONIKA', nama: 'R. Dosen Mekatronika dan Robotika', bookable: false, keterangan: 'Ruang khusus dosen Mekatronika dan Robotika.',
    fasilitas: ['AC', 'Meja Kerja Dosen', 'WiFi'], jadwal: [],
  },

  // ===== KODE RUANGAN: R407 - R. 407 Lab. Elektronika Dasar, Digital dan Audio Video =====
  R407: {
    kode: 'R407', nama: 'R. 407 Lab. Elektronika Dasar, Digital dan Audio Video', bookable: true, kapasitas: 36,
    fasilitas: ['Trainer Elektronika Dasar', 'Trainer Digital', 'Perangkat Audio Video', 'Osiloskop', 'AC', 'Proyektor'],
    jadwal: [
      j('Senin', '09:00', '12:00', 'Praktikum Elektronika Dasar', 'PTE-1A', PTE, 'Pak Bambang, M.T.', 'Siti', '0812-4070-0001'),
      j('Kamis', '13:00', '16:00', 'Praktikum Sistem Digital', 'PTE-2A', PTE, 'Pak Bambang, M.T.', 'Budi', '0812-4070-0002'),
    ],
  },

  // ===== KODE RUANGAN: R406B - R. 406B Ruang Rapat dan Perpustakaan =====
  R406B: {
    kode: 'R406B', nama: 'R. 406B Ruang Rapat dan Perpustakaan', bookable: true, kapasitas: 20,
    keterangan: 'Ruang rapat sekaligus perpustakaan jurusan.',
    fasilitas: ['Meja Rapat', 'Rak Buku', 'Proyektor', 'AC', 'WiFi'],
    jadwal: [
      j('Selasa', '10:00', '11:30', 'Rapat Prodi', 'INTERNAL', 'Fakultas Teknik', 'Koordinator Prodi', 'Admin Prodi', '0812-4060-0001'),
      j('Jumat', '13:30', '15:00', 'Rapat Dosen', 'INTERNAL', 'Fakultas Teknik', 'Ketua Jurusan', 'Admin Jurusan', '0812-4060-0002'),
    ],
  },

  // ===== KODE RUANGAN: DOSEN_TELEKOMUNIKASI - R. Dosen Telekomunikasi =====
  DOSEN_TELEKOMUNIKASI: {
    kode: 'DOSEN_TELEKOMUNIKASI', nama: 'R. Dosen Telekomunikasi', bookable: false, keterangan: 'Ruang khusus dosen Telekomunikasi.',
    fasilitas: ['AC', 'Meja Kerja Dosen', 'WiFi'], jadwal: [],
  },

  // ===== KODE RUANGAN: R406A - R. 406A Lab. Telekomunikasi =====
  R406A: {
    kode: 'R406A', nama: 'R. 406A Lab. Telekomunikasi', bookable: true, kapasitas: 30,
    fasilitas: ['Trainer Telekomunikasi', 'Trainer Antena', 'Spectrum Analyzer', 'AC', 'Proyektor'],
    jadwal: [
      j('Selasa', '08:00', '11:00', 'Praktikum Telekomunikasi', 'PTE-3A', PTE, 'Pak Hadi, M.T.', 'Reza', '0812-4061-0001'),
      j('Jumat', '08:00', '11:00', 'Praktikum Antena dan Propagasi', 'PTE-3B', PTE, 'Pak Hadi, M.T.', 'Keysha', '0812-4061-0002'),
    ],
  },

  // ===== KODE RUANGAN: R405 - R. 405 Lab. Sistem Instrumentasi Kendali =====
  R405: {
    kode: 'R405', nama: 'R. 405 Lab. Sistem Instrumentasi Kendali', bookable: true, kapasitas: 36,
    fasilitas: ['Trainer Instrumentasi', 'Trainer Kendali', 'PLC', 'Sensor Kit', 'PC', 'AC'],
    jadwal: [
      j('Senin', '13:00', '16:00', 'Praktikum Sistem Kendali', 'PTE-3B', PTE, 'Pak Eko, M.T.', 'Rafif', '0812-4050-0001'),
      j('Rabu', '08:00', '11:00', 'Praktikum Instrumentasi', 'PTE-3A', PTE, 'Bu Wulan, M.T.', 'Lina', '0812-4050-0002'),
    ],
  },
};

export const BOOKABLE_ROOMS = Object.values(ROOMS).filter(r => r.bookable);

// ============================================================================
// 2. KOMPONEN DENAH SVG (GEDUNG LE - LANTAI 4)
//    Koordinat dipetakan dari foto denah (perspektif foto sudah diluruskan).
//    viewBox "40 55 1750 650"
// ============================================================================
const WALL = '#3a302e';
const FLOOR = '#eef3f2';
const GREEN = '#5cb82f';
const RED = '#d93a35';
const TEXT = '#3f3f46';

function RoomHit({ kode, nama, d, selected, muted, onSelect, children }: any) {
  const warna = selected
    ? 'fill-sky-100 stroke-transparent'
    : muted
      ? 'fill-slate-100 stroke-transparent group-hover:fill-slate-200 transition-colors'
      : 'fill-white stroke-transparent group-hover:fill-sky-50 transition-colors';
  return (
    <g role="button" tabIndex={0} aria-label={`${nama}`} className="group cursor-pointer outline-none" onClick={() => onSelect(kode)}>
      <path d={d} strokeWidth={5} className={warna} />
      {children}
    </g>
  );
}

// Label rata kiri seperti di gambar asli (anchor="middle" untuk label tengah)
function RoomLabel({ x, y, lines, anchor = 'start', size = 19, step = 27 }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle'; size?: number; step?: number }) {
  return (
    <text x={x} textAnchor={anchor} fontSize={size} fill={TEXT} className="pointer-events-none select-none font-sans font-semibold">
      {lines.map((line, i) => (<tspan key={line} x={x} y={y + i * step} dominantBaseline="central">{line}</tspan>))}
    </text>
  );
}

export function FloorPlanSvg({ selectedCode, onSelectRoom, className }: { selectedCode: string | null; onSelectRoom: (k: string) => void; className?: string; }) {
  const common = (kode: RoomCode) => ({ kode, selected: selectedCode === kode, muted: !ROOMS[kode].bookable, onSelect: onSelectRoom });
  return (
    <svg viewBox="40 55 1750 650" className={className}>
      <defs><marker id="l4-arrow-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={GREEN} /></marker></defs>

      {/* ================= LANTAI (koridor + area tangga) ================= */}
      <path d="M547 343 H1330 V443 H547 Z" fill={FLOOR} />
      <path d="M842 80 H1127 V343 H842 Z" fill={FLOOR} />

      {/* ================= RUANGAN (bisa diklik) ================= */}

      {/* ===== KODE RUANGAN: DOSEN_INSTRUMENTASI - R. Dosen Instrumentasi Kendali ===== */}
      <RoomHit {...common('DOSEN_INSTRUMENTASI')} nama="R. Dosen Instrumentasi Kendali" d="M60 80 H317 V343 H60 Z"><RoomLabel x={88} y={210} lines={['R. DOSEN', 'Instrumentasi Kendali']} /></RoomHit>

      {/* ===== KODE RUANGAN: R401 - R. 401 Ruang Teknisi Laboratorium/Toolman ===== */}
      <RoomHit {...common('R401')} nama="R. 401 Ruang Teknisi Laboratorium/Toolman" d="M317 80 H547 V343 H317 Z"><RoomLabel x={340} y={121} lines={['R. 401', 'Ruang Teknisi', 'Laboratorium/Tool', 'man']} /></RoomHit>

      {/* ===== KODE RUANGAN: TOILET (area atas + bilik closet) ===== */}
      <RoomHit {...common('TOILET')} nama="Toilet" d="M547 80 H752 V235 H610 V165 H547 Z"><RoomLabel x={693} y={144} anchor="middle" lines={['TOILET']} /></RoomHit>

      {/* ===== KODE RUANGAN: DOSEN_ELEKTRONIKA - R. Dosen Elektronika Dasar ===== */}
      <RoomHit {...common('DOSEN_ELEKTRONIKA')} nama="R. Dosen Elektronika Dasar" d="M752 80 H842 V343 H547 V165 H610 V235 H752 Z"><RoomLabel x={645} y={274} lines={['R. DOSEN', 'Elektronika Dasar']} /></RoomHit>

      {/* ===== KODE RUANGAN: TPJM - R. TPjM ===== */}
      <RoomHit {...common('TPJM')} nama="R. TPjM" d="M1127 80 H1242 V343 H1127 Z"><RoomLabel x={1150} y={182} lines={['R. TPjM']} /></RoomHit>

      {/* ===== KODE RUANGAN: R403 - R. 403 Lab. Mekatronika dan Robotika ===== */}
      <RoomHit {...common('R403')} nama="R. 403 Lab. Mekatronika dan Robotika" d="M1242 80 H1765 V343 H1242 Z"><RoomLabel x={1328} y={201} lines={['R. 403', 'Lab. Mekatronika dan Robotika']} /></RoomHit>

      {/* ===== KODE RUANGAN: DOSEN_MEKATRONIKA - R. Dosen Mekatronika dan Robotika ===== */}
      <RoomHit {...common('DOSEN_MEKATRONIKA')} nama="R. Dosen Mekatronika dan Robotika" d="M1330 343 H1735 V443 H1330 Z"><RoomLabel x={1470} y={376} lines={['R. DOSEN', 'Mekatronika dan Robotika']} /></RoomHit>

      {/* ===== KODE RUANGAN: R407 - R. 407 Lab. Elektronika Dasar, Digital dan Audio Video ===== */}
      <RoomHit {...common('R407')} nama="R. 407 Lab. Elektronika Dasar, Digital dan Audio Video" d="M115 343 H547 V684 H68 V444 H115 Z"><RoomLabel x={187} y={474} lines={['R. 407', 'Lab. Elektronika Dasar,', 'Digital dan Audio Video']} /></RoomHit>

      {/* ===== KODE RUANGAN: R406B - R. 406B Ruang Rapat dan Perpustakaan ===== */}
      <RoomHit {...common('R406B')} nama="R. 406B Ruang Rapat dan Perpustakaan" d="M547 443 H842 V614 H547 Z"><RoomLabel x={585} y={501} lines={['R. 406B', 'Ruang Rapat dan', 'Perpustakaan']} /></RoomHit>

      {/* ===== KODE RUANGAN: DOSEN_TELEKOMUNIKASI - R. Dosen Telekomunikasi ===== */}
      <RoomHit {...common('DOSEN_TELEKOMUNIKASI')} nama="R. Dosen Telekomunikasi" d="M547 614 H842 V684 H547 Z"><RoomLabel x={617} y={638} lines={['R. DOSEN', 'Telekomunikasi']} /></RoomHit>

      {/* ===== KODE RUANGAN: R406A - R. 406A Lab. Telekomunikasi ===== */}
      <RoomHit {...common('R406A')} nama="R. 406A Lab. Telekomunikasi" d="M842 443 H1127 V684 H842 Z"><RoomLabel x={887} y={552} lines={['R. 406A', 'Lab. Telekomunikasi']} /></RoomHit>

      {/* ===== KODE RUANGAN: R405 - R. 405 Lab. Sistem Instrumentasi Kendali ===== */}
      <RoomHit {...common('R405')} nama="R. 405 Lab. Sistem Instrumentasi Kendali" d="M1127 443 H1765 V684 H1127 Z"><RoomLabel x={1280} y={550} lines={['R. 405', 'Lab. Sistem Instrumentasi Kendali']} /></RoomHit>

      {/* ================= DINDING & PINTU ================= */}
      <g className="pointer-events-none" fill="none" stroke={WALL}>
        {/* dinding utama (celah = pintu) */}
        <path d="M60 80 H1765 M68 684 H1765 M60 80 V343 M115 343 V444 H68 V684 M1765 80 V343 H1735 V443 H1765 V684 M60 343 H240 M290 343 H480 M540 343 H565 M625 343 H842 M1127 343 H1140 M1195 343 H1258 M1310 343 H1765 M547 443 H772 M818 443 H870 M918 443 H1140 M1195 443 H1765 M547 614 H670 M722 614 H842 M317 80 V343 M547 80 V350 M547 403 V684 M752 80 V235 M842 80 V343 M1127 80 V343 M1242 80 V343 M1330 343 V385 M1330 437 V443 M842 443 V684 M1127 443 V684 M1735 343 V443 M547 165 H630 M686 165 H752 M610 165 V235 H752" strokeWidth={5} strokeLinecap="square" />
        {/* ambang pintu */}
        <path d="M240 343 H290 M480 343 H540 M565 343 H625 M1140 343 H1195 M1258 343 H1310 M772 443 H818 M870 443 H918 M1140 443 H1195 M670 614 H722 M630 165 H686 M1330 385 V437" strokeWidth={1.5} opacity={0.55} />
        {/* daun pintu */}
        <path d="M622 343 V295 M547 352 H492 M774 443 V493 M1143 443 V495 M1330 385 H1385 M686 165 V218" strokeWidth={2.5} />
        {/* panel pintu / jendela di dinding */}
        <g fill="#ffffff" strokeWidth={2}>
          <rect x={313} y={267} width={8} height={48} />
          <rect x={543} y={96} width={8} height={50} />
          <rect x={543} y={260} width={8} height={45} />
          <rect x={543} y={350} width={8} height={53} />
          <rect x={1668} y={339} width={44} height={8} />
          <rect x={1665} y={439} width={47} height={8} />
        </g>
      </g>

      {/* ================= DETAIL (tangga, closet, panah evakuasi, simbol) ================= */}
      <g className="pointer-events-none">
        {/* tangga */}
        <g fill="none" stroke={WALL}>
          <path d="M850 160 A135 72 0 0 1 1120 160" strokeWidth={2} />
          {Array.from({ length: 11 }, (_, i) => 157 + i * 12.5).map(y => <line key={y} x1={848} y1={y} x2={975} y2={y} strokeWidth={2} />)}
          {Array.from({ length: 4 }, (_, i) => 244.5 + i * 12.5).map(y => <line key={`r${y}`} x1={998} y1={y} x2={1122} y2={y} strokeWidth={2} />)}
          <rect x={975} y={146} width={23} height={136} strokeWidth={3} /> <line x1={986} y1={152} x2={986} y2={276} strokeWidth={1.5} />
          <path d="M1000 238 L1040 226 L1048 208 L1066 204 L1100 190" strokeWidth={2} /> <line x1={1058} y1={168} x2={1058} y2={190} strokeWidth={1.5} />
        </g>
        {/* closet toilet */}
        <g fill="#ffffff" stroke="#94a3b8" strokeWidth={2}>
          <ellipse cx={643} cy={203} rx={12} ry={10} /> <rect x={620} y={195} width={14} height={16} rx={3} />
        </g>
        {/* panah evakuasi */}
        <g stroke={GREEN} strokeWidth={3} strokeLinecap="round" fill="none" markerEnd="url(#l4-arrow-head)">
          {[
            [260, 262, 260, 322], [505, 200, 505, 265], [597, 203, 597, 268], [1158, 211, 1158, 274], [1275, 210, 1275, 273],
            [1445, 405, 1385, 405], [420, 381, 487, 381], [795, 561, 795, 501], [895, 525, 895, 465], [1170, 561, 1170, 501],
            [610, 406, 680, 406], [697, 406, 768, 406], [783, 406, 855, 406],
            [1293, 406, 1222, 406], [1205, 406, 1135, 406], [1120, 406, 1052, 406], [1035, 406, 965, 406],
          ].map(([x1, y1, x2, y2]) => (<line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />))}
        </g>
        {/* percabangan koridor -> tangga */}
        <g stroke={GREEN} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M868 408 C893 408 912 398 912 380" />
          <path d="M958 408 C933 408 912 398 912 380" />
          <path d="M912 382 V362" />
          <path d="M903 372 L912 360 L921 372" />
        </g>
        {/* jalur evakuasi di dalam tangga */}
        <path d="M911 308 V135 Q911 125 921 125 H1048 Q1058 125 1058 135 V152" stroke={GREEN} strokeWidth={3} strokeLinecap="round" fill="none" markerEnd="url(#l4-arrow-head)" />
        {/* rambu tangga darurat */}
        <g>
          <rect x={890} y={311} width={42} height={28} fill={RED} rx={1} />
          <circle cx={902} cy={319} r={2.6} fill="#fff" />
          <path d="M902 323 L906 330 L901 335 M906 330 L912 327 M902 323 L897 329" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x={916} y={316} width={8} height={18} fill="none" stroke="#fff" strokeWidth={1.6} />
        </g>
        {/* APAR */}
        <g>
          <rect x={645} y={351} width={14} height={36} rx={5} fill={RED} />
          <path d="M649 351 V345 H658 V351" fill="none" stroke="#1f1f1f" strokeWidth={2.2} />
        </g>
        {/* posisi Anda */}
        <g>
          <ellipse cx={846} cy={392} rx={17} ry={8} fill="#fff" stroke={WALL} strokeWidth={2} />
          <circle cx={846} cy={364} r={5} fill="#1f1f1f" /> <path d="M839 390 V378 Q839 371 846 371 Q853 371 853 378 V390 Z" fill="#1f1f1f" />
        </g>
      </g>
    </svg>
  );
}

export function FloorPlanLegend({ className = '' }: { className?: string }) {
  const item = 'flex items-center gap-2 text-xs font-medium text-slate-500';
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${className}`}>
      <span className={item}><i className="h-3 w-3 rounded-sm border border-slate-400 bg-white" /> Bisa dibooking</span>
      <span className={item}><i className="h-3 w-3 rounded-sm border border-slate-400 bg-slate-100" /> Tidak bisa dibooking</span>
      <span className={item}><i className="h-3 w-3 rounded-sm border border-sky-600 bg-sky-200" /> Dipilih</span>
    </div>
  );
}

export function DaftarRuangan({ selected, onSelect, grid = false }: any) {
  return (
    <ul className={grid ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2'}>
      {Object.values(ROOMS).map((r) => (
        <li key={r.kode}>
          <button onClick={() => onSelect(r.kode)} className={`flex w-full items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-all ${selected === r.kode ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-sm' : 'border-slate-100 bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50'}`}>
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${r.bookable ? 'bg-sky-500 shadow-sm shadow-sky-400' : 'bg-slate-300'}`} /> <span className="truncate">{r.nama}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

// ============================================================================
// 3. UI POP-UP PREMIUM (BOOKING, JADWAL, FASILITAS)
// ============================================================================
type Tab = 'booking' | 'jadwal' | 'fasilitas';
const INPUT = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10';
const LABEL = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500';

function TabBooking({ ruangan }: { ruangan: RoomInfo }) {
  const [form, setForm] = useState({ nama: '', kontak: '', tanggal: '', mulai: '', selesai: '', keperluan: '' });
  const [terkirim, setTerkirim] = useState(false);
  const set = (k: keyof typeof form) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const waktuValid = form.mulai !== '' && form.selesai !== '' && form.mulai < form.selesai;

  const bentrok = useMemo(() => {
    if (!form.tanggal || !waktuValid) return [];
    const hari = HARI_DARI_INDEX[new Date(`${form.tanggal}T00:00:00`).getDay()];
    return ruangan.jadwal.filter((s) => s.hari === hari && form.mulai < s.selesai && form.selesai > s.mulai);
  }, [form, waktuValid, ruangan.jadwal]);

  const lengkap = form.nama.trim() !== '' && form.kontak.trim() !== '' && form.tanggal !== '' && waktuValid;

  if (!ruangan.bookable) return <div className="rounded-xl bg-slate-50 p-6 text-center"><span className="mb-2 block text-3xl">🔒</span><h4 className="font-bold text-slate-800">Ruangan Terkunci</h4><p className="text-sm text-slate-500">{ruangan.keterangan}</p></div>;
  if (terkirim) return <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center"><span className="mb-3 block text-4xl">✅</span><h4 className="text-lg font-bold text-emerald-800">Booking Berhasil Diajukan!</h4><p className="mt-2 text-sm text-emerald-700"><strong>{ruangan.nama}</strong><br />{form.tanggal} | {form.mulai} – {form.selesai}</p><button onClick={() => setTerkirim(false)} className="mt-5 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">Booking Jadwal Lain</button></div>;

  return (
    <div className="space-y-4">
      <div><label className={LABEL}>Nama Peminjam</label><input className={INPUT} value={form.nama} onChange={set('nama')} placeholder="Masukkan nama lengkap..." /></div>
      <div><label className={LABEL}>Kontak (WA / Akun)</label><input className={INPUT} value={form.kontak} onChange={set('kontak')} placeholder="0812xxxx / @username" /></div>
      <div><label className={LABEL}>Tanggal Booking</label><input type="date" className={INPUT} value={form.tanggal} onChange={set('tanggal')} min={new Date().toISOString().slice(0, 10)} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={LABEL}>Jam Mulai</label><input type="time" className={INPUT} value={form.mulai} onChange={set('mulai')} /></div>
        <div><label className={LABEL}>Jam Selesai</label><input type="time" className={INPUT} value={form.selesai} onChange={set('selesai')} /></div>
      </div>
      {form.mulai && form.selesai && !waktuValid && <p className="text-xs font-medium text-rose-500">⚠️ Jam selesai harus setelah jam mulai.</p>}
      <div><label className={LABEL}>Keperluan</label><textarea className={INPUT} rows={2} value={form.keperluan} onChange={set('keperluan')} placeholder="Contoh: Praktikum pengganti..." /></div>

      {bentrok.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-bold text-amber-900">⚠️ Jadwal Bentrok!</p><ul className="mt-3 space-y-3">{bentrok.map((s) => (<li key={`${s.hari}-${s.mulai}`} className="rounded-lg bg-white p-3 text-sm border border-amber-100 shadow-sm"><span className="font-bold text-slate-800">{s.kegiatan}</span> <span className="text-sky-600">({s.mulai}–{s.selesai})</span><p className="mt-1 text-xs text-slate-500">PJ: {s.pj} <span className="font-bold text-amber-700">({s.kontak})</span></p></li>))}</ul></div>
      )}
      <button onClick={() => setTerkirim(true)} disabled={!lengkap} className="mt-2 w-full rounded-xl bg-linear-to-r from-sky-600 to-blue-600 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none">{bentrok.length > 0 ? 'Ajukan Paksa' : 'Ajukan Booking Sekarang'}</button>
    </div>
  );
}

function TabJadwal({ ruangan }: { ruangan: RoomInfo }) {
  const [hariAktif, setHariAktif] = useState<Hari>(HARI_DARI_INDEX[new Date().getDay()]);
  if (ruangan.jadwal.length === 0) return <div className="rounded-xl bg-slate-50 p-6 text-center"><span className="mb-2 block text-3xl">📅</span><p className="text-sm font-medium text-slate-500">Belum ada jadwal terdaftar untuk ruangan ini.</p></div>;

  const jadwalHariIni = ruangan.jadwal.filter((s) => s.hari === hariAktif).sort((a, b) => a.mulai.localeCompare(b.mulai));

  return (
    <div className="space-y-5 pb-8">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-hide">
        {URUTAN_HARI.map((h) => (
          <button key={h} onClick={() => setHariAktif(h)} className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-all ${hariAktif === h ? 'bg-sky-600 text-white shadow-md shadow-sky-500/30' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{h}</button>
        ))}
      </div>
      {jadwalHariIni.length === 0 ? <p className="rounded-xl border border-slate-100 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">Tidak ada kelas di hari {hariAktif}. Ruangan kosong! 🎉</p> : (
        <ul className="space-y-4">
          {jadwalHariIni.map((s) => (
            <li key={`${s.hari}-${s.mulai}`} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-sky-300 hover:shadow-md p-5 pl-6">
              <div className="absolute bottom-0 left-0 top-0 w-2 bg-sky-500" />
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{s.kegiatan}</h4>
                  <p className="text-xs font-semibold text-sky-600 mt-0.5">{s.kelas} · {s.prodi}</p>
                </div>
                <span className="rounded-md bg-sky-100 px-2 py-1 text-xs font-black text-sky-700 shrink-0">{s.mulai} – {s.selesai}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-400">Dosen</span><span className="font-semibold text-slate-700">{s.dosen}</span>
                <span className="font-semibold text-slate-400">PJ Kelas</span><span className="font-semibold text-slate-700">{s.pj} <span className="text-sky-600 ml-1">({s.kontak})</span></span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TabFasilitas({ ruangan }: { ruangan: RoomInfo }) {
  return (
    <div className="space-y-5">
      {(ruangan.kapasitas || ruangan.keterangan) && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          {ruangan.kapasitas && <p className="font-bold text-blue-900">👥 Kapasitas Maksimal: {ruangan.kapasitas} Orang</p>}
          {ruangan.keterangan && <p className="mt-1 text-xs text-blue-700">{ruangan.keterangan}</p>}
        </div>
      )}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Daftar Fasilitas</h4>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ruangan.fasilitas.map((f) => (
            <li key={f} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition hover:border-sky-200 hover:bg-sky-50/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-600">✔️</div><span className="text-sm font-semibold text-slate-700">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function RoomPopup({ ruangan, onClose }: { ruangan: RoomInfo; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>(ruangan.bookable ? 'booking' : 'jadwal');
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    // Animasi muncul (Scale up / Fade In)
    requestAnimationFrame(() => setIsOpening(true));

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, []);

  // Animasi hilang (Scale down / Fade Out) sebelum function onClose dipanggil
  const handleClose = () => {
    setIsOpening(false);
    setTimeout(onClose, 300);
  };

  const tombol: { id: Tab; label: string }[] = [{ id: 'booking', label: ' Booking' }, { id: 'jadwal', label: ' Jadwal' }, { id: 'fasilitas', label: ' Fasilitas' }];

  return (
    <div
      className={`fixed inset-0 z-999 flex flex-col justify-end sm:items-center sm:justify-center transition-colors duration-300 ${isOpening ? 'bg-slate-900/60 backdrop-blur-sm' : 'bg-transparent backdrop-blur-none'}`}
      onClick={handleClose}
    >
      <div
        className={`flex w-full flex-col overflow-hidden bg-white shadow-2xl transition-all duration-300 transform 
          ${isOpening ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-20 sm:translate-y-0 sm:scale-95 opacity-0'}
          h-[92vh] sm:h-auto sm:max-h-[90vh] sm:max-w-lg rounded-t-4xl sm:rounded-4xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-linear-to-br from-blue-600 to-sky-500 p-6 pt-10 sm:pt-8 text-white">
          <button onClick={handleClose} className="absolute right-5 top-6 sm:top-5 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-white/40">✕</button>
          <span className="mb-2 inline-block rounded-md bg-white/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">{ruangan.kode} · Lantai 4</span>
          <h3 className="text-2xl font-black tracking-tight">{ruangan.nama}</h3>
        </div>
        <div className="px-5 pt-5">
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1.5 shadow-inner">
            {tombol.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${tab === t.id ? 'bg-white text-sky-600 shadow' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'}`}>{t.label}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {tab === 'booking' && <TabBooking ruangan={ruangan} />} {tab === 'jadwal' && <TabJadwal ruangan={ruangan} />} {tab === 'fasilitas' && <TabFasilitas ruangan={ruangan} />}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. MAIN LAYOUT: WEB & TAB (TAMPILAN WEB)
// ============================================================================
export default function WebTabLayout() {
  const [selectedCode, setSelectedCode] = useState<RoomCode | null>(null);
  const selectedRoom = selectedCode ? ROOMS[selectedCode] : null;

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-8 bg-slate-50/50 min-h-screen">
      <header className="mb-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Denah Gedung LE · Lantai 4</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Klik pada ruangan interaktif untuk melihat jadwal, fasilitas, atau mengajukan booking.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-5"><FloorPlanLegend /></div>
          <div className="overflow-x-auto scrollbar-hide">
            <FloorPlanSvg selectedCode={selectedCode} onSelectRoom={(c) => setSelectedCode(c as RoomCode)} className="block h-auto w-full min-w-175" />
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm lg:self-start">
          <h3 className="mb-4 px-1 text-sm font-bold text-slate-800 uppercase tracking-wider">Daftar Ruangan</h3>
          <DaftarRuangan selected={selectedCode} onSelect={(c: any) => setSelectedCode(c)} />
        </aside>
      </div>

      {selectedRoom && <RoomPopup key={selectedRoom.kode} ruangan={selectedRoom} onClose={() => setSelectedCode(null)} />}
    </div>
  );
}
