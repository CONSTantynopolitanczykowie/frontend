// src/components/TopHeader.jsx
import React, { useState, useEffect } from 'react';
import { Waves, Users, Gift, Activity, Radio, LayoutDashboard, BarChart2 } from 'lucide-react';
import { STATS } from '../data/mockData';

export const TopHeader = ({ activePage, onPageChange }) => {
  const [time, setTime] = useState(new Date());
  const [count, setCount] = useState(STATS.totalTourists);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const sim = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 3 - 1));
    }, 3000);
    return () => clearInterval(sim);
  }, []);

  const formattedTime = time.toLocaleTimeString('pl-PL', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const formattedDate = time.toLocaleDateString('pl-PL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-slate-900/95 backdrop-blur-sm border-b border-white/5 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <Waves className="w-4 h-4 text-white" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-slate-900 animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-white leading-none">
            Den<span className="text-sky-400">Sea</span>
          </h1>
          <p className="text-[10px] text-slate-500 leading-none mt-0.5">Smart City Control Panel</p>
        </div>
      </div>

      {/* Nawigacja stron */}
      <nav className="flex items-center gap-1 bg-slate-800/60 rounded-xl p-1 border border-white/5">
        <NavTab
          active={activePage === 'live'}
          onClick={() => onPageChange('live')}
          icon={<LayoutDashboard className="w-3.5 h-3.5" />}
          label="Live Dashboard"
        />
        <NavTab
          active={activePage === 'analytics'}
          onClick={() => onPageChange('analytics')}
          icon={<BarChart2 className="w-3.5 h-3.5" />}
          label="Analityka"
        />
      </nav>

      {/* Stats */}
      <div className="hidden lg:flex items-center gap-5">
        <StatChip
          icon={<Users className="w-3.5 h-3.5 text-sky-400" />}
          label="Turyści na plaży"
          value={count.toLocaleString('pl-PL')}
          highlight
        />
        <StatChip
          icon={<Activity className="w-3.5 h-3.5 text-green-400" />}
          label="Aktywne propozycje"
          value={STATS.activeProposals.toString()}
        />
        <StatChip
          icon={<Gift className="w-3.5 h-3.5 text-yellow-400" />}
          label="Wydane nagrody"
          value={STATS.rewardsIssued.toString()}
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <Radio className="w-3 h-3 text-green-400 animate-pulse" />
          <span className="text-xs font-semibold text-green-400">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Zegar */}
      <div className="text-right">
        <div className="text-xl font-mono font-bold text-white tracking-widest tabular-nums">
          {formattedTime}
        </div>
        <div className="text-[10px] text-slate-500 capitalize mt-0.5">{formattedDate}</div>
      </div>
    </header>
  );
};

const NavTab = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
      ${active
        ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'}
    `}
  >
    {icon}
    {label}
  </button>
);

const StatChip = ({ icon, label, value, highlight = false }) => (
  <div className="flex items-center gap-2">
    {icon}
    <div>
      <div className="text-[9px] text-slate-500 uppercase tracking-wider leading-none">{label}</div>
      <div className={`text-sm font-bold leading-tight ${highlight ? 'text-sky-400' : 'text-slate-200'}`}>
        {value}
      </div>
    </div>
  </div>
);

export default TopHeader;
