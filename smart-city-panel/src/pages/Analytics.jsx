// src/pages/Analytics.jsx – Analityka i Raporty z Recharts
import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import {
  BarChart2, TrendingUp, Users, AlertTriangle, ChevronDown,
  Thermometer, Trash2, Award, CalendarDays,
} from 'lucide-react';
import { HOURLY_DATA, WEEKLY_STATS, BEACH_ENTRIES, STATS } from '../data/mockData';

// Kolory wejść
const ENTRY_COLORS = {
  w38: '#22c55e', w40: '#eab308', w42: '#ef4444',
  w43: '#f97316', w45: '#06b6d4', w47: '#8b5cf6',
  w49: '#ec4899', w51: '#f59e0b',
};

const CHART_STROKE = '#1e293b';
const GRID_COLOR = 'rgba(255,255,255,0.04)';
const AXIS_STYLE = { fill: '#64748b', fontSize: 11 };

// Pasek sumaryczny
const KpiCard = ({ icon, label, value, sub, color = 'sky' }) => {
  const colors = {
    sky:    { bg: 'bg-sky-500/10',    border: 'border-sky-500/20',    text: 'text-sky-400'    },
    green:  { bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-400'  },
    red:    { bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-400'    },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
  };
  const c = colors[color];
  return (
    <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl border ${c.bg} ${c.border}`}>
      <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
        <span className={c.text}>{icon}</span>
      </div>
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
        <div className={`text-2xl font-black ${c.text}`}>{value}</div>
        {sub && <div className="text-[10px] text-slate-600 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
};

// Tooltip customowy
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-white/10 rounded-xl p-3 shadow-2xl text-xs">
      <p className="font-bold text-white mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="font-bold text-slate-200">{p.value.toLocaleString('pl-PL')}</span>
        </div>
      ))}
    </div>
  );
};

// Które wejścia pokazać w filtrze
const ENTRIES_FOR_CHART = [
  { key: 'w42', label: 'W42 – Tłok', checked: true },
  { key: 'w51', label: 'W51 – Tłok', checked: true },
  { key: 'w40', label: 'W40 – Średnio', checked: true },
  { key: 'w49', label: 'W49 – Średnio', checked: false },
  { key: 'w38', label: 'W38 – Wolno', checked: false },
  { key: 'w45', label: 'W45 – Wolno', checked: false },
];

export const Analytics = () => {
  const [activeEntries, setActiveEntries] = useState(
    ENTRIES_FOR_CHART.filter((e) => e.checked).map((e) => e.key)
  );

  const toggleEntry = (key) => {
    setActiveEntries((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Dane do pie chart – dzisiejsza struktura
  const pieData = BEACH_ENTRIES.map((e) => ({
    name: e.name.replace('Wejście ', 'W'),
    value: e.tourists,
    color: ENTRY_COLORS[e.id],
  }));

  // Totals for daily summary
  const peakHour = HOURLY_DATA.reduce((max, h) => {
    const total = Object.values(h).filter((v) => typeof v === 'number').reduce((s, n) => s + n, 0);
    return total > max.total ? { hour: h.hour, total } : max;
  }, { hour: '', total: 0 });

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Nagłówek sekcji */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Analityka i Raporty</h2>
            <p className="text-[10px] text-slate-500">Podsumowanie dnia · Piątek, 10 Kwietnia 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-white/5">
          <CalendarDays className="w-3.5 h-3.5" />
          Dzisiaj · 08:00 – 23:00
        </div>
      </div>

      {/* Scroll content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-3">
          <KpiCard
            icon={<Users className="w-5 h-5" />}
            label="Turyści na plaży"
            value={STATS.totalTourists.toLocaleString('pl-PL')}
            sub="↑ +12% vs wczoraj"
            color="sky"
          />
          <KpiCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Szczyt frekwencji"
            value={peakHour.hour}
            sub={`${peakHour.total.toLocaleString('pl-PL')} os. łącznie`}
            color="yellow"
          />
          <KpiCard
            icon={<AlertTriangle className="w-5 h-5" />}
            label="Alerty dziś"
            value="7"
            sub="4 krytyczne · 3 warning"
            color="red"
          />
          <KpiCard
            icon={<Award className="w-5 h-5" />}
            label="Wydane nagrody"
            value={STATS.rewardsIssued.toString()}
            sub="propozycje: 143"
            color="green"
          />
        </div>

        {/* Wykresy – 2-kolumnowy layout */}
        <div className="grid grid-cols-3 gap-4">
          {/* GŁÓWNY: Godzinowy rozkład tłumu (Area chart) */}
          <div className="col-span-2 bg-slate-800/50 rounded-2xl border border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Rozkład tłumu – godzinowy</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Liczba turystów przy każdym wejściu, 8:00–20:00</p>
              </div>
              {/* Filtr wejść */}
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {ENTRIES_FOR_CHART.map((e) => (
                  <button
                    key={e.key}
                    onClick={() => toggleEntry(e.key)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                      activeEntries.includes(e.key)
                        ? 'border-white/20 text-slate-200'
                        : 'border-white/5 text-slate-600'
                    }`}
                    style={activeEntries.includes(e.key) ? { backgroundColor: ENTRY_COLORS[e.key] + '22' } : {}}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: activeEntries.includes(e.key) ? ENTRY_COLORS[e.key] : '#334155' }}
                    />
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={HOURLY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  {Object.entries(ENTRY_COLORS).map(([key, color]) => (
                    <linearGradient key={key} id={`grad_${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis dataKey="hour" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {activeEntries.map((key) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={key.replace('w', 'Wejście ')}
                    stroke={ENTRY_COLORS[key]}
                    strokeWidth={2}
                    fill={`url(#grad_${key})`}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart – struktura turystów dzisiaj */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-5">
            <h3 className="text-sm font-bold text-white mb-1">Udział wejść</h3>
            <p className="text-[10px] text-slate-500 mb-4">Aktualny rozkład turystów</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={72}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {pieData.slice(0, 5).map((d) => (
                <div key={d.name} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-slate-400">{d.name}</span>
                  </div>
                  <span className="text-slate-300 font-semibold">{d.value.toLocaleString('pl-PL')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dolny rząd: Tygodniowy bar chart + Zapełnienie koszy */}
        <div className="grid grid-cols-2 gap-4">
          {/* Tygodniowy tłum */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-5">
            <h3 className="text-sm font-bold text-white mb-1">Tłum – ostatnie 7 dni</h3>
            <p className="text-[10px] text-slate-500 mb-4">Łączna liczba turystów + alerty</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={WEEKLY_STATS} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis dataKey="day" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tourists" name="Turyści" fill="#0ea5e9" radius={[4, 4, 0, 0]} opacity={0.85} />
                <Bar dataKey="alerts"   name="Alerty"   fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.75} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Zapełnienie koszy heatbar */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-5">
            <h3 className="text-sm font-bold text-white mb-1">Zapełnienie koszy – dziś</h3>
            <p className="text-[10px] text-slate-500 mb-4">Stan czujników na każdym wejściu</p>
            <div className="space-y-3">
              {BEACH_ENTRIES.map((e) => {
                const pct = e.binOccupancy;
                const color = pct >= 85 ? '#ef4444' : pct >= 60 ? '#eab308' : '#22c55e';
                return (
                  <div key={e.id} className="flex items-center gap-3">
                    <Trash2 className="w-3 h-3 flex-shrink-0" style={{ color }} />
                    <span className="text-[10px] text-slate-400 w-20">{e.name}</span>
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="text-[10px] font-bold w-8 text-right" style={{ color }}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer raportu */}
        <div className="text-center py-3 text-[10px] text-slate-600">
          Dane z modułu IoT DenSea · Ostatnia aktualizacja: just now · Źródła: IMGW, kamery dronów, czujniki plaży
        </div>
      </div>
    </div>
  );
};

export default Analytics;
