// src/components/PredictionWidget.jsx
import React, { useState } from 'react';
import {
  Brain,
  Wind,
  Thermometer,
  Umbrella,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { PREDICTION } from '../data/mockData';
import { DashboardCard } from '../ui/DashboardCard';

const PARASOL_LABELS = {
  low: { label: 'Niskie', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  medium: { label: 'Umiarkowane', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  high: { label: 'Wysokie', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  extreme: { label: 'EKSTREMALNE', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

const WindIndicator = ({ speed, direction }) => {
  const getStrength = (s) => {
    if (s >= 25) return { label: 'Silny', color: 'text-red-400', bars: 4 };
    if (s >= 15) return { label: 'Umiarkowany', color: 'text-yellow-400', bars: 3 };
    if (s >= 8)  return { label: 'Łagodny', color: 'text-sky-400', bars: 2 };
    return { label: 'Słaby', color: 'text-green-400', bars: 1 };
  };

  const { label, color, bars } = getStrength(speed);

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-full bg-slate-700/60 flex items-center justify-center">
        <Wind className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className={`text-xl font-black ${color}`}>{speed}</span>
          <span className="text-xs text-slate-500">km/h</span>
          <span className="text-xs text-slate-500 ml-1">{direction}</span>
        </div>
        <div className="flex items-center gap-0.5 mt-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-3 rounded-full transition-colors ${i < bars ? color : 'bg-slate-700'}`}
            />
          ))}
          <span className={`text-[10px] ml-1.5 font-semibold ${color}`}>{label}</span>
        </div>
      </div>
    </div>
  );
};

const RecommendationItem = ({ text, index }) => {
  const [done, setDone] = useState(false);

  return (
    <button
      onClick={() => setDone(!done)}
      className={`
        w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left
        transition-all duration-200 border
        ${done
          ? 'bg-green-500/8 border-green-500/15 opacity-60'
          : 'bg-slate-800/60 border-white/5 hover:bg-slate-700/60 hover:border-white/8'
        }
      `}
    >
      <div className={`
        flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5
        ${done ? 'bg-green-500 border-green-500' : 'border-slate-600'}
      `}>
        {done && <CheckCircle2 className="w-3 h-3 text-white" />}
      </div>
      <span className={`text-xs leading-relaxed ${done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
        {text}
      </span>
    </button>
  );
};

export const PredictionWidget = () => {
  const [expanded, setExpanded] = useState(true);
  const pred = PREDICTION;
  const parasol = PARASOL_LABELS[pred.parasol_effect];

  return (
    <DashboardCard
      title="Prognoza AI – Jutro"
      icon={<Brain className="w-4 h-4 text-purple-400" />}
      variant="warning"
      headerRight={
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/60 transition-all"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      }
    >
      {/* Nagłówek prognozy – zawsze widoczny */}
      <div className="flex items-center gap-4 mb-4">
        {/* Temperatura */}
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-orange-400" />
          <div>
            <span className="text-3xl font-black text-white">{pred.temp}°</span>
            <span className="text-slate-400 text-sm ml-1">C</span>
          </div>
        </div>

        <div className="w-px h-10 bg-slate-700" />

        {/* Wiatr */}
        <WindIndicator speed={pred.wind} direction={pred.windDir} />

        <div className="ml-auto text-right">
          <div className="text-xs text-slate-500">Warunki</div>
          <div className="text-xs font-semibold text-slate-300 mt-0.5">{pred.condition}</div>
        </div>
      </div>

      {/* Alert efektu parawanów */}
      <div className={`
        rounded-xl p-3.5 border mb-4
        ${parasol.bg} ${parasol.border}
      `}>
        <div className="flex items-center gap-2 mb-1.5">
          <Umbrella className={`w-4 h-4 ${parasol.color}`} />
          <span className={`text-xs font-bold uppercase tracking-wide ${parasol.color}`}>
            UWAGA: Efekt Parawanów – {parasol.label}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <TrendingDown className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-slate-200">
            Przewidywany spadek dostępnego miejsca o{' '}
            <span className="font-black text-red-400">{pred.predicted_drop}%</span>.
            {' '}Silny wiatr ({pred.wind} km/h) sprzyja rozstawianiu parawanów.
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full"
              style={{ width: `${pred.predicted_drop + 40}%` }}
            />
          </div>
          <span className="text-xs text-slate-400">
            ~{pred.total_expected.toLocaleString('pl-PL')} turystów
          </span>
        </div>
      </div>

      {/* Rekomendacje */}
      {expanded && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Rekomendowane działania AI
            </span>
          </div>
          <div className="space-y-1.5">
            {pred.recommendations.map((rec, i) => (
              <RecommendationItem key={i} text={rec} index={i} />
            ))}
          </div>
          <p className="text-[10px] text-slate-600 mt-3 italic text-center">
            Model: DenSea-AI v2.1 · Trafność prognoz: 89% · Dane: IMGW, IoT sensorzy
          </p>
        </div>
      )}
    </DashboardCard>
  );
};

export default PredictionWidget;
