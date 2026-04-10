// src/ui/AlertBadge.jsx
import React from 'react';

const SEVERITY_CONFIG = {
  critical: {
    bg: 'bg-red-500/15',
    border: 'border-red-500/40',
    text: 'text-red-400',
    dot: 'bg-red-500',
    label: 'Krytyczny',
    pulse: true,
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    dot: 'bg-yellow-500',
    label: 'Ostrzeżenie',
    pulse: false,
  },
  info: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    dot: 'bg-sky-500',
    label: 'Informacja',
    pulse: false,
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    dot: 'bg-green-500',
    label: 'OK',
    pulse: false,
  },
};

/**
 * Kolorowa etykieta alertu z opcjonalną animacją pulse.
 * @param {{ severity: 'critical'|'warning'|'info'|'success', label?: string, className?: string }} props
 */
export const AlertBadge = ({ severity = 'info', label, className = '' }) => {
  const config = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.info;
  const displayLabel = label ?? config.label;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-xs font-bold border
        ${config.bg} ${config.border} ${config.text}
        ${className}
      `}
    >
      <span
        className={`
          w-1.5 h-1.5 rounded-full flex-shrink-0
          ${config.dot}
          ${config.pulse ? 'animate-pulse' : ''}
        `}
      />
      {displayLabel}
    </span>
  );
};

export default AlertBadge;
