import React, { useState } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: '#f1be32',
    color: '#0a0a23',
    border: '1px solid #f1be32',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: '#dfdfe2',
    border: '1px solid #3b3b4f',
  },
  danger: {
    backgroundColor: '#ffadad',
    color: '#850000',
    border: '1px solid #ffadad',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#dfdfe2',
    border: '1px solid transparent',
  },
  link: {
    backgroundColor: 'transparent',
    color: '#99c9ff',
    border: '1px solid transparent',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' },
  md: { padding: '0.5rem 1rem', fontSize: '1rem' },
  lg: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, disabled, children, style, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const [hovered, setHovered] = useState(false);

    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontFamily: "'JetBrains Mono', 'Fira Mono', Menlo, Consolas, monospace",
      fontWeight: 700,
      borderRadius: '0.375rem',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled || isLoading ? 0.5 : 1,
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...style,
    };

    // Hover effects
    if (hovered && !disabled && !isLoading) {
      if (variant === 'primary') {
        baseStyle.filter = 'brightness(1.1)';
        baseStyle.boxShadow = '0 0 20px rgba(241, 190, 50, 0.25)';
        baseStyle.transform = 'translateY(-1px)';
      } else if (variant === 'secondary') {
        baseStyle.borderColor = '#858591';
        baseStyle.backgroundColor = 'rgba(27, 27, 50, 0.5)';
      } else if (variant === 'danger') {
        baseStyle.filter = 'brightness(1.05)';
      } else if (variant === 'ghost') {
        baseStyle.backgroundColor = '#1b1b32';
      } else if (variant === 'link') {
        baseStyle.textDecorationThickness = '2px';
      }
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={baseStyle}
        aria-busy={isLoading ? 'true' : undefined}
        aria-live={isLoading ? 'polite' : undefined}
        onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e); }}
        onMouseLeave={(e) => { setHovered(false); onMouseLeave?.(e); }}
        {...props}
      >
        {isLoading && (
          <span
            style={{
              display: 'inline-block',
              width: '1em',
              height: '1em',
              border: '2px solid currentColor',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
