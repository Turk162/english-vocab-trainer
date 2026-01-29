'use client';

import { useId } from 'react';
import { InputProps } from '@/lib/types/components';

export default function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  const id = useId();
  const inputId = props.id || id;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const baseStyles = 'block w-full rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors';
  const stateStyles = error
    ? 'border-2 border-danger-500 focus:ring-danger-500'
    : 'border border-gray-300 focus:ring-primary-500 focus:border-primary-500';

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        className={`${baseStyles} ${stateStyles}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
      />
      {error && (
        <p
          id={errorId}
          className="mt-2 text-sm text-danger-600"
          role="alert"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          id={helperId}
          className="mt-2 text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
