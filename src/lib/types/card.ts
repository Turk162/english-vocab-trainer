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
