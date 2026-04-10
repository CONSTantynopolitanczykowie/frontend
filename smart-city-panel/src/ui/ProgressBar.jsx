// src/ui/ProgressBar.jsx
import React from 'react';

/**
 * Pasek postępu z kolorem zależnym od wartości.
 * @param {{ value: number, max?: number, label?: string, showValue?: boolean, size?: 'sm'|'md'|'lg', className?: string }} props
 */
export const ProgressBar = ({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getColor = (pct) => {
    if (pct >= 85) return 'bg-red-500 shadow-red-500/40';
    if (pct >= 60) return 'bg-yellow-500 shadow-yellow-500/40';
    return 'bg-green-500 shadow-green-500/40';
  };

  const getTrack = (pct) => {
    if (pct >= 85) return 'bg-red-950/60';
    if (pct >= 60) return 'bg-yellow-950/60';
    return 'bg-green-950/60';
  };

  const heightMap = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-xs text-slate-400 font-medium">{label}</span>
          )}
          {showValue && (
            <span
              className={`text-xs font-bold ml-auto ${
                percentage >= 85
                  ? 'text-red-400'
                  : percentage >= 60
                  ? 'text-yellow-400'
                  : 'text-green-400'
              }`}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full rounded-full overflow-hidden ${heightMap[size]} ${getTrack(percentage)}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${getColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
