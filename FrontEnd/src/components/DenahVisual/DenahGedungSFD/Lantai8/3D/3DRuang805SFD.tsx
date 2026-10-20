'use client';

import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Ruang 805 SFD
// - Meja komputer 2 layer (U luar hadap tembok, U dalam hadap tengah), 1 meja = 2 orang
// - Meja proyektor + meja dosen (panjang, 1 PC) nempel
// - Jendela kaca di tengah dinding belakang, pintu di dinding depan (sejajar layar proyektor), 2 AC central di plafon
// Install: npm i three @react-three/fiber @react-three/drei  (+ @types/three)

const W = 12.7; // lebar (x)
const D = 13; // panjang (z), layar proyektor di z = +D/2
const DOOR_SIDE = -1; // -1 = sisi kiri depan (x negatif), 1 = sisi kanan depan
const H = 3.2; // tinggi ruangan
const DL = 1.4; // panjang meja komputer (2 orang)

const M = {
  wood: new THREE.MeshStandardMaterial({ color: "#2e1b10", roughness: 0.4, metalness: 0.08 }),
  woodTop: new THREE.MeshStandardMaterial({ color: "#3d2416", roughness: 0.32, metalness: 0.1 }),
  black: new THREE.MeshStandardMaterial({ color: "#0e0e10", roughness: 0.5, metalness: 0.3 }),
  metal: new THREE.MeshStandardMaterial({ color: "#8a8d92", roughness: 0.3, metalness: 0.8 }),
  screen: new THREE.MeshStandardMaterial({ color: "#0a1a2e", emissive: "#1d5fa8", emissiveIntensity: 0.55, roughness: 0.2 }),
  cable: new THREE.MeshStandardMaterial({ color: "#161616", roughness: 0.6 }),
  cableW: new THREE.MeshStandardMaterial({ color: "#d8d8d8", roughness: 0.6 }),
  chair: new THREE.MeshStandardMaterial({ color: "#23262b", roughness: 0.8 }),
  oakTop: new THREE.MeshStandardMaterial({ color: "#c9a574", roughness: 0.4, metalness: 0.05 }),
  oak: new THREE.MeshStandardMaterial({ color: "#b58b58", roughness: 0.5, metalness: 0.05 }),
  panel: new THREE.MeshStandardMaterial({ color: "#ecebe6", roughness: 0.6 }),
  pc: new THREE.MeshStandardMaterial({ color: "#d9dce0", roughness: 0.35, metalness: 0.4 }),
  bezel: new THREE.MeshStandardMaterial({ color: "#3a3f47", roughness: 0.45, metalness: 0.3 }),
  key: new THREE.MeshStandardMaterial({ color: "#eeeeee", roughness: 0.6 }),
  chairBlue: new THREE.MeshStandardMaterial({ color: "#2f63b0", roughness: 0.75 }),
  chairOrange: new THREE.MeshStandardMaterial({ color: "#e0822d", roughness: 0.75 }),
  chairGreen: new THREE.MeshStandardMaterial({ color: "#2e8b62", roughness: 0.75 }),
  wall: new THREE.MeshStandardMaterial({ color: "#f6f6f3", roughness: 0.95 }),
  base: new THREE.MeshStandardMaterial({ color: "#e4e1da", roughness: 0.6 }),
  frame: new THREE.MeshStandardMaterial({ color: "#2a2d31", roughness: 0.4, metalness: 0.6 }),
  glass: new THREE.MeshPhysicalMaterial({ color: "#cfe6f5", transparent: true, opacity: 0.14, roughness: 0.05, metalness: 0, depthWrite: false }),
  doorGlass: new THREE.MeshPhysicalMaterial({ color: "#a9d2ea", transparent: true, opacity: 0.4, roughness: 0.05, metalness: 0.1, depthWrite: false }),
  door: new THREE.MeshStandardMaterial({ color: "#8a6a48", roughness: 0.5, metalness: 0.05 }),
  acBody: new THREE.MeshStandardMaterial({ color: "#f2f3f4", roughness: 0.5 }),
  acSlot: new THREE.MeshStandardMaterial({ color: "#2b2e33", roughness: 0.6 }),
  led: new THREE.MeshStandardMaterial({ color: "#16c060", emissive: "#16c060", emissiveIntensity: 1.2 }),
  exit: new THREE.MeshStandardMaterial({ color: "#0b8a3e", emissive: "#12c457", emissiveIntensity: 0.9 }),
};

