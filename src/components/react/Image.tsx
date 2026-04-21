import React, { forwardRef } from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  responsive?: boolean;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ responsive = true, className = '', alt = '', ...props }, ref) => {
    return (
      <img
        ref={ref}
        alt={alt}
        className={`${responsive ? 'max-w-full h-auto' : 'max-w-none'} ${className}`}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';
