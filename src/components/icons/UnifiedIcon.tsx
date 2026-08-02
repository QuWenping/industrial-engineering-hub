'use client';

import React from 'react';

/**
 * UnifiedIcon Component
 * 
 * Renders consistent SVG icons across the homepage
 * Uses a unified design system with consistent stroke and sizing
 */

interface UnifiedIconProps {
  name: 'industrial-building' | 'structural' | 'hvac' | 'chemical' | 'energy' | 'digital' | 
        'battery' | 'chemical-plant' | 'energy-facility' | 'smart-factory' | 'building' | 'infrastructure';
  className?: string;
  size?: number;
}

export function UnifiedIcon({ name, className = '', size = 24 }: UnifiedIconProps) {
  const iconMap: Record<string, React.ReactNode> = {
    // Capabilities
    'industrial-building': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
        <line x1="6" y1="12" x2="18" y2="12"/>
        <rect x="7" y="4" width="2" height="2"/>
        <rect x="15" y="4" width="2" height="2"/>
        <rect x="7" y="14" width="2" height="2"/>
        <rect x="11" y="14" width="2" height="2"/>
        <rect x="15" y="14" width="2" height="2"/>
      </svg>
    ),
    'structural': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="3" x2="21" y2="21"/>
        <line x1="21" y1="3" x2="3" y2="21"/>
        <circle cx="12" cy="12" r="1" fill="currentColor"/>
        <line x1="5" y1="8" x2="19" y2="8"/>
        <line x1="5" y1="16" x2="19" y2="16"/>
      </svg>
    ),
    'hvac': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <circle cx="6" cy="12" r="1" fill="currentColor"/>
        <circle cx="12" cy="12" r="1" fill="currentColor"/>
        <circle cx="18" cy="12" r="1" fill="currentColor"/>
        <path d="M6 9v6M12 9v6M18 9v6"/>
      </svg>
    ),
    'chemical': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v8M8 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
        <path d="M16 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
        <path d="M12 14v6"/>
        <path d="M10 20h4"/>
      </svg>
    ),
    'energy': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    'digital': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3"/>
        <polyline points="12 12 20 7.5"/>
        <polyline points="12 12 12 21"/>
        <polyline points="12 12 4 7.5"/>
      </svg>
    ),
    'battery': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="16" height="14" rx="2"/>
        <line x1="19" y1="8" x2="21" y2="8"/>
        <line x1="19" y1="16" x2="21" y2="16"/>
        <rect x="5" y="7" width="3" height="10" fill="currentColor"/>
        <rect x="10" y="7" width="3" height="10" fill="currentColor"/>
      </svg>
    ),
    'chemical-plant': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 4v14a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V4"/>
        <rect x="7" y="2" width="10" height="2"/>
        <circle cx="7" cy="17" r="1" fill="currentColor"/>
        <circle cx="17" cy="17" r="1" fill="currentColor"/>
      </svg>
    ),
    'energy-facility': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    'smart-factory': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="12" rx="2"/>
        <line x1="9" y1="16" x2="15" y2="16"/>
        <circle cx="6" cy="10" r="1" fill="currentColor"/>
        <circle cx="12" cy="10" r="1" fill="currentColor"/>
        <circle cx="18" cy="10" r="1" fill="currentColor"/>
      </svg>
    ),
    'building': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="8" y1="6" x2="8" y2="18"/>
        <line x1="12" y1="6" x2="12" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="18"/>
        <line x1="4" y1="10" x2="20" y2="10"/>
        <line x1="4" y1="14" x2="20" y2="14"/>
      </svg>
    ),
    'infrastructure': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h5v8H3zM10 12h4v8h-4zM16 12h5v8h-5z"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <path d="M6 4v8M12 6v6M18 5v7"/>
      </svg>
    ),
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {iconMap[name]}
    </div>
  );
}

export default UnifiedIcon;
