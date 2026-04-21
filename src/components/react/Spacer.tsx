import React from 'react';

export type SpacerSize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

const sizes: Record<SpacerSize, number> = {
  xxs: 5,
  xs: 10,
  s: 20,
  m: 30,
  l: 60,
  xl: 90,
  xxl: 180,
};

export interface SpacerProps {
  size: SpacerSize;
}

export const Spacer: React.FC<SpacerProps> = ({ size }) => {
  return <div style={{ height: sizes[size] }} aria-hidden="true" />;
};

Spacer.displayName = 'Spacer';