function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// kabel (dibuat sekali, dipakai semua meja)
const mkTube = (pts: [number, number, number][], r: number) =>
  new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 24, r, 6, false);
const CABLE_A = mkTube([[0, 0.95, -0.17], [0, 0.77, -0.27], [0.05, 0.55, -0.27], [0.2, 0.3, -0.12], [0.24, 0.22, -0.05]], 0.007);
const CABLE_B = mkTube([[0.27, 0.12, -0.25], [0.27, 0.02, -0.33], [0.1, 0.012, -0.36], [-0.15, 0.012, -0.4], [-0.3, 0.012, -0.55]], 0.008);

function useMarble() {
  return useMemo(() => {
    const S = 2048, N = 10, T = S / N;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const g = c.getContext("2d")!;
    const r = rng(42);
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) {
        const x = i * T, y = j * T;
        const grad = g.createRadialGradient(x + T * r(), y + T * r(), 10, x + T / 2, y + T / 2, T);
        grad.addColorStop(0, "#fbf9f4");
        grad.addColorStop(0.6, "#f1ebdf");
        grad.addColorStop(1, "#e6dcc8");
        g.fillStyle = grad;
        g.fillRect(x, y, T, T);
        g.save();
        g.beginPath();
        g.rect(x, y, T, T);
        g.clip();
        for (let k = 0; k < 5; k++) {
          g.strokeStyle = `rgba(160,140,110,${0.1 + r() * 0.18})`;
          g.lineWidth = 0.6 + r() * 1.6;
          g.beginPath();
          g.moveTo(x + r() * T, y);
          g.bezierCurveTo(x + r() * T, y + T * 0.3, x + r() * T, y + T * 0.7, x + r() * T, y + T);
          g.stroke();
        }
        g.restore();
        g.strokeStyle = "rgba(120,105,85,0.45)";
        g.lineWidth = 2;
        g.strokeRect(x, y, T, T);
      }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
}

// pemandangan gedung-gedung di luar jendela
function useCity() {
  return useMemo(() => {
    const w = 2048, h = 640;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d")!;
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#8fc0ec");
    sky.addColorStop(0.7, "#d9e9f5");
    sky.addColorStop(1, "#eef4f8");
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    const r = rng(7);
    const layers = [
      { color: "#b9c9d8", min: 160, max: 330, wmin: 70, wmax: 140, win: false },
      { color: "#8fa3b6", min: 120, max: 290, wmin: 80, wmax: 160, win: true },
      { color: "#5f7389", min: 70, max: 240, wmin: 90, wmax: 180, win: true },
    ];
    layers.forEach((L) => {
      let x = -20;
      while (x < w) {
        const bw = L.wmin + r() * (L.wmax - L.wmin);
        const bh = L.min + r() * (L.max - L.min);
        g.fillStyle = L.color;
        g.fillRect(x, h - bh, bw, bh);
        if (L.win) {
          for (let yy = h - bh + 12; yy < h - 10; yy += 18)
            for (let xx = x + 8; xx < x + bw - 10; xx += 14) {
              g.fillStyle = r() > 0.35 ? "rgba(225,240,255,0.55)" : "rgba(40,60,85,0.35)";
              g.fillRect(xx, yy, 7, 9);
            }
        }
        x += bw + 4 + r() * 10;
      }
    });
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

type P = React.JSX.IntrinsicElements["group"];

// satu tempat duduk (monitor, keyboard, mouse, PC, kabel, kursi)
function Seat({ sx, yaw, chairMat }: { sx: number; yaw: number; chairMat: THREE.Material }) {
  return (
    <group position={[sx, 0, 0]}>
      {/* monitor */}
      <mesh material={M.bezel} position={[0, 0.78, -0.15]}><boxGeometry args={[0.2, 0.012, 0.14]} /></mesh>
      <mesh material={M.metal} position={[0, 0.86, -0.17]}><boxGeometry args={[0.03, 0.17, 0.02]} /></mesh>
      <mesh material={M.bezel} position={[0, 1.03, -0.17]} castShadow><boxGeometry args={[0.52, 0.31, 0.022]} /></mesh>
      <mesh material={M.screen} position={[0, 1.03, -0.158]}><planeGeometry args={[0.49, 0.28]} /></mesh>
      {/* keyboard & mouse */}
      <mesh material={M.key} position={[0, 0.775, 0.14]}><boxGeometry args={[0.38, 0.016, 0.13]} /></mesh>
      <mesh material={M.key} position={[0.27, 0.772, 0.14]}><boxGeometry args={[0.05, 0.02, 0.08]} /></mesh>
      {/* PC case */}
      <mesh material={M.pc} position={[0.22, 0.2, -0.05]} castShadow><boxGeometry args={[0.17, 0.4, 0.38]} /></mesh>
      {/* kabel rapi */}
      <mesh material={M.cable} geometry={CABLE_A} />
      <mesh material={M.cableW} geometry={CABLE_B} />
      {/* kursi */}
      <group position={[0, 0, 0.7]} rotation={[0, yaw, 0]}>
        <mesh material={chairMat} position={[0, 0.46, 0]} castShadow><boxGeometry args={[0.42, 0.06, 0.42]} /></mesh>
        <mesh material={chairMat} position={[0, 0.72, 0.2]} castShadow><boxGeometry args={[0.42, 0.4, 0.05]} /></mesh>
        <mesh material={M.metal} position={[0, 0.23, 0]}><cylinderGeometry args={[0.025, 0.025, 0.46, 8]} /></mesh>
        <mesh material={M.metal} position={[0, 0.03, 0]}><cylinderGeometry args={[0.24, 0.24, 0.025, 5]} /></mesh>
      </group>
    </group>
  );
}

// meja komputer panjang, kapasitas 2 orang
function Desk({ seed = 1, chairMat = M.chairBlue, ...p }: P & { seed?: number; chairMat?: THREE.Material }) {
  const yaws = useMemo(() => {
    const r = rng(seed * 7 + 3);
    r(); r();
    return [(r() - 0.5) * 0.5, (r() - 0.5) * 0.5];
  }, [seed]);
  return (
    <group {...p}>
      <mesh material={M.oakTop} position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[DL, 0.04, 0.6]} />
      </mesh>
      {[-1, 0, 1].map((s) => (
        <mesh key={s} material={M.oak} position={[s * (DL / 2 - 0.02), 0.37, 0]} castShadow>
          <boxGeometry args={[0.03, 0.74, 0.56]} />
        </mesh>
      ))}
      <mesh material={M.panel} position={[0, 0.5, -0.27]} castShadow>
        <boxGeometry args={[DL - 0.06, 0.42, 0.02]} />
      </mesh>
      <Seat sx={-DL / 4} yaw={yaws[0]} chairMat={chairMat} />
      <Seat sx={DL / 4} yaw={yaws[1]} chairMat={chairMat} />
    </group>
  );
}

// meja proyektor / meja dosen (panjang, nempel)
function Teacher({ w = 1.3, withMonitor = true, ...p }: P & { w?: number; withMonitor?: boolean }) {
  return (
    <group {...p}>
      <mesh material={M.woodTop} position={[0, 0.76, 0]} castShadow receiveShadow><boxGeometry args={[w, 0.05, 0.7]} /></mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} material={M.wood} position={[s * (w / 2 - 0.03), 0.38, 0]} castShadow><boxGeometry args={[0.04, 0.74, 0.66]} /></mesh>
      ))}
      <mesh material={M.panel} position={[0, 0.5, -0.32]}><boxGeometry args={[w - 0.1, 0.45, 0.02]} /></mesh>
      {withMonitor ? (
        <>
          {/* 1 PC dosen */}
          <mesh material={M.bezel} position={[0, 1.05, -0.1]} castShadow><boxGeometry args={[0.6, 0.35, 0.025]} /></mesh>
          <mesh material={M.screen} position={[0, 1.05, -0.086]}><planeGeometry args={[0.57, 0.32]} /></mesh>
          <mesh material={M.metal} position={[0, 0.88, -0.1]}><boxGeometry args={[0.04, 0.2, 0.02]} /></mesh>
          <mesh material={M.key} position={[0, 0.78, 0.2]}><boxGeometry args={[0.4, 0.016, 0.14]} /></mesh>
          <mesh material={M.key} position={[0.3, 0.775, 0.2]}><boxGeometry args={[0.05, 0.02, 0.08]} /></mesh>
          <mesh material={M.pc} position={[0.45, 0.2, -0.05]} castShadow><boxGeometry args={[0.2, 0.4, 0.4]} /></mesh>
          <mesh material={M.chairGreen} position={[0, 0.5, 0.8]} castShadow><boxGeometry args={[0.45, 0.06, 0.45]} /></mesh>
          <mesh material={M.chairGreen} position={[0, 0.78, 1.0]} castShadow><boxGeometry args={[0.45, 0.45, 0.05]} /></mesh>
        </>
      ) : (
        <>
          {/* proyektor */}
          <mesh material={M.base} position={[0, 0.88, 0]} castShadow><boxGeometry args={[0.38, 0.14, 0.3]} /></mesh>
          <mesh material={M.black} position={[0, 0.88, 0.17]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.045, 0.045, 0.06, 16]} /></mesh>
        </>
      )}
    </group>
  );
}

