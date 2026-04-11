// src/pages/Dashboard.jsx – naprawiony layout bez pustych dziur
import React, { useState } from 'react';
import { MapWidget } from '../components/MapWidget';
import { LiveAlerts } from '../components/LiveAlerts';
import { PredictionWidget } from '../components/PredictionWidget';
import { BroadcastPanel } from '../components/BroadcastPanel';

export const Dashboard = () => {
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  return (
    <main className="h-full flex gap-0 overflow-hidden">
      {/* LEWA KOLUMNA – Mapa (wypełnia pełną wysokość) */}
      <div className="flex-1 min-w-0 flex flex-col p-3 gap-3 overflow-hidden">
        {/* Mapa zajmuje cały dostępny obszar */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <MapWidget />
        </div>
      </div>

      {/* PRAWA KOLUMNA – Alerty + Predykcja + Broadcast */}
      <div className="w-[420px] flex-shrink-0 flex flex-col gap-3 p-3 overflow-hidden">
        {/* Alerty – górna część, scrollowalna wewnątrz */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <LiveAlerts onOpenBroadcast={() => setBroadcastOpen(true)} />
        </div>

        {/* Predykcja – dolna część, scrollowalna wewnątrz */}
        <div className="flex-[0.85] min-h-0 overflow-hidden">
          <PredictionWidget />
        </div>
      </div>

      {/* Modal nadawania komunikatów */}
      {broadcastOpen && (
        <BroadcastPanel onClose={() => setBroadcastOpen(false)} />
      )}
    </main>
  );
};

export default Dashboard;
