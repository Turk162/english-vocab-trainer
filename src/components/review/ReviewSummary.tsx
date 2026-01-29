import { ReviewSummaryProps } from '@/lib/types/components';
import Button from '@/components/ui/Button';
import ProgressBar from './ProgressBar';

export default function ReviewSummary({
  stats,
  onReviewMore,
  onGoHome
}: ReviewSummaryProps) {
  const { reviewed, total, again, hard, good, easy } = stats;

  // Calculate accuracy (good + easy)
  const accuracy = reviewed > 0
    ? Math.round(((good + easy) / reviewed) * 100)
    : 0;

  // Motivational message based on accuracy
  const getMessage = () => {
    if (accuracy >= 80) return 'Outstanding! 🌟';
    if (accuracy >= 60) return 'Good job! 💪';
    return 'Keep practicing! 🚀';
  };

  // Rating configuration
  const ratingConfig = [
    {
      key: 'again' as const,
      label: 'Again',
      icon: '🔴',
      count: again,
      colorClass: 'text-red-600',
      bgClass: 'bg-red-50',
      borderClass: 'border-red-200',
    },
    {
      key: 'hard' as const,
      label: 'Hard',
      icon: '🟡',
      count: hard,
      colorClass: 'text-yellow-600',
      bgClass: 'bg-yellow-50',
      borderClass: 'border-yellow-200',
    },
    {
      key: 'good' as const,
      label: 'Good',
      icon: '🟢',
      count: good,
      colorClass: 'text-green-600',
      bgClass: 'bg-green-50',
      borderClass: 'border-green-200',
    },
    {
      key: 'easy' as const,
      label: 'Easy',
      icon: '🔵',
      count: easy,
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-50',
      borderClass: 'border-blue-200',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl text-center border-2 border-primary-200">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">
          Session Complete!
        </h1>
        <p className="text-lg text-primary-700">
          You reviewed <span className="font-bold">{reviewed}</span> cards today
        </p>
      </div>

      {/* Stats Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-secondary-200 space-y-6">
        {/* Accuracy Badge */}
        <div className="text-center py-4">
          <div className="inline-block bg-gradient-to-br from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl shadow-md">
            <div className="text-4xl font-bold mb-1">{accuracy}%</div>
            <div className="text-sm font-medium uppercase tracking-wide">
              Accuracy Rate
            </div>
          </div>
        </div>

        {/* Ratings Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ratingConfig.map(({ key, label, icon, count, colorClass, bgClass, borderClass }) => {
            const percentage = reviewed > 0
              ? Math.round((count / reviewed) * 100)
              : 0;

            return (
              <div
                key={key}
                className={`${bgClass} ${borderClass} border-2 p-4 rounded-lg text-center`}
              >
                <div className="text-3xl mb-2">{icon}</div>
                <div className={`text-2xl font-bold ${colorClass} mb-1`}>
                  {count}
                </div>
                <div className="text-sm font-medium text-secondary-700 mb-1">
                  {label}
                </div>
                <div className="text-xs text-secondary-600">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Progress */}
        <ProgressBar current={reviewed} total={total} />

        {/* Motivational Message */}
        <div className="text-center py-2">
          <p className="text-xl font-semibold text-primary-700">
            {getMessage()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          onClick={onReviewMore}
          fullWidth
          className="sm:flex-1"
        >
          Review More 🔄
        </Button>
        <Button
          variant="secondary"
          onClick={onGoHome}
          fullWidth
          className="sm:flex-1"
        >
          Back Home
        </Button>
      </div>
    </div>
  );
}
