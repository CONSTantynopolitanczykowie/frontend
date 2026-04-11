// src/components/BroadcastPanel.jsx – Nadawanie komunikatów kryzysowych
import React, { useState } from 'react';
import { X, Megaphone, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { BEACH_ENTRIES, BROADCAST_TYPES } from '../data/mockData';

export const BroadcastPanel = ({ onClose, onBroadcastSent }) => {
  const [selectedEntry, setSelectedEntry] = useState('all');
  const [selectedType, setSelectedType] = useState(null);
  const [customMsg, setCustomMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!selectedType) return;
    setSent(true);
    const broadcastType = BROADCAST_TYPES.find((t) => t.id === selectedType);
    const entryName = selectedEntry === 'all'
      ? 'Wszystkie wejścia'
      : BEACH_ENTRIES.find((e) => e.id === selectedEntry)?.name;

    if (onBroadcastSent) {
      onBroadcastSent({
        id: `broadcast_${Date.now()}`,
        severity: broadcastType.severity,
        title: `${broadcastType.icon} ${broadcastType.label}`,
        message: customMsg || `Komunikat administratora dla: ${entryName}`,
        entry: selectedEntry === 'all' ? null : selectedEntry,
        time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        icon: broadcastType.icon,
        actionLabel: 'Szczegóły',
        source: 'admin',
      });
    }

    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-slate-800 rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
        {/* Nagłówek */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Nadaj Komunikat Kryzysowy</h2>
              <p className="text-xs text-slate-400">Komunikat trafi do aplikacji turystów</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          /* Ekran potwierdzenia */
          <div className="p-10 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-lg font-bold text-white">Komunikat wysłany!</p>
            <p className="text-sm text-slate-400 text-center">
              Powiadomienie zostało przekazane do wszystkich aktywnych turystów w aplikacji.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Wybór wejścia */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Dotyczy wejścia
              </label>
              <div className="relative">
                <select
                  value={selectedEntry}
                  onChange={(e) => setSelectedEntry(e.target.value)}
                  className="w-full bg-slate-700/60 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 cursor-pointer"
                >
                  <option value="all">Wszystkie wejścia</option>
                  {BEACH_ENTRIES.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Typ komunikatu */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Typ komunikatu
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BROADCAST_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`
                      flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-xs font-medium transition-all
                      ${selectedType === type.id
                        ? type.severity === 'critical'
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : type.severity === 'warning'
                          ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                          : 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                        : 'bg-slate-700/40 border-white/5 text-slate-300 hover:bg-slate-700/60 hover:border-white/10'
                      }
                    `}
                  >
                    <span className="text-base leading-none">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Opcjonalna treść */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Dodatkowa treść (opcjonalnie)
              </label>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="np. Prosimy o natychmiastowe opuszczenie wody..."
                rows={3}
                className="w-full bg-slate-700/60 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-sky-500/50"
              />
            </div>

            {/* Przycisk wysłania */}
            <button
              onClick={handleSend}
              disabled={!selectedType}
              className={`
                w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all
                ${selectedType
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                  : 'bg-slate-700/60 text-slate-500 cursor-not-allowed'}
              `}
            >
              <Send className="w-4 h-4" />
              Wyślij komunikat do turystów
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BroadcastPanel;
