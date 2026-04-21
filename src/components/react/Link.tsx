import React, { forwardRef } from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  block?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, to, href, block, className = '', ...props }, ref) => {
    const targetHref = to || href;
    return (
      <a
        ref={ref}
        href={targetHref}
        className={`text-[var(--fcc-primary-color)] text-center hover:no-underline hover:bg-[var(--fcc-tertiary-background)] transition-colors ${block ? 'block w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';
