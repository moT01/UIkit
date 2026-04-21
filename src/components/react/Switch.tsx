import React, { useState } from 'react';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, id, checked, onChange, disabled, ...props }, ref) => {
    const inputId = id || React.useId();
    const [isChecked, setIsChecked] = useState(checked || false);

    const wrapperStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
    };

    const trackStyle: React.CSSProperties = {
      position: 'relative',
      width: '2.75rem',
      height: '1.5rem',
      backgroundColor: (checked !== undefined ? checked : isChecked) ? '#f1be32' : '#3b3b4f',
      borderRadius: '9999px',
      transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      flexShrink: 0,
    };

    const thumbStyle: React.CSSProperties = {
      position: 'absolute',
      top: '0.1875rem',
      left: (checked !== undefined ? checked : isChecked) ? '1.4375rem' : '0.1875rem',
      width: '1.125rem',
      height: '1.125rem',
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      transition: 'left 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    };

    const labelStyle: React.CSSProperties = {
      fontFamily: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: '1rem',
      color: disabled ? '#858591' : '#f5f6f7',
      userSelect: 'none',
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setIsChecked(e.target.checked);
      }
      onChange?.(e);
    };

    return (
      <label style={wrapperStyle} htmlFor={inputId}>
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          role="switch"
          aria-checked={checked !== undefined ? checked : isChecked}
          checked={checked !== undefined ? checked : isChecked}
          onChange={handleChange}
          disabled={disabled}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
          {...props}
        />
        <span style={trackStyle} aria-hidden="true">
          <span style={thumbStyle} />
        </span>
        {label && <span style={labelStyle}>{label}</span>}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
