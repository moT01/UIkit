import React from 'react';

export type ToggleButtonSize = 'small' | 'medium' | 'large';

export interface ToggleButtonProps {
  children: React.ReactNode;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  bsSize?: ToggleButtonSize;
  value?: string;
  name?: string;
  type?: 'button' | 'radio';
  className?: string;
}

const sizeClasses: Record<ToggleButtonSize, string> = {
  small: 'px-5 py-1 text-sm',
  medium: 'px-6 py-1.5 text-base',
  large: 'px-8 py-2.5 text-lg',
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  children,
  checked = false,
  onChange,
  disabled = false,
  bsSize = 'small',
  value,
  name,
  type = 'button',
  className = '',
}) => {
  const baseClasses =
    'relative border-3 border-[var(--fcc-border-color)] text-center inline-block cursor-pointer focus-within:ring focus-within:ring-[var(--fcc-focus-ring)] transition-colors';

  const stateClasses = checked
    ? 'bg-[var(--fcc-primary-color)] text-[var(--fcc-gray-90)]'
    : 'bg-[var(--fcc-tertiary-background)] text-[var(--fcc-secondary-color)]';

  const hoverClasses = !disabled
    ? checked
      ? 'hover:bg-[var(--fcc-tertiary-background)] hover:text-[var(--fcc-secondary-color)]'
      : 'hover:bg-[var(--fcc-primary-color)] hover:text-[var(--fcc-gray-90)]'
    : '';

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(true);
    }
  };

  if (type === 'radio') {
    return (
      <label
        className={`${baseClasses} ${stateClasses} ${hoverClasses} ${disabledClasses} ${sizeClasses[bsSize]} ${className}`}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="absolute h-0 w-0 opacity-0"
        />
        {children}
      </label>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={checked}
      disabled={disabled}
      onClick={handleChange}
      className={`${baseClasses} ${stateClasses} ${hoverClasses} ${disabledClasses} ${sizeClasses[bsSize]} ${className}`}
    >
      {children}
    </button>
  );
};

ToggleButton.displayName = 'ToggleButton';
