'use client';

import { Rating } from 'ts-fsrs';
import { RatingButtonsProps } from '@/lib/types/components';

type RatingConfig = {
  rating: Rating;
  label: string;
  shortLabel: string;
  colorClass: string;
  description: string;
};

const ratingConfigs: RatingConfig[] = [
  {
    rating: Rating.Again,
    label: 'Again',
    shortLabel: '1',
    colorClass: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
    description: 'Non ricordata - rivedila presto',
  },
  {
    rating: Rating.Hard,
    label: 'Hard',
    shortLabel: '2',
    colorClass: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    description: 'Difficile - ricordata con fatica',
  },
  {
    rating: Rating.Good,
    label: 'Good',
    shortLabel: '3',
    colorClass: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
    description: 'Bene - ricordata normalmente',
  },
  {
    rating: Rating.Easy,
    label: 'Easy',
    shortLabel: '4',
    colorClass: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
    description: 'Facile - ricordata facilmente',
  },
];

export default function RatingButtons({
  onRate,
  disabled = false,
  className = '',
}: RatingButtonsProps) {
  const baseButtonStyles = `
    px-4 py-3 md:px-6 md:py-4
    rounded-lg font-semibold text-white
    transition-colors
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
  `;

  return (
    <div className={`grid grid-cols-2 md:flex md:flex-row gap-3 md:gap-4 ${className}`}>
      {ratingConfigs.map((config) => (
        <button
          key={config.rating}
          onClick={() => onRate(config.rating)}
          disabled={disabled}
          className={`${baseButtonStyles} ${config.colorClass}`}
          aria-label={config.description}
          title={config.description}
        >
          <span className="md:hidden mr-1.5">{config.shortLabel}</span>
          <span>{config.label}</span>
        </button>
      ))}
    </div>
  );
}
