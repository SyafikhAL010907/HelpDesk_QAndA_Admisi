import React from 'react';

import Image from 'next/image';

interface LogoProps {
  onlyLogo?: boolean;
  width?: number;
  height?: number;
}

const Logo = ({ onlyLogo = false, width = 45, height = 45 }: LogoProps) => {
  if (onlyLogo) {
    return (
      <Image
        src="/unj.png"
        alt="Logo UNJ"
        width={width}
        height={height}
        className="object-contain drop-shadow-md"
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-200 border border-emerald-50 transition-transform duration-500 hover:scale-110">
        <Image
          src="/unj.png"
          alt="Logo UNJ"
          width={width}
          height={height}
          className="object-contain drop-shadow-md"
        />
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-black text-slate-800 tracking-tighter leading-none flex items-center gap-1">
          Admin Admisi UNJ<span className="text-emerald-500 text-3xl leading-none">.</span>
        </h3>
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Admisi Universitas</span>
      </div>
    </div>
  );
};

export default Logo;
