import React, { createContext, useContext } from 'react';

export interface FormGroupProps {
  children: React.ReactNode;
  controlId?: string;
  validationState?: 'success' | 'warning' | 'error';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export interface FormContextValue {
  controlId?: string;
  validationState?: 'success' | 'warning' | 'error';
}

export const FormContext = createContext<FormContextValue>({});

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  controlId,
  validationState,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <FormContext.Provider value={{ controlId, validationState }}>
      <Component className={`mb-4 relative ${className}`}>
        {children}
      </Component>
    </FormContext.Provider>
  );
};

FormGroup.displayName = 'FormGroup';
