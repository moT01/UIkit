import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const helperId = `${inputId}-helper`;

    const wrapperStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      width: '100%',
    };

    const checkboxStyle: React.CSSProperties = {
      width: '1.25rem',
      height: '1.25rem',
      minWidth: '1.25rem',
      marginTop: '0.125rem',
      accentColor: '#f1be32',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
    };

    const labelStyle: React.CSSProperties = {
      fontFamily: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: '1rem',
      color: '#f5f6f7',
      lineHeight: 1.5,
      cursor: props.disabled ? 'not-allowed' : 'pointer',
    };

    const helperStyle: React.CSSProperties = {
      fontSize: '0.875rem',
      color: error ? '#ffadad' : '#858591',
      fontFamily: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      marginTop: '0.25rem',
    };

    return (
      <div style={wrapperStyle}>
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          style={checkboxStyle}
          aria-describedby={error || helperText ? helperId : undefined}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        <div>
          {label && (
            <label htmlFor={inputId} style={labelStyle}>
              {label}
            </label>
          )}
          {(error || helperText) && (
            <div id={helperId} style={helperStyle}>{error || helperText}</div>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
