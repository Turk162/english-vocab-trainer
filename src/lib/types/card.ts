import { Card as FSRSCard, State } from 'ts-fsrs';

/**
 * Flashcard con dati FSRS per spaced repetition
 */
export interface Card {
  id: string;                    // UUID
  front: string;                 // Parola inglese
  back: string;                  // Traduzione italiana
  context: string;               // Frase esempio inglese
  contextTranslation: string;    // Traduzione frase
  tags: string[];                // Array di tag/categorie
  fsrsData: FSRSCard;           // Dati algoritmo FSRS
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Dati per creare una nuova card (senza id, date, fsrsData)
 */
export interface CreateCardData {
  front: string;
  back: string;
  context: string;
  contextTranslation: string;
  tags: string[];
}

/**
 * Dati per aggiornare una card esistente
 */
export interface UpdateCardData {
  front?: string;
  back?: string;
  context?: string;
  contextTranslation?: string;
  tags?: string[];
}

/**
 * Log di review per statistiche
 */
export interface ReviewLog {
  cardId: string;
  rating: number;              // 1-4 (Again, Hard, Good, Easy)
  reviewedAt: Date;
  previousState: State;
  newState: State;
  scheduledDays: number;
}

/**
 * Statistiche utente
 */
export interface UserStats {
  totalCards: number;
  dueCards: number;
  newCards: number;
  learningCards: number;
  reviewedToday: number;
  currentStreak: number;
  longestStreak: number;
  lastReviewDate: Date | null;
}

/**
 * Review activity for a specific date
 */
export interface DailyReviewActivity {
  date: Date;
  count: number;
  ratings: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
}

/**
 * Historical review data over a time period
 */
export interface ReviewHistory {
  totalReviews: number;
  dailyActivity: DailyReviewActivity[];
  averagePerDay: number;
  daysWithReviews: number;
  periodDays: number;
}

/**
 * Accuracy metrics based on ratings
 */
export interface AccuracyMetrics {
  accuracyRate: number;        // % di Good+Easy ratings
  totalReviews: number;
  ratingDistribution: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
  ratingPercentages: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
}

/**
 * Statistics for a specific tag
 */
export interface TagStatistics {
  tag: string;
  totalCards: number;
  dueCards: number;
  masteredCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  averageStability: number;
  averageDifficulty: number;
  totalReviews: number;
  accuracyRate: number;
}

/**
 * Mastery level breakdown
 */
export interface MasteryDistribution {
  new: number;                  // State.New
  learning: number;             // State.Learning + State.Relearning
  review: number;               // State.Review (not mastered yet)
  mastered: number;             // State.Review + stability > 30 days
}

/**
 * Comprehensive statistics (extends UserStats)
 */
export interface DetailedStats extends UserStats {
  masteredCards: number;
  averageStability: number;
  averageDifficulty: number;
  accuracyRate: number;
  totalReviews: number;
  masteryDistribution: MasteryDistribution;
}
