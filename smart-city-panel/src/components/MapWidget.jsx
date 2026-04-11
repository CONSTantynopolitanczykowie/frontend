// src/components/MapWidget.jsx
import React, { useState } from 'react';
import { Map, Trash2, Users, ChevronRight } from 'lucide-react';
import { BEACH_ENTRIES } from '../data/mockData';
import { DashboardCard } from '../ui/DashboardCard';
import { ProgressBar } from '../ui/ProgressBar';

const STATUS_CONFIG = {
  green:  { bg: 'bg-green-500',  glow: 'shadow-green-500/60',  ring: 'ring-green-500/30',  text: 'text-green-400',  label: 'Wolno'  },
  yellow: { bg: 'bg-yellow-500', glow: 'shadow-yellow-500/60', ring: 'ring-yellow-500/30', text: 'text-yellow-400', label: 'Średnio' },
  red:    { bg: 'bg-red-500',    glow: 'shadow-red-500/60',    ring: 'ring-red-500/30',    text: 'text-red-400',    label: 'Tłok'   },
};

// Mapowanie zajętości na kolor RGB heatmapy
const heatColor = (occ) => {
  // 0%→ zielony, 50%→żółty, 100%→czerwony
  if (occ <= 50) {
    // zielony → żółty
    const t = occ / 50;
    const r = Math.round(34  + (234 - 34)  * t);
    const g = Math.round(197 + (179 - 197) * t);
    const b = Math.round(94  + (8   - 94)  * t);
    return `rgb(${r},${g},${b})`;
  } else {
    // żółty → czerwony
    const t = (occ - 50) / 50;
    const r = Math.round(234 + (239 - 234) * t);
    const g = Math.round(179 + (68  - 179) * t);
    const b = Math.round(8   + (68  - 8)   * t);
    return `rgb(${r},${g},${b})`;
  }
};

// ────────────────────────────────────────────────────────────────
//  SVG HEATMAPA
//  Szerokość=100%, Wysokość=200px
//  Linia brzegowa przebiega w 60% wysokości
// ────────────────────────────────────────────────────────────────
const SVG_W = 900;
const SVG_H = 200;
const SHORE_Y = SVG_H * 0.55;   // y linii brzegu

// Konwersja pozycji wejścia (coords.x w 0-50 skali gridu) → SVG x
const entryToSvgX = (gridX) => (gridX / 44) * SVG_W;

