'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { statsService } from '@/lib/stats';
import type { DetailedStats, TagStatistics, ReviewHistory } from '@/lib/types/card';

export default function StatsPage() {
  const [stats, setStats] = useState<DetailedStats | null>(null);
  const [tagStats, setTagStats] = useState<TagStatistics[]>([]);
  const [reviewHistory, setReviewHistory] = useState<ReviewHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      const detailed = statsService.getDetailedStats();
      const byTag = statsService.getStatsByTag();
      const history = statsService.getReviewHistory(7);

      setStats(detailed);
      setTagStats(byTag);
      setReviewHistory(history);
      setLoading(false);
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <Container className="py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (!stats) return null;

  // Prepare chart data (last 7 days)
  const chartData = reviewHistory?.dailyActivity || [];
  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistics</h1>
        <p className="text-gray-600">Track your learning progress and performance</p>
      </div>

      {/* Overview Cards - Grid 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Cards */}
        <Card>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Total Cards</span>
            <span className="text-3xl font-bold text-gray-900">{stats.totalCards}</span>
            <div className="mt-2 text-xs text-gray-500">
              {stats.newCards} new · {stats.learningCards} learning
            </div>
          </div>
        </Card>

        {/* Due Today */}
        <Card>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Due Today</span>
            <span className="text-3xl font-bold text-orange-600">{stats.dueCards}</span>
            <div className="mt-2 text-xs text-gray-500">
              {stats.reviewedToday} reviewed today
            </div>
          </div>
        </Card>

        {/* Mastered */}
        <Card>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Mastered</span>
            <span className="text-3xl font-bold text-green-600">{stats.masteredCards}</span>
            <div className="mt-2 text-xs text-gray-500">
              {stats.totalCards > 0
                ? `${((stats.masteredCards / stats.totalCards) * 100).toFixed(0)}% of total`
                : '0% of total'}
            </div>
          </div>
        </Card>

        {/* Accuracy Rate */}
        <Card>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Accuracy Rate</span>
            <span className="text-3xl font-bold text-blue-600">
              {stats.accuracyRate.toFixed(0)}%
            </span>
            <div className="mt-2 text-xs text-gray-500">
              {stats.totalReviews} total reviews
            </div>
          </div>
        </Card>
      </div>

      {/* Review History Chart - Last 7 Days */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Activity (Last 7 Days)</h2>

        {chartData.length > 0 ? (
          <div className="space-y-4">
            {/* Chart */}
            <div className="flex items-end justify-between gap-2 h-48">
              {chartData.map((day, index) => {
                const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dateNum = date.getDate();

                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    {/* Bar */}
                    <div className="w-full flex flex-col justify-end h-40">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-colors relative group"
                        style={{ height: `${height}%` }}
                      >
                        {/* Tooltip on hover */}
                        {day.count > 0 && (
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                            {day.count} reviews
                            <div className="text-xs text-gray-300">
                              Good: {day.ratings.good} · Easy: {day.ratings.easy}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Labels */}
                    <div className="mt-2 text-center">
                      <div className="text-xs font-medium text-gray-900">{dayName}</div>
                      <div className="text-xs text-gray-500">{dateNum}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 text-sm">
              <div className="text-gray-600">
                <span className="font-medium text-gray-900">{reviewHistory?.totalReviews || 0}</span> total reviews
              </div>
              <div className="text-gray-600">
                <span className="font-medium text-gray-900">{reviewHistory?.averagePerDay.toFixed(1) || 0}</span> avg/day
              </div>
              <div className="text-gray-600">
                <span className="font-medium text-gray-900">{reviewHistory?.daysWithReviews || 0}</span> active days
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No review activity in the last 7 days</p>
            <p className="text-sm mt-1">Start reviewing cards to see your progress!</p>
          </div>
        )}
      </Card>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Streaks */}
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Streaks</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current</span>
              <span className="text-lg font-bold text-purple-600">{stats.currentStreak} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Longest</span>
              <span className="text-lg font-bold text-gray-900">{stats.longestStreak} days</span>
            </div>
          </div>
        </Card>

        {/* FSRS Metrics */}
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-3">FSRS Averages</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Stability</span>
              <span className="text-lg font-bold text-gray-900">{stats.averageStability.toFixed(1)} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Difficulty</span>
              <span className="text-lg font-bold text-gray-900">{stats.averageDifficulty.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Mastery Breakdown */}
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Mastery Levels</h3>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">New</span>
              <span className="font-medium text-blue-600">{stats.masteryDistribution.new}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Learning</span>
              <span className="font-medium text-yellow-600">{stats.masteryDistribution.learning}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Review</span>
              <span className="font-medium text-orange-600">{stats.masteryDistribution.review}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Mastered</span>
              <span className="font-medium text-green-600">{stats.masteryDistribution.mastered}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats by Tag Table */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistics by Tag</h2>

        {tagStats.length > 0 ? (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tag
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cards
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Mastered
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Stability
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accuracy
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tagStats.map((tag, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tag.tag}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                      {tag.totalCards}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <span className={tag.dueCards > 0 ? 'text-orange-600 font-medium' : 'text-gray-500'}>
                        {tag.dueCards}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-green-600 font-medium hidden sm:table-cell">
                      {tag.masteredCards}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600 hidden md:table-cell">
                      {tag.averageStability.toFixed(1)}d
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <span className={`font-medium ${
                        tag.accuracyRate >= 70 ? 'text-green-600' :
                        tag.accuracyRate >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {tag.totalReviews > 0 ? `${tag.accuracyRate.toFixed(0)}%` : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No tags found</p>
            <p className="text-sm mt-1">Add tags to your cards to see tag-specific statistics</p>
          </div>
        )}
      </Card>
    </Container>
  );
}
