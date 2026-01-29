import { CardProps } from '@/lib/types/components';

export default function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
}: CardProps) {
  const baseStyles = 'bg-white rounded-lg shadow-sm p-4 md:p-6';
  const interactiveStyles = onClick
    ? 'cursor-pointer hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
    : hoverable
    ? 'hover:shadow-md transition-shadow'
    : '';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const Component = onClick ? 'div' : 'div';

  return (
    <Component
      className={`${baseStyles} ${interactiveStyles} ${className}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </Component>
  );
}
