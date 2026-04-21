import React, { useState } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: TooltipPosition;
}

const positionStyles: Record<TooltipPosition, React.CSSProperties> = {
  top: {
    bottom: 'calc(100% + 0.5rem)',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  bottom: {
    top: 'calc(100% + 0.5rem)',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  left: {
    right: 'calc(100% + 0.5rem)',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  right: {
    left: 'calc(100% + 0.5rem)',
    top: '50%',
    transform: 'translateY(-50%)',
  },
};

export const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top' }) => {
  const [visible, setVisible] = useState(false);

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
  };

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    padding: '0.375rem 0.75rem',
    fontSize: '0.8125rem',
    fontFamily: "'JetBrains Mono', 'Fira Mono', Menlo, Consolas, monospace",
    fontWeight: 500,
    color: '#0a0a23',
    backgroundColor: '#f5f6f7',
    borderRadius: '0.375rem',
    whiteSpace: 'nowrap',
    zIndex: 1000,
    pointerEvents: 'none',
    opacity: visible ? 1 : 0,
    transform: `${positionStyles[position].transform || ''} translateY(${visible ? 0 : position === 'top' ? '-4px' : position === 'bottom' ? '4px' : '0'})`,
    transition: 'opacity 150ms ease, transform 150ms ease',
    ...positionStyles[position],
  };

  return (
    <span
      style={wrapperStyle}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      <span role="tooltip" style={tooltipStyle}>
        {content}
      </span>
    </span>
  );
};
