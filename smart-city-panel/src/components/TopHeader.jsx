// src/components/TopHeader.jsx
import React, { useState, useEffect } from 'react';
import { Waves, Users, Radio, Shield, Activity } from 'lucide-react';
import { STATS } from '../data/mockData';

export const TopHeader = () => {
  const [time, setTime] = useState(new Date());
  const [count, setCount] = useState(STATS.totalTourists);

  // Żywy zegar
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Animowany licznik turystów (symulacja live)
  useEffect(() => {
    const sim = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 3 - 1));
    }, 3000);
    return () => clearInterval(sim);
  }, []);

  const formattedTime = time.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = time.toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-sm border-b border-white/5 z-50">
      {/* Logo i nazwa */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white">
            Den<span className="text-sky-400">Sea</span>
          </h1>
          <p className="text-xs text-slate-500 leading-none">Smart City Control Panel</p>
        </div>
      </div>

      {/* Stats środkowe */}
      <div className="hidden md:flex items-center gap-6">
        <StatChip
          icon={<Users className="w-4 h-4 text-sky-400" />}
          label="Turyści dziś"
          value={count.toLocaleString('pl-PL')}
          highlight
        />
        <StatChip
          icon={<Activity className="w-4 h-4 text-green-400" />}
          label="Aktywne nudges"
          value={STATS.activeNudges.toString()}
        />
        <StatChip
          icon={<Shield className="w-4 h-4 text-yellow-400" />}
          label="Wydane nagrody"
          value={STATS.rewardsIssued.toString()}
        />

        {/* Status systemu */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <Radio className="w-3.5 h-3.5 text-green-400 animate-pulse" />
          <span className="text-xs font-semibold text-green-400">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Zegar */}
      <div className="text-right">
        <div className="text-2xl font-mono font-bold text-white tracking-widest tabular-nums">
          {formattedTime}
        </div>
        <div className="text-xs text-slate-500 capitalize mt-0.5">{formattedDate}</div>
      </div>
    </header>
  );
};

const StatChip = ({ icon, label, value, highlight = false }) => (
  <div className="flex items-center gap-2">
    {icon}
    <div>
      <div className="text-[10px] text-slate-500 uppercase tracking-wider leading-none">{label}</div>
      <div className={`text-base font-bold leading-tight ${highlight ? 'text-sky-400' : 'text-slate-200'}`}>
        {value}
      </div>
    </div>
  </div>
);

export default TopHeader;
