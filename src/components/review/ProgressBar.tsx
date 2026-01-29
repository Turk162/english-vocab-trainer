import { ProgressBarProps } from '@/lib/types/components';

export default function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={className}>
      {/* Label */}
      <div className="flex justify-between mb-2 text-sm text-secondary-700">
        <span className="font-medium">Progress</span>
        <span className="font-semibold">
          {current} / {total} cards
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="h-3 bg-secondary-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Review progress: ${current} of ${total} cards completed`}
      >
        <div
          style={{ width: `${percentage}%` }}
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ease-out"
        />
      </div>

      {/* Mobile percentage display */}
      <div className="md:hidden text-center mt-2 text-sm font-semibold text-primary-600">
        {percentage}%
      </div>
    </div>
  );
}
