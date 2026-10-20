'use client';

/**
 * Denah Gedung SFD - Lantai 3
 * File Khusus Komponen Denah Visual SVG (DenahL3SFD)
 */

import React from 'react';

export const NOMOR_LANTAI = 3;
const LANTAI_LABEL = `Lantai ${NOMOR_LANTAI} · Tower A`;
const LABEL_VERTICAL = true;

// Ruangan yang dapat dibooking di Lantai 3 SFD
const BOOKABLE_ROOMS = new Set(['R-01', 'R-02', 'R-03', 'R-04', 'R-05', 'R-06', 'R-07']);

export function Shaft({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g className="stroke-slate-400" strokeWidth={1.5} pointerEvents="none">
      <rect x={x} y={y} width={w} height={h} className="fill-slate-100" />
      <line x1={x} y1={y} x2={x + w} y2={y + h} />
      <line x1={x + w} y1={y} x2={x} y2={y + h} />
    </g>
  );
}

export function Door({ x, y, r = 14, rot = 0 }: { x: number; y: number; r?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} pointerEvents="none">
      <line x1={0} y1={0} x2={r} y2={0} stroke="#f8fafc" strokeWidth={4} />
      <line x1={0} y1={0} x2={0} y2={-r} className="stroke-slate-500" strokeWidth={1.5} />
      <path d={`M0 ${-r} A${r} ${r} 0 0 1 ${r} 0`} fill="none" className="stroke-slate-400" strokeWidth={1} />
    </g>
  );
}

export function YouAreHere() {
  return (
    <g transform="translate(432 462)" pointerEvents="none">
      <path
        d="M0 0 C -8 -10 -18 -17 -18 -30 A18 18 0 1 1 18 -30 C 18 -17 8 -10 0 0 Z"
        className="fill-rose-500 stroke-white"
        strokeWidth={1.5}
      />
      <circle cx={0} cy={-30} r={13} className="fill-white" />
      <text x={0} y={-32} textAnchor="middle" fontSize={6} fontWeight={700} className="fill-rose-600">
        YOU ARE
      </text>
      <text x={0} y={-25} textAnchor="middle" fontSize={6} fontWeight={700} className="fill-rose-600">
        HERE
      </text>
    </g>
  );
}

export interface RoomShapeProps {
  kode: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  cx: number;
  cy: number;
  lines: string[];
  fs?: number;
  selected?: string | null;
  onSelect?: (kode: string) => void;
  children?: React.ReactNode;
  points?: string;
  bookable?: boolean;
}

export function RoomShape({
  kode,
  x,
  y,
  w,
  h,
  cx,
  cy,
  lines,
  fs = 14,
  selected,
  onSelect,
  children,
  points,
  bookable,
}: RoomShapeProps) {
  const isBookable = bookable !== undefined ? bookable : BOOKABLE_ROOMS.has(kode);
  const aktif = selected === kode;
  const warna = aktif
    ? 'fill-sky-200 stroke-sky-600'
    : isBookable
      ? 'fill-white group-hover:fill-sky-100 stroke-slate-500'
      : 'fill-slate-100 group-hover:fill-slate-200 stroke-slate-500';

  return (
    <g
      id={`ruangan-${kode}`}
      className="group cursor-pointer outline-none"
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(kode)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(kode);
        }
      }}
    >
      {points ? (
        <polygon
          points={points}
          strokeWidth={2}
          className={`${warna} transition-colors group-focus-visible:stroke-sky-600`}
        />
      ) : (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          strokeWidth={2}
          className={`${warna} transition-colors group-focus-visible:stroke-sky-600`}
        />
      )}
      {children}
      <g
        transform={`translate(${cx} ${cy}) rotate(${LABEL_VERTICAL ? 90 : 0})`}
        className="pointer-events-none select-none"
      >
        {lines.map((t: string, i: number) => (
          <text
            key={t}
            x={0}
            y={(i - (lines.length - 1) / 2) * (fs + 6)}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={fs}
            fontWeight={600}
            letterSpacing="0.04em"
            className="fill-slate-700 font-sans"
          >
            {t}
          </text>
        ))}
      </g>
    </g>
  );
}

export interface DenahL3SFDProps {
  selectedCode: string | null;
  onSelectRoom: (kode: string) => void;
  className?: string;
}

