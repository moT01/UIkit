import React, { createContext, useContext } from 'react';

export type PanelVariant = 'primary' | 'danger' | 'info';

export interface PanelProps {
  children: React.ReactNode;
  variant?: PanelVariant;
  className?: string;
}

const PanelContext = createContext<{ variant?: PanelVariant }>({});

const variantBorders: Record<PanelVariant, string> = {
  primary: 'border-[var(--fcc-primary-color)]',
  danger: 'border-[var(--fcc-red-light)]',
  info: 'border-[var(--fcc-blue-light)]',
};

const variantHeadings: Record<PanelVariant, string> = {
  primary: 'outline outline-1 outline-[var(--fcc-primary-color)] text-[var(--fcc-primary-color)]',
  danger: 'bg-[var(--fcc-red-light)] text-[var(--fcc-gray-90)]',
  info: 'bg-[var(--fcc-blue-light)] text-[var(--fcc-gray-90)]',
};

export const Panel: React.FC<PanelProps> & {
  Heading: React.FC<{ children: React.ReactNode; className?: string }>;
  Body: React.FC<{ children: React.ReactNode; className?: string }>;
  Title: React.FC<{ children: React.ReactNode }>;
} = ({ children, variant, className = '' }) => {
  const borderClass = variant ? variantBorders[variant] : 'border-[var(--fcc-border-color)]';

  return (
    <PanelContext.Provider value={{ variant }}>
      <div className={`border border-solid shadow-sm mb-6 ${borderClass} ${className}`}>
        {children}
      </div>
    </PanelContext.Provider>
  );
};

Panel.Heading = ({ children, className = '' }) => {
  const { variant } = useContext(PanelContext);
  const headingClass = variant
    ? variantHeadings[variant]
    : 'outline outline-1 outline-[var(--fcc-border-color)]';

  return (
    <div className={`px-4 py-3 ${headingClass} ${className}`}>
      {children}
    </div>
  );
};

Panel.Body = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

Panel.Title = ({ children }) => (
  <h3 className="text-inherit m-0 text-xl">{children}</h3>
);

Panel.displayName = 'Panel';
Panel.Heading.displayName = 'Panel.Heading';
Panel.Body.displayName = 'Panel.Body';
Panel.Title.displayName = 'Panel.Title';