const HeatmapSVG = ({ entries, selectedId, onSelect }) => {
  return (
    <div className="relative rounded-xl overflow-hidden border border-white/5 cursor-pointer select-none">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        height={SVG_H}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Filtr rozmycia – rdzeń heatmapy */}
          <filter id="heatblur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="28" result="blur" />
          </filter>

          {/* Gradient tła morza */}
          <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c4a6e" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Gradient piasku */}
          <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          {/* Gradient lasu */}
          <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>

          {/* Maska, żeby heatmapa była TYLKO na piasku (między promenadą a morzem) */}
          <clipPath id="sandClip">
            <rect x="0" y={SHORE_Y * 0.38} width={SVG_W} height={SHORE_Y * 0.73} />
          </clipPath>
        </defs>

        {/* ── Tło: las (góra) ──────────────────────────── */}
        <rect x="0" y="0" width={SVG_W} height={SHORE_Y * 0.38} fill="url(#forestGrad)" />
        {/* Drzewka dekoracyjne */}
        {Array.from({ length: 22 }).map((_, i) => (
          <text
            key={i}
            x={i * (SVG_W / 22) + 10}
            y={18 + (i % 2) * 9}
            fontSize={i % 3 === 0 ? 18 : 14}
            opacity={0.55}
          >🌲</text>
        ))}
        <text x={12} y={SHORE_Y * 0.38 - 5} fontSize={10} fill="rgba(255,255,255,0.5)" fontWeight="600" letterSpacing="1">
          LAS NADMORSKI
        </text>

        {/* ── Promenada ──────────────────────────────────── */}
        <rect x="0" y={SHORE_Y * 0.38} width={SVG_W} height={8} fill="#e5e7eb" opacity={0.7} />

        {/* ── Tło: piasek ─────────────────────────────────  */}
        <rect x="0" y={SHORE_Y * 0.38 + 8} width={SVG_W} height={SHORE_Y * 0.65} fill="url(#sandGrad)" opacity={0.85} />

        {/* ── HEATMAPA (rozmyte plamy zagęszczenia) ─────── */}
        <g clipPath="url(#sandClip)" filter="url(#heatblur)">
          {entries.map((entry) => {
            const cx = entryToSvgX(entry.coords.x);
            // Centrum plamy: środek pasa piachu
            const cy = SHORE_Y * 0.38 + 8 + (SHORE_Y * 0.65 * 0.5);
            const r = 55 + (entry.sandOccupancy / 100) * 60;  // większa plama = więcej okupacji
            const color = heatColor(entry.sandOccupancy);
            const opacity = 0.35 + (entry.sandOccupancy / 100) * 0.45;

            return (
              <circle
                key={entry.id}
                cx={cx}
                cy={cy}
                r={r}
                fill={color}
                opacity={opacity}
              />
            );
          })}
        </g>

        {/* ── Linia brzegu (pianka fal) ─────────────────── */}
        {Array.from({ length: Math.floor(SVG_W / 18) }).map((_, i) => (
          <ellipse
            key={i}
            cx={i * 18 + 9}
            cy={SHORE_Y}
            rx={8}
            ry={3}
            fill="#bfdbfe"
            opacity={0.5 + (i % 2) * 0.15}
          />
        ))}

        {/* ── Tło: morze ─────────────────────────────────── */}
        <rect x="0" y={SHORE_Y} width={SVG_W} height={SVG_H - SHORE_Y} fill="url(#seaGrad)" opacity={0.9} />
        {/* Linie fal */}
        {[12, 28, 44].map((offset, i) => (
          <line
            key={i}
            x1={0} y1={SHORE_Y + offset}
            x2={SVG_W} y2={SHORE_Y + offset}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={2}
          />
        ))}
        <text x={SVG_W / 2} y={SVG_H - 8} fontSize={10} fill="rgba(255,255,255,0.3)"
          textAnchor="middle" fontWeight="600" letterSpacing="2">
          ≋ MORZE BAŁTYCKIE ≋
        </text>

        {/* ── Markery wejść ────────────────────────────────  */}
        {entries.map((entry) => {
          const cx = entryToSvgX(entry.coords.x);
          const cy = SHORE_Y * 0.38 + 4; // na promenadzie
          const isSelected = entry.id === selectedId;
          const conf = STATUS_CONFIG[entry.status];
          const dotColor =
            entry.status === 'red'    ? '#ef4444' :
            entry.status === 'yellow' ? '#eab308' : '#22c55e';

          return (
            <g key={entry.id} onClick={() => onSelect(entry)} style={{ cursor: 'pointer' }}>
              {/* Glow ring dla wybranego lub czerwonego */}
              {(isSelected || entry.status === 'red') && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 14 : 11}
                  fill={dotColor}
                  opacity={0.25}
                />
              )}
              {/* Kółko markera */}
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 8 : 6}
                fill={dotColor}
                stroke="white"
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
              {/* Etykieta */}
              <text
                x={cx}
                y={cy - 12}
                fontSize={isSelected ? 9 : 8}
                fill={isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)'}
                textAnchor="middle"
                fontWeight={isSelected ? '800' : '600'}
              >
                {entry.name.replace('Wejście ', 'W')}
              </text>
            </g>
          );
        })}

        {/* ── Skala legendy heatmapy ─────────────────────── */}
        <defs>
          <linearGradient id="scaleGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#22c55e" />
            <stop offset="50%"  stopColor="#eab308" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <rect x={SVG_W - 100} y={SVG_H - 26} width={80} height={8} rx={4} fill="url(#scaleGrad)" opacity={0.8} />
        <text x={SVG_W - 100} y={SVG_H - 30} fontSize={8} fill="rgba(255,255,255,0.5)">Wolno</text>
        <text x={SVG_W - 30}  y={SVG_H - 30} fontSize={8} fill="rgba(255,255,255,0.5)" textAnchor="end">Tłok</text>
      </svg>

      {/* Overlay etykiet stref */}
      <div className="absolute top-1 left-2 text-[9px] text-white/30 font-semibold tracking-widest uppercase pointer-events-none">
        Sopot&nbsp;Pn ←
      </div>
      <div className="absolute top-1 right-2 text-[9px] text-white/30 font-semibold tracking-widest uppercase pointer-events-none">
        → Sopot&nbsp;Pd
      </div>
    </div>
  );
};

