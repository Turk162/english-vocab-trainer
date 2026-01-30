import { State } from 'ts-fsrs';
import { storageService } from '../storage/storage-service';
import { fsrsService } from '../fsrs/fsrs-service';
import type {
  Card,
  ReviewLog,
  DailyReviewActivity,
  ReviewHistory,
  AccuracyMetrics,
  TagStatistics,
  MasteryDistribution,
  DetailedStats,
} from '../types/card';

export interface StatsConfig {
  masteredStabilityThreshold: number;  // Default: 30 giorni
}

const DEFAULT_CONFIG: StatsConfig = {
  masteredStabilityThreshold: 30,
};

/**
 * Service per statistiche avanzate delle flashcard
 * Complementare a CardService.getStats() ma focalizzato su analytics approfondite
 */
export class StatsService {
  private config: StatsConfig;

  constructor(config: Partial<StatsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Conta totale carte nel database
   */
  getTotalCards(): number {
    const cards = storageService.getAllCards();
    return cards.length;
  }

  /**
   * Conta carte dovute per review oggi
   */
  getDueCount(now: Date = new Date()): number {
    const cards = storageService.getAllCards();
    return cards.filter(card => fsrsService.isDue(card, now)).length;
  }

  /**
   * Conta carte "masterizzate" (alta stabilità FSRS)
   * Criterio: State.Review + stability >= threshold (default 30 giorni)
   */
  getMasteredCount(): number {
    const cards = storageService.getAllCards();
    return cards.filter(card => this.isMastered(card)).length;
  }

  /**
   * Storico review ultimi N giorni con breakdown giornaliero
   */
  getReviewHistory(days: number = 30): ReviewHistory {
    const reviews = storageService.getAllReviewLogs();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);

    // Filter reviews within time window
    const relevantReviews = reviews.filter(
      review => new Date(review.reviewedAt) >= cutoffDate
    );

    // Group by day (date key: YYYY-MM-DD)
    const dailyMap = new Map<string, DailyReviewActivity>();

    relevantReviews.forEach(review => {
      const date = new Date(review.reviewedAt);
      date.setHours(0, 0, 0, 0);
      const dateKey = this.getDateKey(date);

      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: new Date(dateKey),
          count: 0,
          ratings: { again: 0, hard: 0, good: 0, easy: 0 },
        });
      }

      const activity = dailyMap.get(dateKey)!;
      activity.count++;

