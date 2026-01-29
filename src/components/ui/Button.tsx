import { ButtonProps } from '@/lib/types/components';

const variantStyles = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
  secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-700 focus:ring-secondary-500',
  danger: 'bg-danger-500 hover:bg-danger-600 text-white focus:ring-danger-500',
};

export default function Button({
  variant = 'primary',
  children,
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const widthStyles = fullWidth ? 'w-full md:w-auto' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
