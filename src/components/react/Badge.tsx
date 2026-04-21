import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    backgroundColor: '#3b3b4f',
    color: '#d0d0d5',
  },
  success: {
    backgroundColor: '#00471b',
    color: '#acd157',
  },
  warning: {
    backgroundColor: '#4d3800',
    color: '#f1be32',
  },
  danger: {
    backgroundColor: '#850000',
    color: '#ffadad',
  },
  info: {
    backgroundColor: '#002ead',
    color: '#99c9ff',
  },
  accent: {
    backgroundColor: '#5a01a7',
    color: '#dbb8ff',
  },
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', style, children, ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.625rem',
      fontSize: '0.6875rem',
      fontWeight: 700,
      fontFamily: "'JetBrains Mono', 'Fira Mono', Menlo, Consolas, monospace",
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      borderRadius: '9999px',
      lineHeight: 1,
      transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      ...variantStyles[variant],
      ...style,
    };

    return (
      <span ref={ref} style={baseStyle} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