      // Map rating (1-4) to keys
      switch (review.rating) {
        case 1: activity.ratings.again++; break;
        case 2: activity.ratings.hard++; break;
        case 3: activity.ratings.good++; break;
        case 4: activity.ratings.easy++; break;
      }
    });

    const dailyActivity = Array.from(dailyMap.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      totalReviews: relevantReviews.length,
      dailyActivity,
      averagePerDay: relevantReviews.length / days,
      daysWithReviews: dailyActivity.length,
      periodDays: days,
    };
  }

  /**
   * Calcola % di successo nelle review (Good/Easy vs totale)
   * Parametro opzionale days: limita calcolo agli ultimi N giorni
   */
  getAccuracyRate(days?: number): AccuracyMetrics {
    let reviews = storageService.getAllReviewLogs();

    // Optional time filter
    if (days !== undefined) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      reviews = reviews.filter(
        review => new Date(review.reviewedAt) >= cutoffDate
      );
    }

    if (reviews.length === 0) {
      return {
        accuracyRate: 0,
        totalReviews: 0,
        ratingDistribution: { again: 0, hard: 0, good: 0, easy: 0 },
        ratingPercentages: { again: 0, hard: 0, good: 0, easy: 0 },
      };
    }

    // Count ratings (filter invalid ratings)
    const distribution = { again: 0, hard: 0, good: 0, easy: 0 };
    reviews.forEach(review => {
      switch (review.rating) {
        case 1: distribution.again++; break;
        case 2: distribution.hard++; break;
        case 3: distribution.good++; break;
        case 4: distribution.easy++; break;
        // Invalid ratings are silently skipped
      }
    });

    const successfulReviews = distribution.good + distribution.easy;
    const accuracyRate = (successfulReviews / reviews.length) * 100;

    const percentages = {
      again: (distribution.again / reviews.length) * 100,
      hard: (distribution.hard / reviews.length) * 100,
      good: (distribution.good / reviews.length) * 100,
      easy: (distribution.easy / reviews.length) * 100,
    };

    return {
      accuracyRate,
      totalReviews: reviews.length,
      ratingDistribution: distribution,
      ratingPercentages: percentages,
    };
  }

  /**
   * Aggregare statistiche per ogni tag
   */
  getStatsByTag(): TagStatistics[] {
    const cards = storageService.getAllCards();
    const reviews = storageService.getAllReviewLogs();
    const now = new Date();

    // Build review index for quick lookup
    const reviewsByCardId = new Map<string, ReviewLog[]>();
    reviews.forEach(review => {
      if (!reviewsByCardId.has(review.cardId)) {
        reviewsByCardId.set(review.cardId, []);
      }
      reviewsByCardId.get(review.cardId)!.push(review);
    });

    // Group cards by tag (card can have multiple tags)
    const tagMap = new Map<string, Card[]>();
    cards.forEach(card => {
      card.tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)!.push(card);
      });
    });

    // Calculate stats per tag
    const tagStats: TagStatistics[] = [];
    tagMap.forEach((tagCards, tag) => {
      const totalCards = tagCards.length;
      const dueCards = tagCards.filter(c => fsrsService.isDue(c, now)).length;
      const masteredCards = tagCards.filter(c => this.isMastered(c)).length;
      const newCards = tagCards.filter(c => fsrsService.isNew(c)).length;
      const learningCards = tagCards.filter(c => fsrsService.isLearning(c)).length;
      const reviewCards = tagCards.filter(c => fsrsService.isReview(c)).length;

      // FSRS averages
      const totalStability = tagCards.reduce((sum, c) => sum + c.fsrsData.stability, 0);
      const totalDifficulty = tagCards.reduce((sum, c) => sum + c.fsrsData.difficulty, 0);
      const averageStability = totalStability / totalCards;
      const averageDifficulty = totalDifficulty / totalCards;

      // Review metrics for this tag
      const cardIds = new Set(tagCards.map(c => c.id));
      const tagReviews = reviews.filter(r => cardIds.has(r.cardId));
      const totalReviews = tagReviews.length;

      const successfulReviews = tagReviews.filter(r => r.rating >= 3).length;
      const accuracyRate = totalReviews > 0
        ? (successfulReviews / totalReviews) * 100
        : 0;

      tagStats.push({
        tag,
        totalCards,
        dueCards,
        masteredCards,
        newCards,
        learningCards,
        reviewCards,
        averageStability,
        averageDifficulty,
        totalReviews,
        accuracyRate,
      });
    });

    // Sort by total cards descending
    return tagStats.sort((a, b) => b.totalCards - a.totalCards);
  }

  /**
   * Breakdown carte per livello di mastery
   */
  getMasteryDistribution(): MasteryDistribution {
    const cards = storageService.getAllCards();

    const distribution: MasteryDistribution = {
      new: 0,
      learning: 0,
      review: 0,
      mastered: 0,
    };

    cards.forEach(card => {
      if (fsrsService.isNew(card)) {
        distribution.new++;
      } else if (fsrsService.isLearning(card)) {
        distribution.learning++;
      } else if (fsrsService.isReview(card)) {
        if (this.isMastered(card)) {
          distribution.mastered++;
        } else {
          distribution.review++;
        }
      }
    });

    return distribution;
  }

  /**
   * Ottiene tutte le statistiche in un unico metodo
   * Include base stats + analytics avanzate
   */
  getDetailedStats(): DetailedStats {
    const cards = storageService.getAllCards();
    const reviews = storageService.getAllReviewLogs();
    const now = new Date();

    // Base stats
    const totalCards = cards.length;
    const dueCards = cards.filter(c => fsrsService.isDue(c, now)).length;
    const newCards = cards.filter(c => fsrsService.isNew(c)).length;
    const learningCards = cards.filter(c => fsrsService.isLearning(c)).length;
    const masteredCards = cards.filter(c => this.isMastered(c)).length;

    // Reviews today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const reviewedToday = reviews.filter(
      r => new Date(r.reviewedAt) >= todayStart
    ).length;

    // Streaks
    const { currentStreak, longestStreak, lastReviewDate } = this.calculateStreaks(reviews);

    // FSRS averages
    const totalStability = cards.reduce((sum, c) => sum + c.fsrsData.stability, 0);
    const totalDifficulty = cards.reduce((sum, c) => sum + c.fsrsData.difficulty, 0);
    const averageStability = totalCards > 0 ? totalStability / totalCards : 0;
    const averageDifficulty = totalCards > 0 ? totalDifficulty / totalCards : 0;

    // Accuracy
    const accuracyMetrics = this.getAccuracyRate();
    const accuracyRate = accuracyMetrics.accuracyRate;
    const totalReviews = reviews.length;

    // Mastery distribution
    const masteryDistribution = this.getMasteryDistribution();

    return {
      totalCards,
      dueCards,
      newCards,
      learningCards,
      reviewedToday,
      currentStreak,
      longestStreak,
      lastReviewDate,
      masteredCards,
      averageStability,
      averageDifficulty,
      accuracyRate,
      totalReviews,
      masteryDistribution,
    };
  }

  /**
   * Verifica se una carta è "mastered"
   */
  private isMastered(card: Card): boolean {
    return (
      card.fsrsData.state === State.Review &&
      card.fsrsData.stability >= this.config.masteredStabilityThreshold
    );
  }

  /**
   * Calcola streak giorni consecutivi con review
   */
  private calculateStreaks(reviews: ReviewLog[]): {
    currentStreak: number;
    longestStreak: number;
    lastReviewDate: Date | null;
  } {
    if (reviews.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastReviewDate: null };
    }

    // Group reviews by day
    const reviewDays = new Set<string>();
    reviews.forEach(review => {
      const date = new Date(review.reviewedAt);
      date.setHours(0, 0, 0, 0);
      reviewDays.add(this.getDateKey(date));
    });

    // Sort dates
    const sortedDays = Array.from(reviewDays).sort();
    const lastDay = sortedDays[sortedDays.length - 1];
    if (!lastDay) {
      return { currentStreak: 0, longestStreak: 0, lastReviewDate: null };
    }
    const lastReviewDate = new Date(lastDay);

    // Calculate current streak (backwards from today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentStreak = 0;
    let checkDate = new Date(today);

    while (true) {
      const dateKey = this.getDateKey(checkDate);
      if (reviewDays.has(dateKey)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Allow one day gap if we haven't started counting yet
        if (currentStreak === 0 && checkDate.getTime() === today.getTime()) {
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    for (let i = 1; i < sortedDays.length; i++) {
      const prevDay = sortedDays[i - 1];
      const currDay = sortedDays[i];
      if (!prevDay || !currDay) continue;

      const prevDate = new Date(prevDay);
      const currDate = new Date(currDay);
      const dayDiff = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak, lastReviewDate };
  }

  /**
   * Helper per ottenere chiave data YYYY-MM-DD da Date
   */
  private getDateKey(date: Date): string {
    return date.toISOString().substring(0, 10);
  }
}

// Export singleton instance
export const statsService = new StatsService();
