'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Plus_Jakarta_Sans, Fasthand } from 'next/font/google';
import Navbar from '@/components/LandingPage/Navbar';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
const fasthand = Fasthand({ subsets: ['latin'], weight: '400' });

/* ------------------------------------------------------------------ */
/*  REUSABLE DOT INDICATOR                                            */
/* ------------------------------------------------------------------ */

export interface DotIndicatorProps {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  variant: 'light' | 'dark';
  className?: string;
}

export function DotIndicator({
  total,
  activeIndex,
  onSelect,
  variant,
  className = '',
}: DotIndicatorProps) {
  if (total <= 1) return null;

  return (
    <div
      role="tablist"
      aria-label="Indikator slide"
      className={`flex items-center justify-center gap-2 ${className}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === activeIndex;
        const colorClass =
          variant === 'light'
            ? isActive
              ? 'bg-[#333333]'
              : 'bg-[#B8B8B8] hover:bg-[#999999]'
            : isActive
            ? 'bg-white'
            : 'bg-white/35 hover:bg-white/60';

        const sizeClass = isActive ? 'w-[28px]' : 'w-[8px]';

        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-label={`Ke slide ${i + 1}`}
            aria-selected={isActive}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => onSelect(i)}
            className={`h-[8px] rounded-full transition-all duration-500 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2AC72] motion-reduce:transition-none cursor-pointer ${sizeClass} ${colorClass}`}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FLOOR MAP REGISTRY                                                */
/* ------------------------------------------------------------------ */

export interface FloorMapItem {
  lantai: number;
  label: string;
  ratio: number;
  Map: React.ComponentType<{
    selectedCode: string | null;
    onSelectRoom: (k: string) => void;
    className?: string;
  }>;
}

function MapSkeleton() {
  return (
    <div className="flex h-full w-full animate-pulse items-center justify-center bg-slate-100/80 rounded-lg">
      <span className="text-xs font-semibold text-slate-400">Memuat denah...</span>
    </div>
  );
}

// Dynamic imports per floor
const SFDLantai3Map = dynamic(
  () => import('@/components/DenahVisual/DenahGedungSFD/Lantai3/Web&Tab/Web&TabLayout').then((m) => m.DenahSvgSfd),
  { ssr: false, loading: () => <MapSkeleton /> }
);
const SFDLantai8Map = dynamic(
  () => import('@/components/DenahVisual/DenahGedungSFD/Lantai8/Web&Tab/Web&TabLayout').then((m) => m.DenahSvgSfd),
  { ssr: false, loading: () => <MapSkeleton /> }
);

const LSLantai1Map = dynamic(
  () => import('@/components/DenahVisual/DenahGedungLS/Lantai1/Web&Tab/Web&TabLayout').then((m) => m.FloorPlanSvg),
  { ssr: false, loading: () => <MapSkeleton /> }
);
const LSLantai2Map = dynamic(
  () => import('@/components/DenahVisual/DenahGedungLS/Lantai2/Web&Tab/Web&TabLayout').then((m) => m.FloorPlanSvg),
  { ssr: false, loading: () => <MapSkeleton /> }
);
const LSLantai3Map = dynamic(
  () => import('@/components/DenahVisual/DenahGedungLS/Lantai3/Web&Tab/Web&TabLayout').then((m) => m.FloorPlanSvg),
  { ssr: false, loading: () => <MapSkeleton /> }
);
const LSLantai4Map = dynamic(
  () => import('@/components/DenahVisual/DenahGedungLS/Lantai4/Web&Tab/Web&TabLayout').then((m) => m.FloorPlanSvg),
  { ssr: false, loading: () => <MapSkeleton /> }
);

const LELantai1Map = dynamic(
  () => import('@/components/DenahVisual/DenahGedungLE/Lantai1/Web&Tab/Web&TabLayout').then((m) => m.FloorPlanSvg),
  { ssr: false, loading: () => <MapSkeleton /> }
);
const LELantai2Map = dynamic(
  () => import('@/components/DenahVisual/DenahGedungLE/Lantai2/Web&Tab/Web&TabLayout').then((m) => m.FloorPlanSvg),
  { ssr: false, loading: () => <MapSkeleton /> }
);
const LELantai3Map = dynamic(
  () => import('@/components/DenahVisual/DenahGedungLE/Lantai3/Web&Tab/Web&TabLayout').then((m) => m.FloorPlanSvg),
  { ssr: false, loading: () => <MapSkeleton /> }
);
const LELantai4Map = dynamic(
  () => import('@/components/DenahVisual/DenahGedungLE/Lantai4/Web&Tab/Web&TabLayout').then((m) => m.FloorPlanSvg),
  { ssr: false, loading: () => <MapSkeleton /> }
);

export const FLOOR_MAPS_REGISTRY: Record<'sfd' | 'ls' | 'le', FloorMapItem[]> = {
  sfd: [
    { lantai: 3, label: 'Lantai 3', ratio: 1050 / 635, Map: SFDLantai3Map },
    { lantai: 8, label: 'Lantai 8', ratio: 1050 / 635, Map: SFDLantai8Map },
  ],
  ls: [
    { lantai: 1, label: 'Lantai 1', ratio: 1600 / 610, Map: LSLantai1Map },
    { lantai: 2, label: 'Lantai 2', ratio: 1600 / 610, Map: LSLantai2Map },
    { lantai: 3, label: 'Lantai 3', ratio: 1600 / 610, Map: LSLantai3Map },
    { lantai: 4, label: 'Lantai 4', ratio: 1750 / 650, Map: LSLantai4Map },
  ],
  le: [
    { lantai: 1, label: 'Lantai 1', ratio: 1600 / 610, Map: LELantai1Map },
    { lantai: 2, label: 'Lantai 2', ratio: 1600 / 610, Map: LELantai2Map },
    { lantai: 3, label: 'Lantai 3', ratio: 1600 / 610, Map: LELantai3Map },
    { lantai: 4, label: 'Lantai 4', ratio: 1750 / 650, Map: LELantai4Map },
  ],
};

export const floorMaps = FLOOR_MAPS_REGISTRY;

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const LOGIN_HREF = '/login';

const gedungList = [
  { key: 'sfd', label: 'Gedung SFD', base: '/denah-sfd', floors: [3, 8] },
  { key: 'ls', label: 'Gedung L Sipil', base: '/denah-ls', floors: [1, 2, 3, 4] },
  { key: 'le', label: 'Gedung L Elektro', base: '/denah-le', floors: [1, 2, 3, 4] },
];

const QUOTE =
  '“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ”';

const testimonials = [1, 2, 3, 4, 5].map((n) => ({
  src: `/SolusiMasalah/1.png`,
  quote: QUOTE,
}));

/* ------------------------------------------------------------------ */
/*  CAROUSEL CONFIG (ukuran dari Figma, canvas 1161 x 409)            */
/* ------------------------------------------------------------------ */


const CANVAS_W = 1161;
const CANVAS_H = 409;

type Slot = {
  left: number;
  top: number;
  width: number;
  height: number;
  radius: number;
  img: { left: number; top: number; width: number; height: number; radius: number };
};

const SLOTS: Slot[] = [
  {
    left: 0, top: 88, width: 77, height: 240, radius: 40,
    img: { left: 10.5, top: 12, width: 56, height: 216, radius: 26 },
  },
  {
    left: 121, top: 50, width: 101, height: 315, radius: 40,
    img: { left: 13.5, top: 16, width: 74, height: 283, radius: 26 },
  },
  {
    left: 266, top: 0, width: 629, height: 409, radius: 40,
    img: { left: 327, top: 20, width: 286, height: 368, radius: 40 },
  },
  {
    left: 939, top: 50, width: 101, height: 315, radius: 40,
    img: { left: 13.5, top: 16, width: 74, height: 283, radius: 26 },
  },
  {
    left: 1084, top: 88, width: 77, height: 240, radius: 40,
    img: { left: 10.5, top: 12, width: 56, height: 216, radius: 26 },
  },
];

function useFitScale(designWidth: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / designWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);

  return { ref, scale };
}

function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const { ref, scale } = useFitScale(CANVAS_W);
  const n = testimonials.length;
  const half = Math.floor(n / 2);

  return (
    <div className="flex w-full flex-col items-center">
      <div ref={ref} className="w-full" style={{ height: CANVAS_H * scale }}>
        <div
          className="relative mx-auto shrink-0 origin-top-left"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${scale})`,
          }}
        >
          {testimonials.map((item, i) => {
            const offset = ((i - active + n + half) % n) - half;
            const slot = SLOTS[offset + 2];
            const isActive = offset === 0;

            return (
              <div
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`Testimoni ${i + 1}`}
                aria-current={isActive}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActive(i);
                }}
                className={`absolute overflow-hidden bg-white transition-all duration-700 ease-in-out outline-none ${
                  isActive ? 'cursor-default' : 'cursor-pointer'
                }`}
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  height: slot.height,
                  borderRadius: slot.radius,
                  zIndex: 30 - Math.abs(offset) * 5,
                }}
              >
                <div
                  className="absolute overflow-hidden transition-all duration-700 ease-in-out bg-[#D9D9D9]"
                  style={{
                    left: slot.img.left,
                    top: slot.img.top,
                    width: slot.img.width,
                    height: slot.img.height,
                    borderRadius: slot.img.radius,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={isActive ? `Foto testimoni ${i + 1}` : ''}
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                <p
                  className={`absolute text-[20px] font-medium leading-[40px] text-black transition-opacity ease-in-out ${
                    isActive
                      ? 'opacity-100 duration-500 delay-500'
                      : 'pointer-events-none opacity-0 duration-200'
                  }`}
                  style={{ left: 37, top: 28, width: 249 }}
                >
                  {item.quote}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <DotIndicator
        total={n}
        activeIndex={active}
        onSelect={setActive}
        variant="dark"
        className="mt-8"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FITUR UTAMA + CARA KERJA (dipakai bersama Web/Tab & Mobile)       */
/* ------------------------------------------------------------------ */

const iconProps = {
  className: 'h-[55%] w-[55%]',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const FITUR_UTAMA = [
  {
    text: 'Lihat denah per lantai dan status ruangan secara real-time.',
    tint: 'bg-[#E4EEE9] text-[#4E7A5C]',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11z" />
        <circle cx="12" cy="10" r="2.3" />
      </svg>
    ),
  },
  {
    text: 'Ajukan ruangan yang kosong sesuai tanggal dan jam.',
    tint: 'bg-[#FBE6EC] text-[#D0507A]',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    text: 'Cek jumlah bangku dan fasilitas sebelum memilih ruangan.',
    tint: 'bg-[#E6E9F7] text-[#4F5FB5]',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M7 11V6.5A2.5 2.5 0 0 1 9.5 4h5A2.5 2.5 0 0 1 17 6.5V11" />
        <path d="M5 11h14v4H5zM7 15v5M17 15v5" />
      </svg>
    ),
  },
  {
    text: 'Hubungi admin dan dosen, atau tanya chatbot kapan saja.',
    tint: 'bg-[#F1EAE0] text-[#8A6D3B]',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
];

const CARA_KERJA = [
  {
    title: 'Pilih gedung dan lantai yang ingin kamu cek',
    desc: 'Tentukan Gedung L atau SFD, lalu pilih lantai untuk membuka denah ruangan yang ingin dicek.',
    img: '/Landing/Caker1.png',
  },
  {
    title: 'Lihat status ruangan secara real-time',
    desc: 'Cek ruangan yang tersedia, dipesan, atau sedang terpakai secara real-time, lengkap dengan fasilitasnya.',
    img: '/Landing/Caker2.png',
  },
  {
    title: 'Ajukan booking untuk ruangan yang kosong',
    desc: 'Pilih ruangan yang kosong, tentukan tanggal dan jam, lalu kirim pengajuan langsung dari website.',
    img: '/Landing/Caker3.png',
  },
  {
    title: 'Dapatkan konfirmasi langsung',
    desc: 'Terima status pengajuan dan notifikasi, atau tanya lewat chat bila ada kendala.',
    img: '/Landing/Caker4.png',
  },
];

/* Card fitur: hover / focus => background berubah jadi #333333, teks jadi putih */
export function FiturUtamaCards({ variant }: { variant: 'web' | 'mobile' }) {
  const m = variant === 'mobile';

  return (
    <div
      className={
        m ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-[24px]'
      }
    >
      {FITUR_UTAMA.map((item, i) => (
        <div
          key={i}
          tabIndex={0}
          className={`group flex cursor-pointer flex-col justify-between rounded-[16px] border border-[#EFEFEF] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] outline-none transition-colors duration-300 ease-in-out hover:bg-[#333333] focus-visible:bg-[#333333] ${
            m ? 'min-h-[190px] p-4' : 'min-h-[220px] p-5 lg:min-h-[260px] lg:p-6'
          }`}
        >
          <span
            className={`flex items-center justify-center rounded-full ${item.tint} ${
              m ? 'h-[36px] w-[36px]' : 'h-[44px] w-[44px]'
            }`}
          >
            {item.icon}
          </span>
          <p
            className={`font-medium text-[#333333] transition-colors duration-300 ease-in-out group-hover:text-white group-focus-visible:text-white ${
              m ? 'text-[13px] leading-[20px]' : 'text-[15px] leading-[24px] lg:text-[17px]'
            }`}
          >
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}

/* Cara Kerja: 4 kartu putih, nomor di badge atas, gambar tanpa background.
   Dipakai di dalam <CaraKerjaSection> supaya setengah kartu menimpa area gelap. */
export function CaraKerjaSteps({ variant }: { variant: 'web' | 'mobile' }) {
  const m = variant === 'mobile';

  return (
    <div
      className={
        m
          ? 'mx-auto grid max-w-[340px] grid-cols-1 gap-14'
          : 'grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[36px]'
      }
    >
      {CARA_KERJA.map((step, i) => (
        <div
          key={i}
          className={`relative flex flex-col items-center rounded-[16px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.10)] ${
            m ? 'px-5 pb-8 pt-12' : 'min-h-[430px] px-6 pb-9 pt-14'
          }`}
        >
          {/* badge nomor: lingkaran putih dengan ring gelap + halo putih */}
          <span
            className={`absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-white font-medium text-[#333333] ring-[6px] ring-white ${
              m
                ? '-top-[22px] h-[44px] w-[44px] border-2 border-[#333333] text-[18px]'
                : '-top-[30px] h-[60px] w-[60px] border-2 border-[#333333] text-[24px]'
            }`}
          >
            {i + 1}
          </span>

          <div className={`flex w-full items-center justify-center ${m ? 'h-[170px]' : 'h-[210px]'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={step.img}
              alt=""
              draggable={false}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="h-full w-full object-contain"
            />
          </div>

          <h3
            className={`text-center font-bold text-black ${
              m ? 'mt-6 text-[16px] leading-[22px]' : 'mt-9 text-[19px] leading-[28px]'
            }`}
          >
            {step.title}
          </h3>
          <p
            className={`text-center text-black ${
              m ? 'mt-3 text-[12px] leading-[19px]' : 'mt-4 text-[13px] leading-[21px]'
            }`}
          >
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

/* Section Cara Kerja: bagian atas gelap, kartu menimpa batas gelap -> putih */
export function CaraKerjaSection({ variant }: { variant: 'web' | 'mobile' }) {
  const m = variant === 'mobile';

  return (
    <section id="cara-kerja" className="w-full bg-white">
      <div
        className={`bg-[#333333] text-center ${
          m ? 'px-4 pb-[48px] pt-[56px]' : 'px-6 pb-[72px] pt-[90px] lg:pb-[84px] lg:pt-[110px]'
        }`}
      >
        <p
          className={`font-semibold uppercase tracking-[0.04em] text-[#B8B8B8] ${
            m ? 'text-[11px]' : 'text-[14px]'
          }`}
        >
          Semua info ruangan, satu tempat
        </p>
        <h2
          className={`font-semibold text-white ${
            m ? 'mt-2 text-[28px] leading-[36px]' : 'mt-4 text-[36px] leading-[56px] lg:text-[50px]'
          }`}
        >
          Cara Kerja SiRuang
        </h2>
      </div>

      <div className="relative">
        {/* strip gelap di belakang bagian atas kartu */}
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 bg-[#333333] ${m ? 'h-[110px]' : 'h-[140px]'}`}
        />
        <div
          className={`relative mx-auto w-full ${
            m ? 'px-4 pb-[72px]' : 'max-w-[1440px] px-6 pb-[120px] lg:px-[84px]'
          }`}
        >
          <CaraKerjaSteps variant={variant} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const container = 'mx-auto w-full max-w-[1440px] px-6 lg:px-[84px]';

export default function WebTabLayout() {
  const [activeKey, setActiveKey] = useState<'sfd' | 'ls' | 'le'>('sfd');
  const [slideIndex, setSlideIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [cardsPerPage, setCardsPerPage] = useState(2);

  const sliderRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const isPointerDown = useRef(false);
  const rafRef = useRef<number | null>(null);

  const activeGedung = gedungList.find((g) => g.key === activeKey) ?? gedungList[0];
  const floorItems = FLOOR_MAPS_REGISTRY[activeKey] || [];

  useEffect(() => {
    const updateCardsPerPage = () => {
      if (typeof window !== 'undefined') {
        setCardsPerPage(window.innerWidth >= 768 ? 2 : 1);
      }
    };
    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => window.removeEventListener('resize', updateCardsPerPage);
  }, []);

  const totalPages = Math.ceil(floorItems.length / cardsPerPage);

  const pages: FloorMapItem[][] = [];
  for (let i = 0; i < floorItems.length; i += cardsPerPage) {
    pages.push(floorItems.slice(i, i + cardsPerPage));
  }

  const handleSelectGedung = (key: 'sfd' | 'ls' | 'le') => {
    setActiveKey(key);
    setSlideIndex(0);
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = 0;
    }
  };

  const handleSelectSlide = (i: number) => {
    setSlideIndex(i);
    if (sliderRef.current) {
      const pageWidth = sliderRef.current.clientWidth;
      sliderRef.current.scrollTo({
        left: i * pageWidth,
        behavior: 'smooth',
      });
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      handleSelectSlide(slideIndex - 1);
    }
  };

  const handleNext = () => {
    if (slideIndex < totalPages - 1) {
      handleSelectSlide(slideIndex + 1);
    }
  };

  const handleScroll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, clientWidth } = sliderRef.current;
      if (clientWidth > 0) {
        const newIndex = Math.min(
          totalPages - 1,
          Math.max(0, Math.round(scrollLeft / clientWidth))
        );
        setSlideIndex((prev) => (prev !== newIndex ? newIndex : prev));
      }
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !sliderRef.current) return;
    isPointerDown.current = true;
    dragStartX.current = e.clientX;
    dragStartScrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current || !sliderRef.current) return;
    const dx = e.clientX - dragStartX.current;
    if (!isDragging && Math.abs(dx) > 4) {
      setIsDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }
    if (isDragging) {
      sliderRef.current.scrollLeft = dragStartScrollLeft.current - dx;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPointerDown.current) {
      isPointerDown.current = false;
      setIsDragging(false);
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {}
    }
  };

  return (
    <div className={`${jakarta.className} w-full overflow-x-hidden bg-white text-black`}>
      {/* ---------------- NAVBAR ---------------- */}
      <Navbar variant="web" />

      {/* ---------------- HERO ---------------- */}
      <section className={`${container} mt-[120px] lg:mt-[243px]`}>
        <div
          className="relative min-h-[380px] rounded-[40px] lg:h-[561px]"
          style={{ background: 'linear-gradient(90deg, #183449 0%, #588CBC 100%)' }}
        >
          <div className="relative z-10 flex h-full w-[52%] flex-col justify-center py-10 pl-8 lg:w-[568px] lg:justify-start lg:py-0 lg:pl-[47px] lg:pt-[115px]">
            <div className="whitespace-nowrap leading-[40px] text-[#FCFCFC]">
              <span className="text-[32px] font-bold lg:text-[45px]">LOREM IPSUM&nbsp; </span>
              <span className={`${fasthand.className} text-[50px] font-normal lg:text-[70px]`}>
                Dolor
              </span>
            </div>

            <p className="mt-[28px] max-w-[521px] text-[17px] leading-[28px] text-[#FCFCFC] lg:mt-[38px] lg:text-[25px] lg:leading-[40px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            </p>

            <Link
              href={LOGIN_HREF}
              className="mt-[28px] flex h-[56px] w-[226px] items-center justify-center rounded-[15px] bg-white text-[20px] font-semibold text-[#333333] transition-opacity hover:opacity-90 lg:mt-[37px]"
            >
              Masuk
            </Link>
          </div>

          <div className="absolute bottom-0 right-0 aspect-[617/745] w-[50%] lg:w-[617px]">
            <Image
              src="/Landing/GedungSFD.png"
              alt="Gedung SFD"
              width={617}
              height={745}
              priority
              className="h-full w-full rounded-br-[40px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* ---------------- DATA REAL-TIME ---------------- */}
      <section id="data-real-time" className={`${container} mt-[100px] lg:mt-[188px]`}>
        <h2 className="text-center text-[40px] font-semibold leading-[63px] lg:text-[50px]">
          Data Real-Time
        </h2>

        <p className="mx-auto mt-[28px] max-w-[860px] text-center text-[20px] leading-[34px] lg:mt-[38px] lg:text-[25px] lg:leading-[40px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          <br className="hidden lg:block" /> tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam,
        </p>

        {/* tombol gedung */}
        <div className="mt-[30px] flex flex-wrap items-center justify-center gap-4 lg:mt-[37px] lg:gap-[80px]">
          {gedungList.map((g) => {
            const isActive = g.key === activeKey;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => handleSelectGedung(g.key as 'sfd' | 'ls' | 'le')}
                aria-pressed={isActive}
                className={`flex h-[65px] min-w-[204px] cursor-pointer items-center justify-center rounded-[15px] px-10 text-[20px] font-semibold transition-colors duration-300 ${
                  isActive
                    ? 'bg-[#333333] text-white'
                    : 'border border-[#333333] bg-transparent text-black hover:bg-[#333333]/5'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>

        {/* kartu denah lantai slider (lebar penuh container, sejajar hero card) */}
        <motion.div
          key={activeGedung.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-[40px] w-full lg:mt-[66px]"
        >
          {totalPages <= 1 ? (
            <div className="flex w-full justify-center gap-[30px]">
              {floorItems.map((item) => (
                <div
                  key={item.lantai}
                  className={cardsPerPage === 2 ? 'w-[calc((100%-30px)/2)]' : 'w-full'}
                >
                  <figure className="flex flex-col">
                    <div className="w-full rounded-[20px] bg-[#D9D9D9] p-3 shadow-xs">
                      <div
                        className="flex w-full items-center justify-center overflow-hidden rounded-[12px] bg-white p-2"
                        style={{ aspectRatio: item.ratio }}
                      >
                        <div className="h-full w-full pointer-events-none select-none" aria-hidden="true">
                          <item.Map
                            className="h-full w-full object-contain"
                            selectedCode={null}
                            onSelectRoom={() => {}}
                          />
                        </div>
                      </div>
                    </div>
                    <figcaption className="mt-4 flex flex-col items-center text-center">
                      <span className="text-[18px] font-semibold text-[#333333] lg:text-[22px]">
                        Lantai {item.lantai}
                      </span>
                      <span className="my-1.5 h-[4px] w-[32px] rounded-full bg-[#C2AC72]" />
                      <span className="text-[14px] font-medium text-[#B8B8B8]">
                        {activeGedung.label}
                      </span>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative w-full">
              <div
                ref={sliderRef}
                onScroll={handleScroll}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`flex w-full overflow-x-auto snap-x snap-mandatory select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              >
                {pages.map((pageCards, pageIdx) => (
                  <div
                    key={pageIdx}
                    className="flex w-full shrink-0 snap-start gap-[30px]"
                  >
                    {pageCards.map((item) => (
                      <div
                        key={item.lantai}
                        className={cardsPerPage === 2 ? 'w-[calc((100%-30px)/2)] shrink-0' : 'w-full shrink-0'}
                      >
                        <figure className="flex flex-col">
                          <div className="w-full rounded-[20px] bg-[#D9D9D9] p-3 shadow-xs">
                            <div
                              className="flex w-full items-center justify-center overflow-hidden rounded-[12px] bg-white p-2"
                              style={{ aspectRatio: item.ratio }}
                            >
                              <div className="h-full w-full pointer-events-none select-none" aria-hidden="true">
                                <item.Map
                                  className="h-full w-full object-contain"
                                  selectedCode={null}
                                  onSelectRoom={() => {}}
                                />
                              </div>
                            </div>
                          </div>
                          <figcaption className="mt-4 flex flex-col items-center text-center">
                            <span className="text-[18px] font-semibold text-[#333333] lg:text-[22px]">
                              Lantai {item.lantai}
                            </span>
                            <span className="my-1.5 h-[4px] w-[32px] rounded-full bg-[#C2AC72]" />
                            <span className="text-[14px] font-medium text-[#B8B8B8]">
                              {activeGedung.label}
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Dot & Desktop Arrows */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={slideIndex === 0}
                  aria-label="Halaman sebelumnya"
                  className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#B8B8B8] text-[#333333] transition-all hover:border-[#333333] hover:bg-[#333333] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 lg:flex cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <DotIndicator
                  total={totalPages}
                  activeIndex={slideIndex}
                  onSelect={handleSelectSlide}
                  variant="light"
                />

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={slideIndex >= totalPages - 1}
                  aria-label="Halaman berikutnya"
                  className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#B8B8B8] text-[#333333] transition-all hover:border-[#333333] hover:bg-[#333333] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 lg:flex cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* ---------------- RESPONSIVE WEBSITE ---------------- */}
      <section className={`${container} mt-[100px] lg:mt-[158px]`}>
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-0">
          <div className="relative z-0 flex h-[420px] w-[357px] shrink-0 items-center justify-center bg-white lg:ml-[24px] lg:h-[558px] lg:w-[474px]">
            <video
              src="/Landing/Responsive.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload noremoteplayback noplaybackrate"
              aria-hidden="true"
              style={{
                filter: 'brightness(1.03) contrast(1.04)',
              }}
              className="pointer-events-none h-full w-full select-none object-contain transition-transform duration-300 md:scale-[1.5] lg:scale-[2] [clip-path:inset(3px_3px_3px_3px)]"
            />
          </div>

          <div className="relative z-10 w-full max-w-[712px] lg:ml-[63px] lg:mt-[9px]">
            <p className="text-[20px] font-semibold leading-[40px] text-[#B8B8B8] lg:text-[23px]">
              Lorem Ipsum dolor sit
            </p>
            <h2 className="mt-[12px] text-[40px] font-semibold leading-[63px] lg:text-[50px]">
              Responsive Website
            </h2>
            <p className="mt-[30px] text-[20px] leading-[34px] lg:text-[25px] lg:leading-[40px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu
            </p>
            <Link
              href="#"
              className="mt-[30px] flex h-[65px] w-[204px] items-center justify-center rounded-[15px] bg-[#333333] text-[20px] font-semibold text-white transition-opacity hover:opacity-85"
            >
              Lorem ipsum
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- MASALAH YANG DISELESAIKAN ---------------- */}
      <section className="mt-[100px] bg-[#333333] px-4 pb-[100px] pt-[80px] lg:mt-[192px] lg:pb-[160px] lg:pt-[119px]">
        <p className="text-center text-[20px] leading-[40px] text-[#E3E3E3] lg:text-[23px]">
          Lorem Ipsum dolor sit
        </p>
        <h2 className="mt-[0px] text-center text-[36px] font-semibold leading-[63px] text-white lg:text-[50px]">
          Masalah yang Diselesaikan
        </h2>

        <div className="mx-auto mt-[40px] max-w-[1161px] lg:mt-[83px]">
          <TestimonialCarousel />
        </div>
      </section>

      {/* ---------------- FITUR UTAMA ---------------- */}
      <section className="mx-auto w-full max-w-[1440px] px-6 pb-[120px] pt-[80px] lg:px-[84px] lg:pt-[120px]">
        {/* ---------------- FITUR UTAMA ---------------- */}
        <div id="fitur">
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#B8B8B8]">
            Semua info ruangan, satu tempat
          </p>
          <h2 className="mt-3 text-[40px] font-semibold leading-[56px] lg:text-[50px]">
            Fitur Utama SiRuang
          </h2>
          <p className="mt-5 max-w-[760px] text-[20px] leading-[34px] lg:text-[22px] lg:leading-[36px]">
            SiRuang membantu PJ kelas, dosen, dan mahasiswa melihat status ruangan, mengajukan
            booking, dan berkomunikasi dalam satu website.
          </p>

          <div className="mt-10 lg:mt-[56px]">
            <FiturUtamaCards variant="web" />
          </div>
        </div>
      </section>

      {/* ---------------- CARA KERJA ---------------- */}
      <CaraKerjaSection variant="web" />
    </div>
  );
}
