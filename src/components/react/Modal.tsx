import React, { useEffect, useRef } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'medium' | 'large' | 'xLarge';
  variant?: 'default' | 'danger';
  title?: string;
}

export const Modal: React.FC<ModalProps> & {
  Header: React.FC<{ children: React.ReactNode; showCloseButton?: boolean }>;
  Body: React.FC<{ children: React.ReactNode; className?: string }>;
  Footer: React.FC<{ children: React.ReactNode }>;
} = ({ open, onClose, children, size = 'medium', variant = 'default' }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const sizeClasses = {
    medium: 'max-w-[600px]',
    large: 'max-w-[900px]',
    xLarge: 'max-w-[95vw] md:max-w-[90vw]',
  };

  const variantClasses = {
    default: 'text-[var(--fcc-primary-color)]',
    danger: 'text-[var(--fcc-red-light)]',
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-start justify-center p-4 md:pt-8 overflow-auto">
        <div
          ref={panelRef}
          className={`relative w-full ${sizeClasses[size]} bg-[var(--fcc-secondary-background)] border border-solid border-[var(--fcc-border-color)] shadow-xl ${variantClasses[variant]} mt-4 md:mt-8`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.Header = ({ children, showCloseButton = true }) => (
  <div className="flex items-center justify-between p-4 border-b border-[var(--fcc-border-color)]">
    <h3 className="m-0 text-lg font-bold flex-1 text-center">{children}</h3>
    {showCloseButton && (
      <button
        type="button"
        onClick={() => {}}
        className="w-6 h-6 inline-flex items-center justify-center bg-transparent border-none text-xl font-bold text-[var(--fcc-primary-color)] opacity-50 hover:opacity-100"
        aria-label="Close"
      >
        &times;
      </button>
    )}
  </div>
);

Modal.Body = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

Modal.Footer = ({ children }) => (
  <div className="p-4 border-t border-[var(--fcc-border-color)] flex justify-end gap-2">{children}</div>
);

Modal.displayName = 'Modal';
Modal.Header.displayName = 'Modal.Header';
Modal.Body.displayName = 'Modal.Body';
Modal.Footer.displayName = 'Modal.Footer';
