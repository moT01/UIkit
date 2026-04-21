import React, { forwardRef, useContext } from 'react';
import { FormContext } from './FormGroup';

export const HelpBlock = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ children, className = '', ...props }, ref) => {
    const { validationState } = useContext(FormContext);

    const validationColors = {
      success: 'text-[var(--fcc-green-light)]',
      warning: 'text-[var(--fcc-yellow-light)]',
      error: 'text-[var(--fcc-red-light)]',
    };

    const colorClass = validationState ? validationColors[validationState] : 'text-[var(--fcc-muted-color)]';

    return (
      <span ref={ref} className={`block mt-1 text-sm ${colorClass} ${className}`} {...props}>
        {children}
      </span>
    );
  }
);

HelpBlock.displayName = 'HelpBlock';
