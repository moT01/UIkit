import React, { useState } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
}

const variantBaseStyles: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: '#1b1b32',
    border: '1px solid #3b3b4f',
  },
  bordered: {
    backgroundColor: '#0a0a23',
    border: '2px solid #3b3b4f',
  },
  elevated: {
    backgroundColor: '#1b1b32',
    border: '1px solid #3b3b4f',
    boxShadow: '0 8px 24px -4px rgba(0,0,0,0.5)',
  },
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', style, children, ...props }, ref) => {
    const [hovered, setHovered] = useState(false);

    const baseStyle: React.CSSProperties = {
      borderRadius: '0.625rem',
      padding: '1.5rem',
      color: '#f5f6f7',
      transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      ...variantBaseStyles[variant],
      ...style,
    };

    if (hovered) {
      baseStyle.borderColor = '#858591';
      if (variant === 'elevated') {
        baseStyle.transform = 'translateY(-3px)';
        baseStyle.boxShadow = '0 12px 32px -4px rgba(0,0,0,0.6)';
      }
    }

    return (
      <div
        ref={ref}
        style={baseStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ style, children, ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
      marginBottom: '1rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #3b3b4f',
      ...style,
    };

    return (
      <div ref={ref} style={baseStyle} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Tag = 'h3', style, children, ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
      margin: 0,
      fontSize: '1.25rem',
      fontWeight: 700,
      color: '#ffffff',
      fontFamily: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      letterSpacing: '-0.01em',
      ...style,
    };

    return (
      <Tag ref={ref as any} style={baseStyle} {...props}>
        {children}
      </Tag>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ style, children, ...props }, ref) => {
    return (
      <div ref={ref} style={{ color: '#d0d0d5', lineHeight: 1.6, ...style }} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';
