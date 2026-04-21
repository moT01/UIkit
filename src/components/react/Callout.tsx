import React from 'react';

export type CalloutVariant = 'tip' | 'note' | 'warning' | 'caution';

export interface CalloutProps {
  children: React.ReactNode;
  variant: CalloutVariant;
  label: string;
  className?: string;
}

const variantStyles: Record<CalloutVariant, { border: string; icon: string; labelColor: string }> = {
  tip: {
    border: 'border-l-4 border-l-green-700',
    icon: 'text-green-800',
    labelColor: 'text-green-800',
  },
  note: {
    border: 'border-l-4 border-l-blue-700',
    icon: 'text-blue-800',
    labelColor: 'text-blue-800',
  },
  warning: {
    border: 'border-l-4 border-l-yellow-700',
    icon: 'text-yellow-800',
    labelColor: 'text-yellow-800',
  },
  caution: {
    border: 'border-l-4 border-l-red-700',
    icon: 'text-red-900',
    labelColor: 'text-red-900',
  },
};

const variantIcons: Record<CalloutVariant, React.ReactNode> = {
  tip: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  note: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  caution: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
};

export const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ children, variant, label, className = '' }, ref) => {
    const styles = variantStyles[variant];

    return (
      <div
        ref={ref}
        className={`p-4 mb-6 border-l-4 break-words bg-opacity-5 ${styles.border} ${className}`}
        style={{
          backgroundColor:
            variant === 'tip' ? 'rgba(172, 209, 87, 0.05)' :
            variant === 'note' ? 'rgba(153, 201, 255, 0.05)' :
            variant === 'warning' ? 'rgba(241, 190, 50, 0.05)' :
            'rgba(255, 173, 173, 0.05)',
        }}
      >
        <div className="flex items-start gap-2 mb-2">
          <span className={`mt-0.5 ${styles.icon}`} aria-hidden="true">
            {variantIcons[variant]}
          </span>
          <strong className={styles.labelColor}>{label}</strong>
        </div>
        <div className="text-sm text-[var(--fcc-gray-15)]">{children}</div>
      </div>
    );
  }
);

Callout.displayName = 'Callout';
