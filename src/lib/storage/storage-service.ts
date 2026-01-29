import { Card, UpdateCardData, ReviewLog } from '../types/card';

const CARDS_KEY = 'vocab_cards';
const REVIEWS_KEY = 'vocab_reviews';

/**
 * Service per la gestione dello storage (localStorage)
 * TODO: Migrare a IndexedDB per dataset grandi (>5MB)
 */
export class StorageService {
  /**
   * Salva tutte le card nello storage
   */
  private saveCards(cards: Card[]): void {
    try {
      localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Consider migrating to IndexedDB.');
      }
      throw error;
    }
  }

  /**
   * Ottiene tutte le card dallo storage
   */
  getAllCards(): Card[] {
    try {
      const data = localStorage.getItem(CARDS_KEY);
      if (!data) return [];

      const cards = JSON.parse(data);
      // Converti le date da stringhe a Date objects
      return cards.map((card: any) => ({
        ...card,
        createdAt: new Date(card.createdAt),
        updatedAt: new Date(card.updatedAt),
        fsrsData: {
          ...card.fsrsData,
          due: new Date(card.fsrsData.due),
          last_review: card.fsrsData.last_review ? new Date(card.fsrsData.last_review) : undefined,
        },
      }));
    } catch (error) {
      console.error('Error loading cards:', error);
      return [];
    }
  }

  /**
   * Ottiene una card per ID
   */
  getCardById(id: string): Card | null {
    const cards = this.getAllCards();
    return cards.find(card => card.id === id) || null;
  }

  /**
   * Salva una nuova card
   */
  saveCard(card: Card): void {
    const cards = this.getAllCards();
    const existingIndex = cards.findIndex(c => c.id === card.id);

    if (existingIndex >= 0) {
      cards[existingIndex] = card;
    } else {
      cards.push(card);
    }

    this.saveCards(cards);
  }

  /**
   * Aggiorna una card esistente
   */
  updateCard(id: string, updates: UpdateCardData): Card | null {
    const cards = this.getAllCards();
    const index = cards.findIndex(c => c.id === id);

    if (index < 0) return null;

    const updatedCard = {
      ...cards[index],
      ...updates,
      updatedAt: new Date(),
    } as Card;

    cards[index] = updatedCard;
    this.saveCards(cards);

    return updatedCard;
  }

  /**
   * Elimina una card
   */
  deleteCard(id: string): boolean {
    const cards = this.getAllCards();
    const filteredCards = cards.filter(c => c.id !== id);

    if (filteredCards.length === cards.length) {
      return false; // Card non trovata
    }

    this.saveCards(filteredCards);
    return true;
  }

  /**
   * Salva un log di review
   */
  saveReviewLog(log: ReviewLog): void {
    try {
      const logs = this.getAllReviewLogs();
      logs.push(log);
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving review log:', error);
    }
  }

  /**
   * Ottiene tutti i log di review
   */
  getAllReviewLogs(): ReviewLog[] {
    try {
      const data = localStorage.getItem(REVIEWS_KEY);
      if (!data) return [];

      const logs = JSON.parse(data);
      return logs.map((log: any) => ({
        ...log,
        reviewedAt: new Date(log.reviewedAt),
      }));
    } catch (error) {
      console.error('Error loading review logs:', error);
      return [];
    }
  }

  /**
   * Ottiene i log di review per una specifica card
   */
  getReviewLogsByCardId(cardId: string): ReviewLog[] {
    const logs = this.getAllReviewLogs();
    return logs.filter(log => log.cardId === cardId);
  }

  /**
   * Esporta tutti i dati (cards + reviews) in formato JSON
   */
  exportAll(): { cards: Card[]; reviews: ReviewLog[] } {
    return {
      cards: this.getAllCards(),
      reviews: this.getAllReviewLogs(),
    };
  }

  /**
   * Importa dati da backup JSON
   */
  importAll(data: { cards: Card[]; reviews: ReviewLog[] }): void {
    // Converti date strings a Date objects
    const cards = data.cards.map((card: any) => ({
      ...card,
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt),
      fsrsData: {
        ...card.fsrsData,
        due: new Date(card.fsrsData.due),
        last_review: card.fsrsData.last_review ? new Date(card.fsrsData.last_review) : undefined,
      },
    }));

    const reviews = data.reviews.map((review: any) => ({
      ...review,
      reviewedAt: new Date(review.reviewedAt),
    }));

    this.saveCards(cards);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }

  /**
   * Pulisce tutti i dati (usa con cautela!)
   */
  clearAll(): void {
    localStorage.removeItem(CARDS_KEY);
    localStorage.removeItem(REVIEWS_KEY);
  }
}

// Export singleton instance
export const storageService = new StorageService();