export function DenahL3SFD({
  selectedCode = null,
  onSelectRoom = () => {},
  className,
}: DenahL3SFDProps) {
  const p = { selected: selectedCode, onSelect: onSelectRoom };

  return (
    <svg viewBox="100 55 1050 635" className={className} preserveAspectRatio="xMidYMid meet">
      <text x={1130} y={72} textAnchor="end" fontSize={15} className="fill-slate-400 font-sans">
        {LANTAI_LABEL}
      </text>
      <rect x={120} y={85} width={1010} height={585} rx={80} fill="none" className="stroke-slate-300" strokeWidth={2} />
      <rect x={165} y={125} width={900} height={510} className="fill-slate-50 stroke-slate-600" strokeWidth={4} />
      <polygon
        points="370,98 535,122 697,96 940,124 940,132 370,132"
        className="fill-emerald-200 stroke-emerald-600"
        strokeWidth={1.5}
      />
      <rect x={165} y={118} width={185} height={16} className="fill-amber-100 stroke-amber-300" strokeWidth={1} />
      <rect x={1045} y={425} width={22} height={185} className="fill-emerald-200 stroke-emerald-600" strokeWidth={1} />
      <rect x={725} y={600} width={340} height={22} className="fill-emerald-200 stroke-emerald-600" strokeWidth={1} />

      <RoomShape kode="R-01" x={193} y={160} w={172} h={160} cx={310} cy={235} lines={['PLC LAB']} fs={16} {...p}>
        <rect x={193} y={228} width={62} height={90} fill="none" className="stroke-slate-400" strokeWidth={1.5} />
      </RoomShape>
      <RoomShape kode="R-02" x={365} y={160} w={335} h={202} cx={520} cy={225} lines={['MEETING ROOM']} fs={17} {...p}>
        <rect x={537} y={285} width={103} height={77} fill="none" className="stroke-slate-400" strokeWidth={1.5} />
        <line x1={525} y1={160} x2={525} y2={185} className="stroke-slate-400" strokeWidth={2} />
        <line x1={545} y1={160} x2={545} y2={185} className="stroke-slate-400" strokeWidth={2} />
      </RoomShape>
      <RoomShape kode="R-03" x={700} y={135} w={165} h={220} cx={790} cy={235} lines={['HIGH VOLTAGE LAB', '& ELECTRICAL LAB']} fs={14} {...p}>
        <rect x={702} y={293} width={38} height={60} fill="none" className="stroke-slate-400" strokeWidth={1.5} />
      </RoomShape>
      <RoomShape kode="R-04" x={865} y={135} w={90} h={210} cx={910} cy={195} lines={['ROBOTIC LAB']} fs={14} {...p} />
      <g pointerEvents="none">
        <rect x={955} y={135} width={85} height={210} className="fill-slate-100 stroke-slate-500" strokeWidth={2} />
        <rect x={968} y={285} width={22} height={52} fill="none" className="stroke-slate-400" strokeWidth={1.5} />
      </g>
      <g pointerEvents="none">
        <rect x={190} y={322} width={80} height={112} className="fill-slate-100 stroke-slate-500" strokeWidth={2} />
      </g>
      <Shaft x={222} y={352} w={48} h={48} />
      <g pointerEvents="none">
        <rect x={195} y={437} width={65} height={178} className="fill-slate-100 stroke-slate-500" strokeWidth={2} />
        <rect x={262} y={437} width={68} height={178} className="fill-slate-100 stroke-slate-500" strokeWidth={2} />
        <rect x={270} y={505} width={42} height={8} fill="none" className="stroke-slate-400" strokeWidth={1.5} />
        <rect x={290} y={505} width={8} height={40} fill="none" className="stroke-slate-400" strokeWidth={1.5} />
        <rect x={268} y={545} width={46} height={50} fill="none" className="stroke-slate-400" strokeWidth={1.5} />
      </g>

      <RoomShape kode="R-13" x={330} y={432} w={40} h={185} cx={351} cy={525} lines={['ELECTRICAL PANEL ROOM']} fs={10} {...p} />
      <RoomShape kode="R-12" x={372} y={430} w={55} h={58} cx={400} cy={459} lines={['ELECTRONICA', 'PANEL ROOM']} fs={8} {...p} />
      <Shaft x={372} y={488} w={53} h={128} />
      <RoomShape kode="R-11" x={430} y={487} w={57} h={133} cx={458} cy={555} lines={['LOBBY LIFT']} fs={13} {...p} />
      <RoomShape kode="R-08" x={487} y={430} w={60} h={115} cx={517} cy={490} lines={['PANTRY']} fs={13} {...p} />
      <Shaft x={487} y={547} w={68} h={70} />

      <g pointerEvents="none">
        <rect x={548} y={428} width={164} height={34} className="fill-white stroke-slate-500" strokeWidth={2} />
        <circle cx={575} cy={445} r={5} fill="none" className="stroke-slate-400" />
        <circle cx={600} cy={445} r={5} fill="none" className="stroke-slate-400" />
        <circle cx={660} cy={445} r={5} fill="none" className="stroke-slate-400" />
        <circle cx={685} cy={445} r={5} fill="none" className="stroke-slate-400" />
      </g>
      <RoomShape kode="R-09" x={548} y={462} w={82} h={150} cx={572} cy={545} lines={['MAN TOILET']} fs={13} {...p}>
        <rect x={595} y={470} width={30} height={34} fill="none" className="stroke-slate-400" strokeWidth={1.5} />
      </RoomShape>
      <RoomShape kode="R-10" x={630} y={462} w={82} h={146} cx={690} cy={540} lines={['WOMAN TOILET']} fs={13} {...p}>
        <rect x={634} y={470} width={30} height={34} fill="none" className="stroke-slate-400" strokeWidth={1.5} />
      </RoomShape>
      <RoomShape kode="R-05" x={720} y={420} w={95} h={185} cx={770} cy={510} lines={['DIGITAL LAB']} fs={14} {...p} />
      <RoomShape kode="R-06" x={815} y={420} w={120} h={180} cx={850} cy={515} lines={['ANALOG LAB']} fs={14} {...p}>
        <rect x={880} y={420} width={55} height={80} fill="none" className="stroke-slate-400" strokeWidth={1.5} />
      </RoomShape>
      <RoomShape kode="R-07" x={940} y={412} w={108} h={185} cx={995} cy={500} lines={['TELECOMMUNICATION', 'LAB']} fs={13} {...p} />

      <Door x={330} y={320} rot={0} />
      <Door x={490} y={362} r={12} rot={0} />
      <Door x={520} y={362} r={12} rot={0} />
      <Door x={848} y={355} r={14} rot={0} />
      <Door x={945} y={345} r={12} rot={0} />
      <Door x={745} y={420} r={14} rot={180} />
      <Door x={850} y={420} r={14} rot={180} />
      <Door x={948} y={412} r={14} rot={180} />
      <YouAreHere />
    </svg>
  );
}

export default DenahL3SFD;

// Re-export dengan nama lama agar backward-compatible
export { DenahL3SFD as DenahSvgSfd };
