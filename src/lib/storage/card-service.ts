import { v4 as uuidv4 } from 'uuid';
import { Card, CreateCardData, UpdateCardData, UserStats } from '../types/card';
import { fsrsService, Rating } from '../fsrs/fsrs-service';
import { storageService } from './storage-service';

/**
 * Service principale per la gestione delle flashcard
 * Combina FSRS (spaced repetition) e Storage
 */
export class CardService {
  /**
   * Crea una nuova card
   */
  async create(data: CreateCardData): Promise<Card> {
    const now = new Date();
    const card: Card = {
      id: uuidv4(),
      ...data,
      fsrsData: fsrsService.createNewCard(),
      createdAt: now,
      updatedAt: now,
    };

    storageService.saveCard(card);
    return card;
  }

  /**
   * Ottiene tutte le card
   */
  async getAll(): Promise<Card[]> {
    return storageService.getAllCards();
  }

  /**
   * Ottiene una card per ID
   */
  async getById(id: string): Promise<Card | null> {
    return storageService.getCardById(id);
  }

  /**
   * Aggiorna una card
   */
  async update(id: string, updates: UpdateCardData): Promise<Card | null> {
    return storageService.updateCard(id, updates);
  }

  /**
   * Elimina una card
   */
  async delete(id: string): Promise<boolean> {
    return storageService.deleteCard(id);
  }

  /**
   * Ottiene tutte le card dovute per review (incluse nuove e in learning)
   */
  async getDueCards(): Promise<Card[]> {
    const allCards = await this.getAll();
    const now = new Date();

    return allCards.filter(card => fsrsService.isDue(card, now));
  }

  /**
   * Ottiene solo le card nuove (mai studiate)
   */
  async getNewCards(): Promise<Card[]> {
    const allCards = await this.getAll();
    return allCards.filter(card => fsrsService.isNew(card));
  }

  /**
   * Ottiene le card in fase di apprendimento
   */
  async getLearningCards(): Promise<Card[]> {
    const allCards = await this.getAll();
    return allCards.filter(card => fsrsService.isLearning(card));
  }

  /**
   * Ottiene le card in review (già apprese)
   */
  async getReviewCards(): Promise<Card[]> {
    const allCards = await this.getAll();
    return allCards.filter(card => fsrsService.isReview(card));
  }

  /**
   * Processa una review
   */
  async reviewCard(cardId: string, rating: Rating): Promise<Card> {
    const card = await this.getById(cardId);
    if (!card) {
      throw new Error(`Card not found: ${cardId}`);
    }

    const now = new Date();
    const previousState = card.fsrsData.state;

    // Processa la review con FSRS
    const updatedCard = fsrsService.processReview(card, rating, now);

    // Salva la card aggiornata
    storageService.saveCard(updatedCard);

    // Salva il log della review
    const nextDue = updatedCard.fsrsData.due;
    const scheduledDays = Math.round(
      (nextDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    storageService.saveReviewLog({
      cardId: card.id,
      rating,
      reviewedAt: now,
      previousState,
      newState: updatedCard.fsrsData.state,
      scheduledDays,
    });

    return updatedCard;
  }

  /**
   * Cerca card per testo (front, back, context, tags)
   */
  async search(query: string): Promise<Card[]> {
    const allCards = await this.getAll();
    const lowerQuery = query.toLowerCase();

    return allCards.filter(card =>
      card.front.toLowerCase().includes(lowerQuery) ||
      card.back.toLowerCase().includes(lowerQuery) ||
      card.context.toLowerCase().includes(lowerQuery) ||
      card.contextTranslation.toLowerCase().includes(lowerQuery) ||
      card.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Filtra card per tag
   */
  async getByTag(tag: string): Promise<Card[]> {
    const allCards = await this.getAll();
    return allCards.filter(card => card.tags.includes(tag));
  }

  /**
   * Ottiene tutti i tag unici
   */
  async getAllTags(): Promise<string[]> {
    const allCards = await this.getAll();
    const tagsSet = new Set<string>();

    allCards.forEach(card => {
      card.tags.forEach(tag => tagsSet.add(tag));
    });

    return Array.from(tagsSet).sort();
  }

  /**
   * Ottiene statistiche utente
   */
  async getStats(): Promise<UserStats> {
    const allCards = await this.getAll();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const dueCards = allCards.filter(card => fsrsService.isDue(card, now));
    const newCards = allCards.filter(card => fsrsService.isNew(card));
    const learningCards = allCards.filter(card => fsrsService.isLearning(card));

    // Review oggi
    const allReviews = storageService.getAllReviewLogs();
    const reviewedToday = allReviews.filter(log => {
      const reviewDate = new Date(log.reviewedAt);
      return reviewDate >= today;
    }).length;

    // Streak (giorni consecutivi con almeno 1 review)
    const { currentStreak, longestStreak, lastReviewDate } = this.calculateStreaks(allReviews);

    return {
      totalCards: allCards.length,
      dueCards: dueCards.length,
      newCards: newCards.length,
      learningCards: learningCards.length,
      reviewedToday,
      currentStreak,
      longestStreak,
      lastReviewDate,
    };
  }

  /**
   * Calcola streak di review consecutivi
   */
  private calculateStreaks(reviews: any[]): {
    currentStreak: number;
    longestStreak: number;
    lastReviewDate: Date | null;
  } {
    if (reviews.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastReviewDate: null };
    }

    // Ordina per data
    const sortedReviews = [...reviews].sort(
      (a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime()
    );

    const lastReviewDate = new Date(sortedReviews[0].reviewedAt);

    // Raggruppa per giorno
    const reviewsByDay = new Map<string, number>();
    sortedReviews.forEach(review => {
      const date = new Date(review.reviewedAt);
      const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      reviewsByDay.set(dayKey, (reviewsByDay.get(dayKey) || 0) + 1);
    });

    const days = Array.from(reviewsByDay.keys()).sort().reverse();

    // Calcola streak corrente
    let currentStreak = 0;
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    let checkDate = new Date(today);
    let checkKey = todayKey;

    while (reviewsByDay.has(checkKey)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
      checkKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
    }

    // Calcola streak più lungo
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    days.forEach(dayKey => {
      const parts = dayKey.split('-').map(Number);
      const year = parts[0] || 0;
      const month = parts[1] || 0;
      const day = parts[2] || 0;
      const currentDate = new Date(year, month, day);

      if (prevDate === null) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round(
          (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }

      prevDate = currentDate;
    });

    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak, lastReviewDate };
  }

  /**
   * Esporta tutte le card in JSON
   */
  async exportData(): Promise<string> {
    const data = storageService.exportAll();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Importa card da JSON
   */
  async importData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    storageService.importAll(data);
  }
}

// Export singleton instance
export const cardService = new CardService();
