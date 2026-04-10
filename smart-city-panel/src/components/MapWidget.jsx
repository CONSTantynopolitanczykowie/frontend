// src/components/MapWidget.jsx
import React, { useState } from 'react';
import { Map, Trash2, Users, ChevronRight } from 'lucide-react';
import { BEACH_ENTRIES } from '../data/mockData';
import { DashboardCard } from '../ui/DashboardCard';
import { ProgressBar } from '../ui/ProgressBar';

const STATUS_CONFIG = {
  green: {
    bg: 'bg-green-500',
    glow: 'shadow-green-500/60',
    ring: 'ring-green-500/30',
    text: 'text-green-400',
    label: 'Luźno',
  },
  yellow: {
    bg: 'bg-yellow-500',
    glow: 'shadow-yellow-500/60',
    ring: 'ring-yellow-500/30',
    text: 'text-yellow-400',
    label: 'Średnio',
  },
  red: {
    bg: 'bg-red-500',
    glow: 'shadow-red-500/60',
    ring: 'ring-red-500/30',
    text: 'text-red-400',
    label: 'Tłok',
  },
};

// Wizualna linia brzegowa – grid punktów
const CoastalMap = ({ entries, selectedId, onSelect }) => {
  // Stałe tło mapy
  const COLS = 50;
  const ROWS = 9;

  const entryMap = {};
  entries.forEach((e) => {
    const col = e.coords.x;
    entryMap[`${col}-${e.coords.y}`] = e;
  });

  return (
    <div className="relative rounded-xl overflow-hidden bg-slate-900/80 border border-white/5 p-3">
      {/* Etykiety osi */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] text-slate-500 font-medium">← Sopot Północ</span>
        <span className="text-[10px] text-slate-500 font-medium">Sopot Południe →</span>
      </div>

      {/* Morze label */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] text-sky-700/50 font-semibold tracking-widest uppercase pointer-events-none"
        style={{ writingMode: 'horizontal-tb' }}
      >
        ≋ Morze Bałtyckie ≋
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-0.5">
        {Array.from({ length: ROWS }).map((_, row) => (
          <div key={row} className="flex gap-0.5">
            {Array.from({ length: COLS }).map((_, col) => {
              const entry = entryMap[`${col}-${row}`];
              const isEntry = !!entry;
              const isSelected = entry?.id === selectedId;
              const conf = entry ? STATUS_CONFIG[entry.status] : null;

              // Gradient morza (górne rzędy) vs piasku (dolne)
              const isSea = row < 5;
              const isSand = row >= 5;

              const baseBg = isSea
                ? 'bg-sky-950/40'
                : isSand
                ? 'bg-amber-950/30'
                : 'bg-slate-800';

              return (
                <div
                  key={col}
                  className={`
                    relative flex-1 rounded-[2px] transition-all
                    ${isEntry
                      ? `cursor-pointer z-10 ${conf.bg} shadow-sm ${conf.glow}
                         ${isSelected ? `ring-2 ${conf.ring} scale-150` : 'hover:scale-125'}
                         ${entry.status === 'red' ? 'animate-pulse' : ''}`
                      : `${baseBg} ${isSea ? 'opacity-40' : 'opacity-60'}`
                    }
                  `}
                  style={{ height: 14 }}
                  onClick={() => isEntry && onSelect(entry)}
                  title={isEntry ? `${entry.name} – ${entry.sandOccupancy}%` : undefined}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legenda mapy */}
      <div className="flex items-center gap-4 mt-3 px-1">
        {Object.entries(STATUS_CONFIG).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${val.bg}`} />
            <span className="text-[10px] text-slate-400">{val.label}</span>
          </div>
        ))}
        <div className="ml-auto text-[10px] text-slate-600">Kliknij marker aby zobaczyć szczegóły</div>
      </div>
    </div>
  );
};

// Panel szczegółów wybranego wejścia
const EntryDetail = ({ entry }) => {
  if (!entry) return null;
  const conf = STATUS_CONFIG[entry.status];

  return (
    <div className={`rounded-xl p-4 bg-slate-800/60 border border-white/5 mt-3 animate-slide-in`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-white">{entry.name}</h3>
          <div className={`text-xs font-semibold mt-0.5 ${conf.text}`}>
            ● {conf.label}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
          <Users className="w-4 h-4" />
          <span className="font-bold text-white">{entry.tourists.toLocaleString('pl-PL')}</span>
          <span className="text-xs">os.</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <ProgressBar
          value={entry.sandOccupancy}
          label="Zajętość piasku"
          size="md"
        />
        <div className="flex items-center gap-2">
          <Trash2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <ProgressBar
            value={entry.binOccupancy}
            label="Zapełnienie koszy"
            size="md"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

// Lista wszystkich wejść
const EntryList = ({ entries, selectedId, onSelect }) => (
  <div className="space-y-1.5 mt-3 max-h-[200px] overflow-y-auto pr-1">
    {entries.map((entry) => {
      const conf = STATUS_CONFIG[entry.status];
      const isSelected = entry.id === selectedId;

      return (
        <button
          key={entry.id}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
            text-left transition-all group
            ${isSelected
              ? 'bg-slate-700/80 border border-white/10'
              : 'bg-slate-800/40 border border-transparent hover:bg-slate-700/40 hover:border-white/5'
            }
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
          Live
        </div>
      }
    >
      <CoastalMap
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