// AC central (cassette plafon)
function AC(p: P) {
  const slots: [number, number, number, number][] = [
    [0, 0.4, 0.9, 0.05], [0, -0.4, 0.9, 0.05], [0.4, 0, 0.05, 0.9], [-0.4, 0, 0.05, 0.9],
  ];
  return (
    <group {...p}>
      <mesh material={M.acBody}><boxGeometry args={[1.1, 0.14, 1.1]} /></mesh>
      {slots.map(([x, z, a, b], i) => (
        <mesh key={i} material={M.acSlot} position={[x, -0.071, z]}><boxGeometry args={[a, 0.005, b]} /></mesh>
      ))}
      <mesh material={M.acSlot} position={[0, -0.071, 0]}><boxGeometry args={[0.5, 0.005, 0.5]} /></mesh>
      <mesh material={M.led} position={[0.45, -0.071, 0.45]}><boxGeometry args={[0.03, 0.006, 0.03]} /></mesh>
    </group>
  );
}

// jendela kaca besar di tengah dinding belakang
function WindowBack({ z }: { z: number }) {
  const city = useCity();
  const ww = 6, y0 = 1.1, y1 = 2.75, yc = (y0 + y1) / 2, hh = y1 - y0;
  return (
    <group>
      {/* pemandangan gedung */}
      <mesh position={[0, 1.9, z - 0.8]}>
        <planeGeometry args={[24, 7.5]} />
        <meshBasicMaterial map={city} toneMapped={false} />
      </mesh>
      {/* kaca */}
      <mesh material={M.glass} position={[0, yc, z - 0.02]}><planeGeometry args={[ww, hh]} /></mesh>
      {/* frame */}
      {[-ww / 2, ww / 2].map((x) => (
        <mesh key={x} material={M.frame} position={[x, yc, z + 0.02]}><boxGeometry args={[0.08, hh + 0.08, 0.1]} /></mesh>
      ))}
      {[y0, y1].map((y) => (
        <mesh key={y} material={M.frame} position={[0, y, z + 0.02]}><boxGeometry args={[ww + 0.08, 0.08, 0.1]} /></mesh>
      ))}
      {[-2, -1, 0, 1, 2].map((m) => (
        <mesh key={m} material={M.frame} position={[m, yc, z + 0.02]}><boxGeometry args={[0.04, hh, 0.06]} /></mesh>
      ))}
      <mesh material={M.frame} position={[0, yc, z + 0.02]}><boxGeometry args={[ww, 0.04, 0.06]} /></mesh>
      {/* sill */}
      <mesh material={M.base} position={[0, y0 - 0.03, z + 0.08]}><boxGeometry args={[ww + 0.3, 0.05, 0.2]} /></mesh>
    </group>
  );
}

