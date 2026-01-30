'use client';

import { useEffect, useState } from 'react';
import { statsService } from '@/lib/stats';
import type { DetailedStats, TagStatistics, ReviewHistory, AccuracyMetrics, MasteryDistribution } from '@/lib/types/card';

export default function TestStatsPage() {
  const [detailedStats, setDetailedStats] = useState<DetailedStats | null>(null);
  const [tagStats, setTagStats] = useState<TagStatistics[]>([]);
  const [reviewHistory, setReviewHistory] = useState<ReviewHistory | null>(null);
  const [accuracyMetrics, setAccuracyMetrics] = useState<AccuracyMetrics | null>(null);
  const [masteryDist, setMasteryDist] = useState<MasteryDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      console.log('Loading stats...');

      // Test 1: getTotalCards
      const totalCards = statsService.getTotalCards();
      console.log('Total Cards:', totalCards);

      // Test 2: getDueCount
      const dueCount = statsService.getDueCount();
      console.log('Due Count:', dueCount);

      // Test 3: getMasteredCount
      const masteredCount = statsService.getMasteredCount();
      console.log('Mastered Count:', masteredCount);

      // Test 4: getDetailedStats
      const detailed = statsService.getDetailedStats();
      console.log('Detailed Stats:', detailed);
      setDetailedStats(detailed);

      // Test 5: getStatsByTag
      const byTag = statsService.getStatsByTag();
      console.log('Stats By Tag:', byTag);
      setTagStats(byTag);

      // Test 6: getReviewHistory
      const history30 = statsService.getReviewHistory(30);
      console.log('Review History (30 days):', history30);
      setReviewHistory(history30);

      // Test 7: getAccuracyRate
      const accuracy = statsService.getAccuracyRate();
      console.log('Accuracy Metrics:', accuracy);
      setAccuracyMetrics(accuracy);

      // Test 8: getMasteryDistribution
      const mastery = statsService.getMasteryDistribution();
      console.log('Mastery Distribution:', mastery);
      setMasteryDist(mastery);

      setLoading(false);
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Loading Stats...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Stats Service Test Page</h1>

        {/* Detailed Stats */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Detailed Statistics</h2>
          {detailedStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Total Cards</div>
                <div className="text-2xl font-bold">{detailedStats.totalCards}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Due Cards</div>
                <div className="text-2xl font-bold text-orange-600">{detailedStats.dueCards}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Mastered</div>
                <div className="text-2xl font-bold text-green-600">{detailedStats.masteredCards}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">New Cards</div>
                <div className="text-2xl font-bold text-blue-600">{detailedStats.newCards}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Learning</div>
                <div className="text-2xl font-bold">{detailedStats.learningCards}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Reviewed Today</div>
                <div className="text-2xl font-bold">{detailedStats.reviewedToday}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Current Streak</div>
                <div className="text-2xl font-bold text-purple-600">{detailedStats.currentStreak} days</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Longest Streak</div>
                <div className="text-2xl font-bold">{detailedStats.longestStreak} days</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Avg Stability</div>
                <div className="text-2xl font-bold">{detailedStats.averageStability.toFixed(1)} days</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Avg Difficulty</div>
                <div className="text-2xl font-bold">{detailedStats.averageDifficulty.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
                <div className="text-2xl font-bold text-green-600">{detailedStats.accuracyRate.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Reviews</div>
                <div className="text-2xl font-bold">{detailedStats.totalReviews}</div>
              </div>
            </div>
          )}
        </section>

        {/* Mastery Distribution */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Mastery Distribution</h2>
          {masteryDist && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-3xl font-bold text-blue-600">{masteryDist.new}</div>
                <div className="text-sm text-gray-600 mt-1">New</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded">
                <div className="text-3xl font-bold text-yellow-600">{masteryDist.learning}</div>
                <div className="text-sm text-gray-600 mt-1">Learning</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded">
                <div className="text-3xl font-bold text-orange-600">{masteryDist.review}</div>
                <div className="text-sm text-gray-600 mt-1">Review</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-3xl font-bold text-green-600">{masteryDist.mastered}</div>
                <div className="text-sm text-gray-600 mt-1">Mastered</div>
              </div>
            </div>
          )}
        </section>

        {/* Accuracy Metrics */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Accuracy Metrics</h2>
          {accuracyMetrics && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Overall Accuracy</span>
                <span className="text-2xl font-bold text-green-600">{accuracyMetrics.accuracyRate.toFixed(1)}%</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <div className="text-sm text-gray-600">Again</div>
                  <div className="font-bold">{accuracyMetrics.ratingDistribution.again}</div>
                  <div className="text-xs text-gray-500">({accuracyMetrics.ratingPercentages.again.toFixed(1)}%)</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Hard</div>
                  <div className="font-bold">{accuracyMetrics.ratingDistribution.hard}</div>
                  <div className="text-xs text-gray-500">({accuracyMetrics.ratingPercentages.hard.toFixed(1)}%)</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Good</div>
                  <div className="font-bold text-green-600">{accuracyMetrics.ratingDistribution.good}</div>
                  <div className="text-xs text-gray-500">({accuracyMetrics.ratingPercentages.good.toFixed(1)}%)</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Easy</div>
                  <div className="font-bold text-green-600">{accuracyMetrics.ratingDistribution.easy}</div>
                  <div className="text-xs text-gray-500">({accuracyMetrics.ratingPercentages.easy.toFixed(1)}%)</div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Review History */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Review History (Last 30 Days)</h2>
          {reviewHistory && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                  <div className="text-2xl font-bold">{reviewHistory.totalReviews}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Average/Day</div>
                  <div className="text-2xl font-bold">{reviewHistory.averagePerDay.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Days with Reviews</div>
                  <div className="text-2xl font-bold">{reviewHistory.daysWithReviews}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Period</div>
                  <div className="text-2xl font-bold">{reviewHistory.periodDays} days</div>
                </div>
              </div>
              {reviewHistory.dailyActivity.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Daily Activity</h3>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-right">Count</th>
                          <th className="px-4 py-2 text-right">Again</th>
                          <th className="px-4 py-2 text-right">Hard</th>
                          <th className="px-4 py-2 text-right">Good</th>
                          <th className="px-4 py-2 text-right">Easy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviewHistory.dailyActivity.slice(-10).reverse().map((day, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2">{day.date.toLocaleDateString()}</td>
                            <td className="px-4 py-2 text-right font-semibold">{day.count}</td>
                            <td className="px-4 py-2 text-right">{day.ratings.again}</td>
                            <td className="px-4 py-2 text-right">{day.ratings.hard}</td>
                            <td className="px-4 py-2 text-right text-green-600">{day.ratings.good}</td>
                            <td className="px-4 py-2 text-right text-green-600">{day.ratings.easy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Tag Statistics */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Statistics by Tag</h2>
          {tagStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Tag</th>
                    <th className="px-4 py-2 text-right">Total</th>
                    <th className="px-4 py-2 text-right">Due</th>
                    <th className="px-4 py-2 text-right">Mastered</th>
                    <th className="px-4 py-2 text-right">Avg Stability</th>
                    <th className="px-4 py-2 text-right">Accuracy</th>
                    <th className="px-4 py-2 text-right">Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {tagStats.map((tag, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 font-medium">{tag.tag}</td>
                      <td className="px-4 py-2 text-right">{tag.totalCards}</td>
                      <td className="px-4 py-2 text-right text-orange-600">{tag.dueCards}</td>
                      <td className="px-4 py-2 text-right text-green-600">{tag.masteredCards}</td>
                      <td className="px-4 py-2 text-right">{tag.averageStability.toFixed(1)}</td>
                      <td className="px-4 py-2 text-right text-green-600">{tag.accuracyRate.toFixed(1)}%</td>
                      <td className="px-4 py-2 text-right">{tag.totalReviews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No tags found</p>
          )}
        </section>

        {/* Console Note */}
        <section className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            Check the browser console for detailed logs of all stats method calls.
          </p>
        </section>
      </div>
    </div>
  );
}
