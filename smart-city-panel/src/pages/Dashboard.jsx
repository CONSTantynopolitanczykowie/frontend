// src/pages/Dashboard.jsx
import React from 'react';
import { MapWidget } from '../components/MapWidget';
import { LiveAlerts } from '../components/LiveAlerts';
import { PredictionWidget } from '../components/PredictionWidget';

export const Dashboard = () => {
  return (
    <main className="flex-1 overflow-hidden">
      {/* Siatka 3-kolumnowa */}
      <div
        className="h-full grid gap-4 p-4"
        style={{
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
        }}
      >
        {/* Lewa kolumna – Mapa (zajmuje obie wiersze) */}
        <div className="row-span-2 overflow-y-auto">
          <MapWidget />
        </div>

        {/* Prawa kolumna góra – Alerty */}
        <div className="overflow-y-auto">
          <LiveAlerts />
        </div>

        {/* Prawa kolumna dół – Prognoza AI */}
        <div className="overflow-y-auto">
          <PredictionWidget />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
