import React from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
}

const variantStyles: Record<AlertVariant, { border: string; bg: string; icon: string; iconBg: string }> = {
  info: {
    border: '#002ead',
    bg: 'rgba(0, 46, 173, 0.12)',
    icon: '#99c9ff',
    iconBg: 'rgba(0, 46, 173, 0.2)',
  },
  success: {
    border: '#00471b',
    bg: 'rgba(0, 71, 27, 0.12)',
    icon: '#acd157',
    iconBg: 'rgba(0, 71, 27, 0.2)',
  },
  warning: {
    border: '#4d3800',
    bg: 'rgba(77, 56, 0, 0.12)',
    icon: '#f1be32',
    iconBg: 'rgba(77, 56, 0, 0.2)',
  },
  danger: {
    border: '#850000',
    bg: 'rgba(133, 0, 0, 0.12)',
    icon: '#ffadad',
    iconBg: 'rgba(133, 0, 0, 0.2)',
  },
};

const icons: Record<AlertVariant, string> = {
  info: 'ⓘ',
  success: '✓',
  warning: '⚠',
  danger: '✕',
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, style, children, ...props }, ref) => {
    const styles = variantStyles[variant];

    const baseStyle: React.CSSProperties = {
      display: 'flex',
      gap: '0.875rem',
      padding: '1rem 1.25rem',
      backgroundColor: styles.bg,
      border: `1px solid ${styles.border}`,
      borderRadius: '0.625rem',
      color: '#f5f6f7',
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      ...style,
    };

    return (
      <div ref={ref} style={baseStyle} role="alert" {...props}>
        <span
          style={{
            flexShrink: 0,
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            fontSize: '0.875rem',
            lineHeight: 1,
            color: styles.icon,
            backgroundColor: styles.iconBg,
            marginTop: '0.125rem',
          }}
          aria-hidden="true"
        >
          {icons[variant]}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && (
            <h3
              style={{
                margin: '0 0 0.25rem',
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: '#ffffff',
                fontFamily: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </h3>
          )}
          <div style={{ color: '#d0d0d5', lineHeight: 1.6, fontSize: '0.9375rem' }}>{children}</div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
