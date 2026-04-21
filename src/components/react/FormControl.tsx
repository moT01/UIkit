import React, { forwardRef, useContext } from 'react';
import { FormContext } from './FormGroup';

export interface FormControlProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  componentClass?: 'input' | 'textarea';
  id?: string;
}

export const FormControl = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormControlProps>(
  ({ componentClass = 'input', id, className = '', ...props }, ref) => {
    const { controlId } = useContext(FormContext);
    const inputId = id || controlId;

    const baseClasses =
      'block w-full py-1.5 px-2.5 text-base text-[var(--fcc-primary-color)] bg-[var(--fcc-primary-background)] border border-solid border-[var(--fcc-border-color)] rounded-none shadow-none transition-colors duration-150 focus:border-[var(--fcc-highlight-color)] focus:outline-none focus:ring-1 focus:ring-[var(--fcc-highlight-color)]';

    if (componentClass === 'textarea') {
      return (
        <textarea
          id={inputId}
          className={`${baseClasses} ${className}`}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }

    return (
      <input
        id={inputId}
        className={`${baseClasses} h-10 ${className}`}
        ref={ref as React.Ref<HTMLInputElement>}
        {...props}
      />
    );
  }
);

FormControl.displayName = 'FormControl';
