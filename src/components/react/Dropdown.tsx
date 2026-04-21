import React, { useState, useRef, useEffect } from 'react';

export interface DropdownProps {
  children: React.ReactNode;
  id?: string;
}

export interface DropdownToggleProps {
  children: React.ReactNode;
  className?: string;
}

export interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
}

const DropdownContext = React.createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
} | null>(null);

export const Dropdown: React.FC<DropdownProps> & {
  Toggle: React.FC<DropdownToggleProps>;
  Menu: React.FC<DropdownMenuProps>;
  Item: React.FC<DropdownItemProps>;
} = ({ children, id }) => {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen, toggleRef }}>
      <div ref={containerRef} className="relative inline-block" id={id}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

Dropdown.Toggle = ({ children, className = '' }) => {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) return null;

  return (
    <button
      ref={ctx.toggleRef}
      type="button"
      onClick={() => ctx.setOpen(!ctx.open)}
      aria-expanded={ctx.open}
      className={`inline-flex items-center gap-2 px-3 py-1.5 border-3 border-solid border-[var(--fcc-border-color)] bg-[var(--fcc-tertiary-background)] text-[var(--fcc-secondary-color)] hover:bg-[var(--fcc-secondary-color)] hover:text-[var(--fcc-gray-90)] transition-colors cursor-pointer ${className}`}
    >
      {children}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={ctx.open ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'} />
      </svg>
    </button>
  );
};

Dropdown.Menu = ({ children, className = '' }) => {
  const ctx = React.useContext(DropdownContext);
  if (!ctx || !ctx.open) return null;

  return (
    <div
      className={`absolute top-full left-0 mt-1 min-w-max z-10 bg-[var(--fcc-primary-background)] border border-solid border-[var(--fcc-border-color)] shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

Dropdown.Item = ({ children, active, className = '', ...props }) => {
  return (
    <button
      type="button"
      className={`block w-full text-left px-4 py-2 text-sm border-none cursor-pointer transition-colors ${
        active
          ? 'bg-[var(--fcc-secondary-color)] text-[var(--fcc-gray-90)]'
          : 'bg-transparent text-[var(--fcc-secondary-color)] hover:bg-[var(--fcc-secondary-color)] hover:text-[var(--fcc-gray-90)]'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

Dropdown.displayName = 'Dropdown';
Dropdown.Toggle.displayName = 'Dropdown.Toggle';
Dropdown.Menu.displayName = 'Dropdown.Menu';
Dropdown.Item.displayName = 'Dropdown.Item';
