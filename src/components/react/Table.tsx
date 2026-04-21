import React, { forwardRef } from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  condensed?: boolean;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ striped = false, condensed = false, children, className = '', ...props }, ref) => {
    return (
      <table
        ref={ref}
        className={`w-full max-w-full border-collapse text-left text-[var(--fcc-secondary-color)] ${striped ? '[&>tbody>tr:nth-of-type(odd)]:bg-[var(--fcc-tertiary-background)]' : ''} ${className}`}
        {...props}
      >
        {children}
      </table>
    );
  }
);

Table.displayName = 'Table';
