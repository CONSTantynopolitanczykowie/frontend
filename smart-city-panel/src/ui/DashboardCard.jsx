// src/ui/DashboardCard.jsx
import React from 'react';

const VARIANT_STYLES = {
  default: 'border-white/8',
  danger:  'border-red-500/30 shadow-red-500/10',
  warning: 'border-yellow-500/30 shadow-yellow-500/10',
  success: 'border-green-500/30 shadow-green-500/10',
};

export const DashboardCard = ({
  title,
  icon,
  children,
  className = '',
  headerRight,
  variant = 'default',
}) => {
  return (
    <div
      className={`
        relative flex flex-col rounded-2xl bg-slate-800/60 backdrop-blur-sm
        border ${VARIANT_STYLES[variant]}
        shadow-xl overflow-hidden h-full
        ${className}
      `}
    >
      {/* Subtelna górna krawędź */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-white/4">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="p-1.5 rounded-lg bg-slate-700/60">{icon}</div>
          )}
          <h2 className="text-xs font-semibold text-slate-300 tracking-widest uppercase">
            {title}
          </h2>
        </div>
        {headerRight && <div className="flex-shrink-0">{headerRight}</div>}
      </div>

      {/* Zawartość – flex-1 żeby wypełniała dostępną przestrzeń */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
