import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState
} from 'react';

interface RadioGroupContextValue {
  name?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label?: React.ReactNode;
  labelClassName?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      labelClassName = '',
      className = '',
      id,
      name,
      value,
      checked,
      onChange,
      ...rest
    },
    ref
  ) => {
    const group = useContext(RadioGroupContext);
    const resolvedName = name ?? group?.name;
    const resolvedChecked =
      checked !== undefined
        ? checked
        : group && value !== undefined
          ? group.value === value
          : undefined;
    const resolvedOnChange = onChange ?? group?.onChange;
    const input = (
      <input
        ref={ref}
        type='radio'
        id={id}
        className={className}
        name={resolvedName}
        value={value}
        checked={resolvedChecked}
        onChange={resolvedOnChange}
        {...rest}
      />
    );
    if (label === undefined) return input;
    const classes = ['radio', labelClassName].filter(Boolean).join(' ');
    return (
      <label className={classes} htmlFor={id}>
        {input}
        <span>{label}</span>
      </label>
    );
  }
);
Radio.displayName = 'Radio';

export interface RadioGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  name: string;
  /** Controlled selected value. When set the group ignores `defaultValue`. */
  value?: string;
  /** Uncontrolled initial value. Used when `value` is omitted. */
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

// Wave 9 P2.1 (W9-B18) — `defaultValue` is the documented entry path
// for static demos and most consumer code (e.g. radio.astro showcase).
// Pre-fix, the prop fell through to `...rest` and was meaningless on
// the rendered `<div role="radiogroup">`, so children resolved
// `group.value === value` against `undefined` and SSRed unchecked.
// Post-fix, the group seeds internal state from `defaultValue` when
// `value` is omitted (uncontrolled), forwards that into the context,
// and updates on user input. Controlled mode (`value` set) is
// unchanged and continues to take precedence.
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    { name, value, defaultValue, onChange, className = '', children, ...rest },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<string | undefined>(
      defaultValue
    );
    const resolvedValue = isControlled ? value : internalValue;
    const handleChange = useCallback<
      React.ChangeEventHandler<HTMLInputElement>
    >(
      event => {
        if (!isControlled) {
          setInternalValue(event.target.value);
        }
        onChange?.(event);
      },
      [isControlled, onChange]
    );
    const classes = ['radio-group', className].filter(Boolean).join(' ');
    return (
      <RadioGroupContext.Provider
        value={{ name, value: resolvedValue, onChange: handleChange }}
      >
        <div ref={ref} role='radiogroup' className={classes} {...rest}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';