// ── Panel szczegółów wejścia ───────────────────────────────────
const EntryDetail = ({ entry }) => {
  if (!entry) return null;
  const conf = STATUS_CONFIG[entry.status];
  return (
    <div className="rounded-xl p-4 bg-slate-800/60 border border-white/5 mt-3 animate-slide-in">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-white">{entry.name}</h3>
          <div className={`text-xs font-semibold mt-0.5 ${conf.text}`}>● {conf.label}</div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
          <Users className="w-4 h-4" />
          <span className="font-bold text-white">{entry.tourists.toLocaleString('pl-PL')}</span>
          <span className="text-xs">os.</span>
        </div>
      </div>
      <div className="space-y-2.5">
        <ProgressBar value={entry.sandOccupancy} label="Zajętość piasku" size="md" />
        <div className="flex items-center gap-2">
          <Trash2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <ProgressBar value={entry.binOccupancy} label="Zapełnienie koszy" size="md" className="flex-1" />
        </div>
      </div>
    </div>
  );
};

// ── Lista wejść ────────────────────────────────────────────────
const EntryList = ({ entries, selectedId, onSelect }) => (
  <div className="space-y-1.5 mt-3 max-h-[180px] overflow-y-auto pr-1">
    {entries.map((entry) => {
      const conf = STATUS_CONFIG[entry.status];
      const isSelected = entry.id === selectedId;
      return (
        <button
          key={entry.id}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group
            ${isSelected
              ? 'bg-slate-700/80 border border-white/10'
              : 'bg-slate-800/40 border border-transparent hover:bg-slate-700/40 hover:border-white/5'}
          `}
          onClick={() => onSelect(entry)}
        >
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${conf.bg} ${entry.status === 'red' ? 'animate-pulse' : ''}`} />
          <span className="flex-1 text-sm font-medium text-slate-300">{entry.name}</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">{entry.sandOccupancy}%</span>
            <Trash2 className={`w-3 h-3 ${entry.binOccupancy >= 85 ? 'text-red-400' : 'text-slate-600'}`} />
            <span className={entry.binOccupancy >= 85 ? 'text-red-400 font-bold' : 'text-slate-500'}>
              {entry.binOccupancy}%
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
        </button>
      );
    })}
  </div>
);

// ── Główny widget ──────────────────────────────────────────────
export const MapWidget = () => {
  const [selected, setSelected] = useState(BEACH_ENTRIES.find((e) => e.status === 'red') ?? null);

  return (
    <DashboardCard
      title="Mapa Plaży – Sopot"
      icon={<Map className="w-4 h-4 text-sky-400" />}
      className="h-full"
      headerRight={
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live · Heatmapa zagęszczenia
        </div>
      }
    >
      <HeatmapSVG
        entries={BEACH_ENTRIES}
        selectedId={selected?.id}
        onSelect={setSelected}
      />
      <EntryDetail entry={selected} />
      <EntryList entries={BEACH_ENTRIES} selectedId={selected?.id} onSelect={setSelected} />
    </DashboardCard>
  );
};

export default MapWidget;
