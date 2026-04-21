import React from 'react';

export interface CloseButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ onClick, label = 'Close', className = '' }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={`inline-flex items-center justify-center w-6 h-6 bg-transparent border-none text-lg font-bold text-[var(--fcc-primary-color)] opacity-50 hover:opacity-100 focus:opacity-100 transition-opacity ${className}`}
        aria-label={label}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    );
  }
);

CloseButton.displayName = 'CloseButton';
