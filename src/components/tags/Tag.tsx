import { X } from 'lucide-react';
import type { TagProps } from '@/lib/types/components';

export default function Tag({
  label,
  variant = 'default',
  size = 'md',
  count,
  onRemove,
  onClick,
  disabled = false,
  className = '',
}: TagProps) {
  const isClickable = !!(onClick || onRemove);

  // Variant styles
  const variantStyles = {
    default: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
    selected: 'bg-primary-500 text-white hover:bg-primary-600',
    removable: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
    filter: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 cursor-pointer',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs md:text-sm',
    lg: 'px-4 py-2 text-sm md:text-base',
  };

  // Disabled styles
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  // Focus styles
  const focusStyles = isClickable && !disabled
    ? 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
    : '';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) onClick();
      if (onRemove) onRemove();
    }
  };

  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick();
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (onRemove) onRemove();
  };

  const ariaLabel = `${label}${count !== undefined ? ` (${count} cards)` : ''}`;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full
        transition-colors duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${focusStyles}
        ${className}
      `}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable && !disabled ? 0 : undefined}
      aria-label={ariaLabel}
      aria-pressed={variant === 'selected' ? true : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className="font-medium">{label}</span>
      {count !== undefined && (
        <span className="opacity-75">({count})</span>
      )}
      {variant === 'removable' && (
        <button
          type="button"
          onClick={handleRemoveClick}
          disabled={disabled}
          className="hover:bg-primary-300 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
