'use client';

/**
 * Denah Gedung SFD - Lantai 3 (Tower A)
 * WEB & TAB VIEW (Premium UI + Zoom + Animasi Modal)
 */

import React, { useEffect, useMemo, useState } from 'react';

// ============================================================================
// 1. DATA RUANGAN & JADWAL LENGKAP (Senin - Jumat)
// ============================================================================
const LABEL_VERTICAL = true;

export type Hari = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';

export type Jadwal = {
  hari: Hari;
  mulai: string;
  selesai: string;
  kegiatan: string;
  kelas: string;
  prodi: string;
  dosen: string;
  pj: string;
  kontak: string;
};

export type Ruangan = {
  kode: string;
  nama: string;
  bookable: boolean;
  kapasitas?: number;
  keterangan?: string;
  fasilitas: string[];
  jadwal: Jadwal[];
};

export const URUTAN_HARI: Hari[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
export const HARI_DARI_INDEX: Hari[] = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const j = (hari: Hari, mulai: string, selesai: string, kegiatan: string, kelas: string, prodi: string, dosen: string, pj: string, kontak: string): Jadwal =>
  ({ hari, mulai, selesai, kegiatan, kelas, prodi, dosen, pj, kontak });

export const RUANGAN: Ruangan[] = [
  {
    kode: 'R-01',
    nama: 'PLC Lab',
    bookable: true,
    kapasitas: 30,
    fasilitas: ['Trainer PLC', 'PC workstation', 'Proyektor', 'AC', 'Whiteboard', 'Stop kontak tiap meja'],
    jadwal: [
      j('Senin', '08:00', '10:00', 'Praktikum PLC Dasar', 'TE-2A', 'Teknik Elektro', 'Dr. Budi Santoso', 'Rina (Aslab)', '0812-1111-0001'),
      j('Senin', '10:30', '12:30', 'Otomasi Industri', 'TE-2B', 'Teknik Elektro', 'Ir. Sari Wulandari', 'Dimas', '0812-1111-0002'),
      j('Senin', '13:00', '15:30', 'Sistem Kontrol', 'TE-3A', 'Teknik Elektro', 'Pak Heru', 'Rafif', '0812-1111-0003'),
      j('Selasa', '08:00', '12:00', 'Proyek PLC Lanjut', 'TE-4A', 'Teknik Elektro', 'Dr. Budi Santoso', 'Rina (Aslab)', '0812-1111-0001'),
      j('Selasa', '13:00', '17:00', 'Praktikum Mekatronika', 'TE-3B', 'Teknik Elektro', 'Ir. Sari Wulandari', 'Dimas', '0812-1111-0002'),
      j('Rabu', '08:00', '11:00', 'Kontrol Logika Terprogram', 'TE-2A', 'Teknik Elektro', 'Pak Heru', 'Rafif', '0812-1111-0003'),
      j('Rabu', '13:00', '16:00', 'Sistem Otomasi Pabrik', 'TE-4B', 'Teknik Elektro', 'Dr. Budi Santoso', 'Rina (Aslab)', '0812-1111-0001'),
      j('Kamis', '09:00', '12:00', 'Praktikum PLC Dasar', 'TE-2B', 'Teknik Elektro', 'Ir. Sari Wulandari', 'Dimas', '0812-1111-0002'),
      j('Jumat', '08:00', '11:00', 'Workshop PLC', 'GABUNGAN', 'Teknik Elektro', 'Tim Asisten Lab', 'Rina (Aslab)', '0812-1111-0001'),
      j('Jumat', '13:30', '16:30', 'Proyek Akhir Otomasi', 'TE-4A', 'Teknik Elektro', 'Pak Heru', 'Rafif', '0812-1111-0003'),
    ],
  },
  {
    kode: 'R-05',
    nama: 'Digital Lab',
    bookable: true,
    kapasitas: 30,
    fasilitas: ['Trainer digital', 'FPGA kit', 'Logic analyzer', 'PC workstation', 'Proyektor', 'AC'],
    jadwal: [
      j('Senin', '08:00', '10:30', 'Sistem Digital', 'PTIK-1A', 'Pend. Teknik Informatika', 'Ir. Maya Anggraini', 'Teguh', '0812-5555-0001'),
      j('Selasa', '10:30', '13:00', 'Arsitektur Komputer', 'PTIK-2A', 'Pend. Teknik Informatika', 'Dr. Wahyu', 'Siti', '0812-5555-0002'),
      j('Rabu', '13:00', '15:30', 'Rangkaian Logika', 'PTIK-1B', 'Pend. Teknik Informatika', 'Ir. Maya Anggraini', 'Teguh', '0812-5555-0001'),
      j('Kamis', '08:00', '12:00', 'Praktikum FPGA', 'PTIK-3A', 'Pend. Teknik Informatika', 'Dr. Wahyu', 'Siti', '0812-5555-0002'),
      j('Jumat', '13:30', '16:30', 'Mikroprosesor', 'PTIK-2B', 'Pend. Teknik Informatika', 'Ir. Maya Anggraini', 'Teguh', '0812-5555-0001'),
    ],
  },
  { kode: 'R-02', nama: 'Meeting Room', bookable: true, kapasitas: 40, fasilitas: ['Proyektor & layar', 'Sound system', 'Meja rapat', 'AC', 'Wi-Fi'], jadwal: [j('Senin', '09:00', '11:00', 'Rapat Koordinasi Dosen', 'DOSEN', 'Fakultas Teknik', 'Dekan FT', 'Bu Wati', '0813-2222-0001')] },
  { kode: 'R-03', nama: 'High Voltage & Electrical Lab', bookable: true, kapasitas: 24, fasilitas: ['Generator', 'Meja uji', 'Panel proteksi', 'AC'], jadwal: [j('Senin', '13:00', '15:30', 'Teknik Tegangan Tinggi', 'TE-3A', 'Teknik Elektro', 'Ir. Hendra', 'Fajar', '0812-3333-0001')] },
  { kode: 'R-04', nama: 'Robotic Lab', bookable: true, kapasitas: 20, fasilitas: ['Lengan robot', 'Robot mobile', '3D printer'], jadwal: [j('Rabu', '10:00', '12:30', 'Praktikum Robotika', 'TE-4A', 'Teknik Elektro', 'Dr. Rizky', 'Salsa', '0812-4444-0001')] },
  { kode: 'R-06', nama: 'Analog Lab', bookable: true, kapasitas: 28, fasilitas: ['Osiloskop', 'Function generator', 'Multimeter', 'AC'], jadwal: [j('Kamis', '13:00', '15:30', 'Elektronika Analog', 'TE-2A', 'Teknik Elektro', 'Dr. Yoga', 'Intan', '0812-6666-0001')] },
  { kode: 'R-07', nama: 'Telecommunication Lab', bookable: true, kapasitas: 30, fasilitas: ['Spectrum analyzer', 'Antena trainer', 'AC'], jadwal: [j('Jumat', '08:00', '11:00', 'Sistem Telekomunikasi', 'TE-3B', 'Teknik Elektro', 'Dr. Nadia', 'Bayu', '0812-7777-0001')] },
  { kode: 'R-08', nama: 'Pantry', bookable: false, keterangan: 'Area pantry untuk penghuni lantai 3.', fasilitas: ['Dispenser air', 'Microwave', 'Kulkas'], jadwal: [] },
  { kode: 'R-09', nama: 'Man Toilet', bookable: false, keterangan: 'Toilet pria.', fasilitas: ['Wastafel', 'Bilik toilet', 'Urinoir'], jadwal: [] },
  { kode: 'R-10', nama: 'Woman Toilet', bookable: false, keterangan: 'Toilet wanita.', fasilitas: ['Wastafel', 'Bilik toilet'], jadwal: [] },
  { kode: 'R-11', nama: 'Lobby Lift', bookable: false, keterangan: 'Lobby lift lantai 3, titik "You are here".', fasilitas: ['Lift penumpang'], jadwal: [] },
  { kode: 'R-12', nama: 'Electronica Panel Room', bookable: false, keterangan: 'Akses terbatas.', fasilitas: ['Panel elektronika'], jadwal: [] },
  { kode: 'R-13', nama: 'Electrical Panel Room', bookable: false, keterangan: 'Akses terbatas.', fasilitas: ['Panel listrik'], jadwal: [] },
];

export const cariRuangan = (kode: string) => RUANGAN.find((r) => r.kode === kode) as Ruangan;

// ============================================================================
// 2. KOMPONEN DENAH SVG (SFD - LANTAI 3)
// ============================================================================
function Shaft({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (<g className="stroke-slate-400" strokeWidth={1.5} pointerEvents="none"> <rect x={x} y={y} width={w} height={h} className="fill-slate-100" /> <line x1={x} y1={y} x2={x + w} y2={y + h} /> <line x1={x + w} y1={y} x2={x} y2={y + h} /> </g>);
}
function Door({ x, y, r = 14, rot = 0 }: { x: number; y: number; r?: number; rot?: number }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot})`} pointerEvents="none"> <line x1={0} y1={0} x2={r} y2={0} stroke="#f8fafc" strokeWidth={4} /> <line x1={0} y1={0} x2={0} y2={-r} className="stroke-slate-500" strokeWidth={1.5} /> <path d={`M0 ${-r} A${r} ${r} 0 0 1 ${r} 0`} fill="none" className="stroke-slate-400" strokeWidth={1} /> </g>);
}
function YouAreHere() {
  return (
    <g transform="translate(432 462)" pointerEvents="none">
      <path d="M0 0 C -8 -10 -18 -17 -18 -30 A18 18 0 1 1 18 -30 C 18 -17 8 -10 0 0 Z" className="fill-rose-500 stroke-white" strokeWidth={1.5} />
      <circle cx={0} cy={-30} r={13} className="fill-white" />
      <text x={0} y={-32} textAnchor="middle" fontSize={6} fontWeight={700} className="fill-rose-600">YOU ARE</text>
      <text x={0} y={-25} textAnchor="middle" fontSize={6} fontWeight={700} className="fill-rose-600">HERE</text>
    </g>
  );
}

function RoomShape({ kode, x, y, w, h, cx, cy, lines, fs = 14, selected, onSelect, children }: any) {
  const r = cariRuangan(kode);
  const aktif = selected === kode;
  const warna = aktif ? 'fill-sky-200 stroke-sky-600' : r.bookable ? 'fill-white group-hover:fill-sky-100 stroke-slate-500' : 'fill-slate-100 group-hover:fill-slate-200 stroke-slate-500';

  return (
    <g id={`ruangan-${kode}`} className="group cursor-pointer outline-none" role="button" tabIndex={0} onClick={() => onSelect(kode)}>
      <rect x={x} y={y} width={w} height={h} strokeWidth={2} className={`${warna} transition-colors group-focus-visible:stroke-sky-600`} />
      {children}
      <g transform={`translate(${cx} ${cy}) rotate(${LABEL_VERTICAL ? 90 : 0})`} className="pointer-events-none select-none">
        {lines.map((t: string, i: number) => (
          <text key={t} x={0} y={(i - (lines.length - 1) / 2) * (fs + 6)} textAnchor="middle" dominantBaseline="central" fontSize={fs} fontWeight={600} letterSpacing="0.04em" className="fill-slate-700 font-sans">{t}</text>
        ))}
      </g>
    </g>
  );
}

export function DenahSvgSfd({ selectedCode, onSelectRoom, className }: { selectedCode: string | null; onSelectRoom: (kode: string) => void; className?: string }) {
  const p = { selected: selectedCode, onSelect: onSelectRoom };

  return (
    <svg viewBox="100 55 1050 635" className={className} preserveAspectRatio="xMidYMid meet">
      <text x={1130} y={72} textAnchor="end" fontSize={15} className="fill-slate-400 font-sans">Lantai 3 · Tower A</text>
      <rect x={120} y={85} width={1010} height={585} rx={80} fill="none" className="stroke-slate-300" strokeWidth={2} />
      <rect x={165} y={125} width={900} height={510} className="fill-slate-50 stroke-slate-600" strokeWidth={4} />
      <polygon points="370,98 535,122 697,96 940,124 940,132 370,132" className="fill-emerald-200 stroke-emerald-600" strokeWidth={1.5} />
      <rect x={165} y={118} width={185} height={16} className="fill-amber-100 stroke-amber-300" strokeWidth={1} />
      <rect x={1045} y={425} width={22} height={185} className="fill-emerald-200 stroke-emerald-600" strokeWidth={1} />
      <rect x={725} y={600} width={340} height={22} className="fill-emerald-200 stroke-emerald-600" strokeWidth={1} />

      <RoomShape kode="R-01" x={193} y={160} w={172} h={160} cx={310} cy={235} lines={['PLC LAB']} fs={16} {...p}><rect x={193} y={228} width={62} height={90} fill="none" className="stroke-slate-400" strokeWidth={1.5} /></RoomShape>
      <RoomShape kode="R-02" x={365} y={160} w={335} h={202} cx={520} cy={225} lines={['MEETING ROOM']} fs={17} {...p}><rect x={537} y={285} width={103} height={77} fill="none" className="stroke-slate-400" strokeWidth={1.5} /><line x1={525} y1={160} x2={525} y2={185} className="stroke-slate-400" strokeWidth={2} /><line x1={545} y1={160} x2={545} y2={185} className="stroke-slate-400" strokeWidth={2} /></RoomShape>
      <RoomShape kode="R-03" x={700} y={135} w={165} h={220} cx={790} cy={235} lines={['HIGH VOLTAGE LAB', '& ELECTRICAL LAB']} fs={14} {...p}><rect x={702} y={293} width={38} height={60} fill="none" className="stroke-slate-400" strokeWidth={1.5} /></RoomShape>
      <RoomShape kode="R-04" x={865} y={135} w={90} h={210} cx={910} cy={195} lines={['ROBOTIC LAB']} fs={14} {...p} />
      <g pointerEvents="none"><rect x={955} y={135} width={85} height={210} className="fill-slate-100 stroke-slate-500" strokeWidth={2} /><rect x={968} y={285} width={22} height={52} fill="none" className="stroke-slate-400" strokeWidth={1.5} /></g>
      <g pointerEvents="none"><rect x={190} y={322} width={80} height={112} className="fill-slate-100 stroke-slate-500" strokeWidth={2} /></g>
      <Shaft x={222} y={352} w={48} h={48} />
      <g pointerEvents="none"><rect x={195} y={437} width={65} height={178} className="fill-slate-100 stroke-slate-500" strokeWidth={2} /><rect x={262} y={437} width={68} height={178} className="fill-slate-100 stroke-slate-500" strokeWidth={2} /><rect x={270} y={505} width={42} height={8} fill="none" className="stroke-slate-400" strokeWidth={1.5} /><rect x={290} y={505} width={8} height={40} fill="none" className="stroke-slate-400" strokeWidth={1.5} /><rect x={268} y={545} width={46} height={50} fill="none" className="stroke-slate-400" strokeWidth={1.5} /></g>

      <RoomShape kode="R-13" x={330} y={432} w={40} h={185} cx={351} cy={525} lines={['ELECTRICAL PANEL ROOM']} fs={10} {...p} />
      <RoomShape kode="R-12" x={372} y={430} w={55} h={58} cx={400} cy={459} lines={['ELECTRONICA', 'PANEL ROOM']} fs={8} {...p} />
      <Shaft x={372} y={488} w={53} h={128} />
      <RoomShape kode="R-11" x={430} y={487} w={57} h={133} cx={458} cy={555} lines={['LOBBY LIFT']} fs={13} {...p} />
      <RoomShape kode="R-08" x={487} y={430} w={60} h={115} cx={517} cy={490} lines={['PANTRY']} fs={13} {...p} />
      <Shaft x={487} y={547} w={68} h={70} />

      <g pointerEvents="none"><rect x={548} y={428} width={164} height={34} className="fill-white stroke-slate-500" strokeWidth={2} /><circle cx={575} cy={445} r={5} fill="none" className="stroke-slate-400" /><circle cx={600} cy={445} r={5} fill="none" className="stroke-slate-400" /><circle cx={660} cy={445} r={5} fill="none" className="stroke-slate-400" /><circle cx={685} cy={445} r={5} fill="none" className="stroke-slate-400" /></g>
      <RoomShape kode="R-09" x={548} y={462} w={82} h={150} cx={572} cy={545} lines={['MAN TOILET']} fs={13} {...p}><rect x={595} y={470} width={30} height={34} fill="none" className="stroke-slate-400" strokeWidth={1.5} /></RoomShape>
      <RoomShape kode="R-10" x={630} y={462} w={82} h={146} cx={690} cy={540} lines={['WOMAN TOILET']} fs={13} {...p}><rect x={634} y={470} width={30} height={34} fill="none" className="stroke-slate-400" strokeWidth={1.5} /></RoomShape>
      <RoomShape kode="R-05" x={720} y={420} w={95} h={185} cx={770} cy={510} lines={['DIGITAL LAB']} fs={14} {...p} />
      <RoomShape kode="R-06" x={815} y={420} w={120} h={180} cx={850} cy={515} lines={['ANALOG LAB']} fs={14} {...p}><rect x={880} y={420} width={55} height={80} fill="none" className="stroke-slate-400" strokeWidth={1.5} /></RoomShape>
      <RoomShape kode="R-07" x={940} y={412} w={108} h={185} cx={995} cy={500} lines={['TELECOMMUNICATION', 'LAB']} fs={13} {...p} />

      <Door x={330} y={320} rot={0} /><Door x={490} y={362} r={12} rot={0} /><Door x={520} y={362} r={12} rot={0} /><Door x={848} y={355} r={14} rot={0} /><Door x={945} y={345} r={12} rot={0} /><Door x={745} y={420} r={14} rot={180} /><Door x={850} y={420} r={14} rot={180} /><Door x={948} y={412} r={14} rot={180} />
      <YouAreHere />
    </svg>
  );
}

// ============================================================================
// 3. UI POP-UP PREMIUM (BOOKING, JADWAL LENGKAP, FASILITAS)
// ============================================================================
export function Legenda({ className = '' }: { className?: string }) {
  const item = 'flex items-center gap-2 text-xs font-medium text-slate-500';
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${className}`}>
      <span className={item}><i className="h-3 w-3 rounded-sm border border-slate-400 bg-white" /> Bisa dibooking</span>
      <span className={item}><i className="h-3 w-3 rounded-sm border border-slate-400 bg-slate-100" /> Fasilitas umum</span>
      <span className={item}><i className="h-3 w-3 rounded-sm border border-sky-600 bg-sky-200" /> Dipilih</span>
    </div>
  );
}

