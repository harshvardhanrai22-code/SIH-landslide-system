import React from 'react';

/**
 * Reusable Input component supporting light and dark modes with proper contrast and focus states.
 */
export const Input = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
  rightElement,
  autoComplete,
  required = false,
}) => {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-xs font-semibold tracking-wider uppercase text-stone-700 dark:text-stone-300"
        >
          {label}
          {required && <span className="text-[#2d5a44] dark:text-emerald-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id || name}-error` : undefined}
          className={`w-full px-3.5 py-2.5 bg-white dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm rounded-md border transition-colors duration-150 focus:outline-none ${
            rightElement ? 'pr-11' : ''
          } ${
            error
              ? 'border-red-500 dark:border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
              : 'border-stone-300 dark:border-stone-700 focus:border-[#2d5a44] dark:focus:border-emerald-600 focus:ring-1 focus:ring-[#2d5a44] dark:focus:ring-emerald-600'
          } ${disabled ? 'opacity-60 bg-stone-50 dark:bg-stone-900 cursor-not-allowed' : ''}`}
        />

        {rightElement && (
          <div className="absolute right-0 pr-3 flex items-center text-stone-400 dark:text-stone-400">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${id || name}-error`}
          className="text-xs text-red-600 dark:text-red-400 font-medium pt-0.5 flex items-center gap-1"
        >
          <span>•</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