// dinding belakang dengan lubang jendela
function BackWall() {
  const z = -D / 2;
  const ww = 6, y0 = 1.1, y1 = 2.75;
  const side = (W - ww) / 2;
  return (
    <>
      <mesh position={[-(ww / 2 + side / 2), H / 2, z]} material={M.wall} receiveShadow><planeGeometry args={[side, H]} /></mesh>
      <mesh position={[ww / 2 + side / 2, H / 2, z]} material={M.wall} receiveShadow><planeGeometry args={[side, H]} /></mesh>
      <mesh position={[0, y0 / 2, z]} material={M.wall} receiveShadow><planeGeometry args={[ww, y0]} /></mesh>
      <mesh position={[0, (y1 + H) / 2, z]} material={M.wall} receiveShadow><planeGeometry args={[ww, H - y1]} /></mesh>
      <WindowBack z={z} />
    </>
  );
}

// pintu ganda: 1 daun kecil + 1 daun besar saling nempel, masing-masing ada kaca panjang
function Door(p: P) {
  const leaves = [
    { x: -0.575, w: 0.75, gw: 0.2, hx: -0.28 }, // kecil
    { x: 0.375, w: 1.15, gw: 0.4, hx: -0.12 },  // besar
  ];
  return (
    <group {...p}>
      {/* kusen */}
      <mesh material={M.frame} position={[0, 2.14, 0.02]}><boxGeometry args={[2.08, 0.08, 0.1]} /></mesh>
      {[-0.99, 0.99, -0.2].map((x) => (
        <mesh key={x} material={M.frame} position={[x, 1.07, 0.02]}><boxGeometry args={[x === -0.2 ? 0.05 : 0.08, 2.14, 0.1]} /></mesh>
      ))}
      {leaves.map((l, i) => (
        <group key={i}>
          <mesh material={M.door} position={[l.x, 1.03, 0.03]}><boxGeometry args={[l.w - 0.04, 2.06, 0.05]} /></mesh>
          {/* kaca panjang di dalam pintu */}
          <mesh material={M.doorGlass} position={[l.x, 1.2, 0.06]}><planeGeometry args={[l.gw, 1.6]} /></mesh>
          <mesh material={M.metal} position={[l.hx, 1.0, 0.09]}><boxGeometry args={[0.03, 0.14, 0.04]} /></mesh>
        </group>
      ))}
      {/* lampu EXIT */}
      <mesh material={M.exit} position={[0, 2.38, 0.04]}><boxGeometry args={[0.45, 0.14, 0.04]} /></mesh>
    </group>
  );
}

