// src/components/LiveAlerts.jsx
import React, { useState } from 'react';
import { AlertTriangle, Bell, CheckCircle, Send, Siren, X } from 'lucide-react';
import { LIVE_ALERTS } from '../data/mockData';
import { DashboardCard } from '../ui/DashboardCard';
import { AlertBadge } from '../ui/AlertBadge';

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2, success: 3 };

const AlertRow = ({ alert, onDismiss, onAction }) => {
  const [dispatched, setDispatched] = useState(false);

  const handleAction = () => {
    setDispatched(true);
    onAction?.(alert.id);
  };

  const isCritical = alert.severity === 'critical';

  return (
    <div
      className={`
        relative rounded-xl p-4 border transition-all duration-300
        ${isCritical
          ? 'bg-red-950/30 border-red-500/30'
          : alert.severity === 'warning'
          ? 'bg-yellow-950/20 border-yellow-500/20'
          : 'bg-slate-800/40 border-white/5'
        }
      `}
    >
      {/* Migające tło dla krytycznych */}
      {isCritical && !dispatched && (
        <div className="absolute inset-0 rounded-xl bg-red-500/5 animate-blink pointer-events-none" />
      )}

      <div className="relative flex items-start gap-3">
        {/* Ikona */}
        <div className={`
          flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg
          ${isCritical ? 'bg-red-500/20' : alert.severity === 'warning' ? 'bg-yellow-500/15' : 'bg-slate-700/60'}
        `}>
          {alert.icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Nagłówek */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <AlertBadge severity={alert.severity} />
            <span className="text-[10px] text-slate-500">{alert.time}</span>
            {alert.entry && (
              <span className="text-[10px] text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded">
                {alert.entry.replace('w', 'W')}
              </span>
            )}
          </div>

          {/* Tytuł */}
          <p className={`text-sm font-bold mb-1 ${isCritical ? 'text-red-300' : 'text-slate-200'}`}>
            {alert.title}
          </p>

          {/* Treść */}
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            {alert.message}
          </p>

          {/* Przyciski */}
          <div className="flex items-center gap-2">
            {!dispatched ? (
              <button
                onClick={handleAction}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                  transition-all duration-200 active:scale-95
                  ${isCritical
                    ? 'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/30'
                    : alert.severity === 'warning'
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-900'
                    : 'bg-slate-600 hover:bg-slate-500 text-white'
                  }
                `}
              >
                <Send className="w-3 h-3" />
                {alert.actionLabel}
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/15 border border-green-500/20">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-xs font-bold text-green-400">Dysponowany</span>
              </div>
            )}

            <button
              onClick={() => onDismiss?.(alert.id)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-slate-700/60 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LiveAlerts = () => {
  const [alerts, setAlerts] = useState(
    [...LIVE_ALERTS].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
  );

  const handleDismiss = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;

  return (
    <DashboardCard
      title="Alerty na Żywo"
      icon={
        criticalCount > 0
          ? <Siren className="w-4 h-4 text-red-400 animate-pulse" />
          : <Bell className="w-4 h-4 text-yellow-400" />
      }
      variant={criticalCount > 0 ? 'danger' : 'default'}
      headerRight={
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/15 border border-red-500/20 px-2 py-1 rounded-full animate-pulse">
              ● {criticalCount} KRYTYCZNE
            </span>
          )}
          <span className="text-xs text-slate-500 bg-slate-700/60 px-2 py-1 rounded-full">
            {alerts.length} aktywne
          </span>
        </div>
      }
    >
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center py-8 gap-3">
          <CheckCircle className="w-10 h-10 text-green-500/40" />
          <p className="text-sm text-slate-500">Brak aktywnych alertów</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

export default LiveAlerts;
