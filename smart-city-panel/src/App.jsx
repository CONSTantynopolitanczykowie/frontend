// src/App.jsx – z nawigacją między Live i Analityką
import React, { useState } from 'react';
import { TopHeader } from './components/TopHeader';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import './index.css';

function App() {
  const [activePage, setActivePage] = useState('live'); // 'live' | 'analytics'

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      <TopHeader activePage={activePage} onPageChange={setActivePage} />
      <div className="flex-1 min-h-0 overflow-hidden">
        {activePage === 'live'      ? <Dashboard /> : <Analytics />}
      </div>
    </div>
  );
}

export default App;