export function DaftarRuangan({ selected, onSelect, grid = false }: any) {
  return (
    <ul className={grid ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2'}>
      {RUANGAN.map((r) => (
        <li key={r.kode}>
          <button onClick={() => onSelect(r.kode)} className={`flex w-full items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-all ${selected === r.kode ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-sm' : 'border-slate-100 bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50'}`}>
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${r.bookable ? 'bg-sky-500 shadow-sm shadow-sky-400' : 'bg-slate-300'}`} /> <span className="truncate">{r.nama}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

type Tab = 'booking' | 'jadwal' | 'fasilitas';
const INPUT = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10';
const LABEL = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500';

function TabBooking({ ruangan }: { ruangan: Ruangan }) {
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

  if (!ruangan.bookable) return <div className="rounded-xl bg-slate-50 p-6 text-center"><span className="mb-2 block text-3xl"></span><h4 className="font-bold text-slate-800">Ruangan Terkunci</h4><p className="text-sm text-slate-500">{ruangan.keterangan}</p></div>;
  if (terkirim) return <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center"><span className="mb-3 block text-4xl"></span><h4 className="text-lg font-bold text-emerald-800">Booking Berhasil Diajukan!</h4><p className="mt-2 text-sm text-emerald-700"><strong>{ruangan.nama}</strong><br />{form.tanggal} | {form.mulai} – {form.selesai}</p><button onClick={() => setTerkirim(false)} className="mt-5 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">Booking Jadwal Lain</button></div>;

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

function TabJadwal({ ruangan }: { ruangan: Ruangan }) {
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

function TabFasilitas({ ruangan }: { ruangan: Ruangan }) {
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

export function RoomPopupSfd({ ruangan, onClose }: { ruangan: Ruangan; onClose: () => void }) {
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

  const handleClose = () => {
    setIsOpening(false);
    setTimeout(onClose, 300); // Tunggu animasi shrink selesai
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
          <span className="mb-2 inline-block rounded-md bg-white/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">{ruangan.kode} · Lantai 3 Tower A</span>
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
export default function WebTabLayoutSfd() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.0);
  const selectedRoom = selectedCode ? cariRuangan(selectedCode) : null;

  const ubahZoom = (d: number) => setZoom((z) => Math.min(2.5, Math.max(0.5, Math.round((z + d) * 10) / 10)));

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="mb-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Denah Gedung SFD · Lantai 3</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Klik pada ruangan interaktif untuk melihat jadwal, fasilitas, atau mengajukan booking.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* MAP SECTION DENGAN FITUR ZOOM DI WEB */}
        <section className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <Legenda />
            <div className="flex shrink-0 gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 hover:bg-slate-100 font-bold shadow-sm" onClick={() => ubahZoom(-0.2)} disabled={zoom <= 0.5}>−</button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 hover:bg-slate-100 font-bold shadow-sm" onClick={() => ubahZoom(0.2)} disabled={zoom >= 2.5}>+</button>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide rounded-xl bg-slate-50 border border-slate-100">
            <div style={{ width: `${zoom * 100}%`, minWidth: '700px', transition: 'width 0.3s ease-out' }}>
              <DenahSvgSfd selectedCode={selectedCode} onSelectRoom={setSelectedCode} className="block h-auto w-full" />
            </div>
          </div>
        </section>

        {/* LIST SECTION */}
        <aside className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm lg:self-start">
          <h3 className="mb-4 px-1 text-sm font-bold text-slate-800 uppercase tracking-wider">Daftar Ruangan</h3>
          <DaftarRuangan selected={selectedCode} onSelect={setSelectedCode} />
        </aside>
      </div>

      {selectedRoom && <RoomPopupSfd key={selectedRoom.kode} ruangan={selectedRoom} onClose={() => setSelectedCode(null)} />}
    </div>
  );
}