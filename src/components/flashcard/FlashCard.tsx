'use client';

import { FlashCardProps } from '@/lib/types/components';

export default function FlashCard({
  card,
  isFlipped,
  onFlip,
  disabled = false,
  className = '',
}: FlashCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onFlip();
    }
  };

  const containerStyles = 'relative w-full aspect-[4/3] md:aspect-video cursor-pointer';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <div
      className={`${containerStyles} ${disabledStyles} ${className}`}
      onClick={disabled ? undefined : onFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={isFlipped ? 'Mostra parola inglese' : 'Mostra traduzione'}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`
          relative w-full h-full
          transition-transform duration-600 ease-in-out
          ${isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}
        `}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center
                     bg-white rounded-2xl shadow-lg p-6 md:p-8"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600">
            {card.front}
          </p>
          <p className="text-sm md:text-base text-secondary-500 mt-4">
            Click to reveal translation
          </p>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 flex flex-col justify-center
                     bg-primary-50 rounded-2xl shadow-lg p-6 md:p-8
                     [transform:rotateY(180deg)]"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="mb-6">
            <p className="text-2xl md:text-3xl font-semibold text-primary-800 mb-2">
              {card.back}
            </p>
          </div>

          <div className="border-t border-primary-200 pt-4">
            <p className="text-base md:text-lg text-secondary-700 italic mb-2">
              &quot;{card.context}&quot;
            </p>
            <p className="text-sm md:text-base text-secondary-600">
              &quot;{card.contextTranslation}&quot;
            </p>
          </div>

          {card.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs md:text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
