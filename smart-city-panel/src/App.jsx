// src/App.jsx
import React from 'react';
import { TopHeader } from './components/TopHeader';
import { Dashboard } from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <TopHeader />
      <Dashboard />
    </div>
  );
}

export default App;