function Room() {
  const marble = useMarble();
  const half = { x: W / 2, z: D / 2 };

  const desks = useMemo(() => {
    const out: { pos: [number, number, number]; rot: number; inner: boolean }[] = [];
    // === layer luar (U, hadap tembok) ===
    for (let i = 0; i < 7; i++) out.push({ pos: [(i - 3) * DL, 0, -half.z + 0.4], rot: 0, inner: false });
    for (let i = 0; i < 7; i++) {
      const z = -half.z + 0.75 + DL / 2 + i * DL;
      out.push({ pos: [-half.x + 0.4, 0, z], rot: Math.PI / 2, inner: false });
      out.push({ pos: [half.x - 0.4, 0, z], rot: -Math.PI / 2, inner: false });
    }
    // === layer dalam (U kebalik, hadap tengah) ===
    // jarak lorong antar layer (sandaran kursi ke sandaran kursi) = 0.9 m
    const IZ = -half.z + 3.15, IX = 3.2;
    for (let i = 0; i < 4; i++) out.push({ pos: [(i - 1.5) * DL, 0, IZ], rot: Math.PI, inner: true });
    for (let i = 0; i < 5; i++) {
      const z = IZ + 0.3 + DL / 2 + i * DL;
      out.push({ pos: [-IX, 0, z], rot: -Math.PI / 2, inner: true });
      out.push({ pos: [IX, 0, z], rot: Math.PI / 2, inner: true });
    }
    return out;
  }, []);

  return (
    <>
      {/* lantai marmer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial map={marble} roughness={0.18} metalness={0.15} />
      </mesh>
      {/* langit-langit + lampu (dibuat lebih redup) */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.wall}><planeGeometry args={[W, D]} /></mesh>
      {[-4.5, 0, 4.5].flatMap((x) => [-4.5, 0, 4.5].map((z) => (
        <mesh key={`${x}${z}`} position={[x, H - 0.02, z]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.8, 0.5]} />
          <meshStandardMaterial color="#fff" emissive="#fff7e6" emissiveIntensity={0.8} />
        </mesh>
      )))}
      {/* 2 AC central */}
      <AC position={[-2.25, H - 0.07, 0]} />
      <AC position={[2.25, H - 0.07, 0]} />

      {/* dinding */}
      <BackWall />
      <mesh position={[0, H / 2, half.z]} rotation={[0, Math.PI, 0]} material={M.wall} receiveShadow><planeGeometry args={[W, H]} /></mesh>
      <mesh position={[-half.x, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={M.wall} receiveShadow><planeGeometry args={[D, H]} /></mesh>
      <mesh position={[half.x, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} material={M.wall} receiveShadow><planeGeometry args={[D, H]} /></mesh>
      {/* list bawah */}
      {[
        [0, -half.z + 0.01, W, 0],
        [-5.95, half.z - 0.01, 0.8, 0], // kiri pintu
        [1.45, half.z - 0.01, 9.8, 0],  // kanan pintu
        [-half.x + 0.01, 0, D, Math.PI / 2],
        [half.x - 0.01, 0, D, Math.PI / 2],
      ].map(([x, z, l, r], i) => (
        <mesh key={i} material={M.base} position={[x, 0.07, z]} rotation={[0, r, 0]}><boxGeometry args={[l, 0.14, 0.02]} /></mesh>
      ))}

      {/* pintu: di dinding depan sejajar layar proyektor (sisi kiri masuk) */}
      <Door position={[DOOR_SIDE * 4.5, 0, half.z - 0.02]} rotation={[0, Math.PI, 0]} />

      {/* layar proyektor */}
      <group position={[0, 1.95, half.z - 0.06]} rotation={[0, Math.PI, 0]}>
        <mesh material={M.black}><boxGeometry args={[4.7, 2.9, 0.03]} /></mesh>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[4.5, 2.7]} />
          <meshStandardMaterial color="#ffffff" emissive="#dfe8ff" emissiveIntensity={0.3} />
        </mesh>
        <mesh material={M.metal} position={[0, 1.5, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 4.8, 12]} />
        </mesh>
      </group>

      {/* meja proyektor + meja dosen panjang, nempel ke ujung U dalam (kolom kanan), sisi kiri jadi jalan masuk */}
      <Teacher w={2.2} withMonitor={false} position={[0, 0, 4.3]} />
      <Teacher w={2.4} position={[2.3, 0, 4.3]} />

      {/* meja komputer 2 layer */}
      {desks.map((d, i) => (
        <Desk key={i} seed={i + 3} position={d.pos} rotation={[0, d.rot, 0]} chairMat={d.inner ? M.chairOrange : M.chairBlue} />
      ))}
    </>
  );
}

export default function Ruang805SFD({
  scrollSafe = false,
  className = "",
  style,
}: {
  scrollSafe?: boolean;
  className?: string;
  style?: React.CSSProperties;
} = {}) {
  return (
    <div className={`relative h-full w-full ${className}`} style={{ minHeight: 300, background: "#cfd3d8", ...style }}>
      <Canvas shadows camera={{ position: [0, 1.7, 1.2], fov: 70 }}>
        <color attach="background" args={["#cfd3d8"]} />
        <hemisphereLight args={["#ffffff", "#d9d2c4", 0.45]} />
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[3, H - 0.2, -2]} intensity={0.45} castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9}
        />
        {[[-4, -4], [4, -4], [-4, 4], [4, 4], [0, 0]].map(([x, z], i) => (
          <pointLight key={i} position={[x, H - 0.4, z]} intensity={2.5} distance={9} color="#fff4e0" />
        ))}
        <Room />
        {/* posisi awal: di tengah kelas, bebas muter/zoom/geser */}
        <OrbitControls
          target={[0, 1.3, 0]}
          minDistance={0.5}
          maxDistance={16}
          maxPolarAngle={Math.PI * 0.95}
          enableZoom={!scrollSafe}
        />
      </Canvas>
    </div>
  );
}
