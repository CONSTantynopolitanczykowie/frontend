// src/ui/DashboardCard.jsx
import React from 'react';

/**
 * Kontener karty dashboardu z glassmorphism efektem.
 * @param {object} props
 * @param {string} props.title
 * @param {React.ReactNode} [props.icon]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.headerRight]
 * @param {'default'|'danger'|'warning'|'success'} [props.variant]
 */
const VARIANT_STYLES = {
  default: 'border-white/8',
  danger: 'border-red-500/30 shadow-red-500/10',
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
        relative rounded-2xl bg-slate-800/60 backdrop-blur-sm
        border ${VARIANT_STYLES[variant]}
        shadow-xl overflow-hidden
        ${className}
      `}
    >
      {/* Subtelna górna krawędź gradientowa */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Header karty */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="p-1.5 rounded-lg bg-slate-700/60">
              {icon}
            </div>
          )}
          <h2 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">
            {title}
          </h2>
        </div>
        {headerRight && (
          <div className="flex-shrink-0">
            {headerRight}
          </div>
        )}
      </div>

      {/* Zawartość */}
      <div className="px-5 pb-5">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
