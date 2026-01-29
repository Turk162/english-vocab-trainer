import { FSRS, Rating, Card as FSRSCard, RecordLogItem, State, createEmptyCard } from 'ts-fsrs';
import { Card } from '../types/card';

/**
 * Service per gestire l'algoritmo FSRS (Free Spaced Repetition Scheduler)
 */
export class FSRSService {
  private fsrs: FSRS;

  constructor() {
    // Inizializza FSRS con parametri di default
    // Puoi personalizzare i parametri se necessario
    this.fsrs = new FSRS({});
  }

  /**
   * Crea una nuova card FSRS vuota (per nuove flashcard)
   */
  createNewCard(): FSRSCard {
    return createEmptyCard(new Date());
  }

  /**
   * Processa una review e restituisce la card aggiornata con il nuovo scheduling
   *
   * @param card - Card da aggiornare
   * @param rating - Rating della review (Again=1, Hard=2, Good=3, Easy=4)
   * @param now - Data/ora della review (default: ora corrente)
   * @returns Card aggiornata con nuovi dati FSRS
   */
  processReview(card: Card, rating: Rating, now: Date = new Date()): Card {
    const scheduling = this.fsrs.repeat(card.fsrsData, now);

    // Seleziona il risultato in base al rating
    let recordLog: RecordLogItem;
    switch (rating) {
      case Rating.Again:
        recordLog = scheduling[Rating.Again];
        break;
      case Rating.Hard:
        recordLog = scheduling[Rating.Hard];
        break;
      case Rating.Good:
        recordLog = scheduling[Rating.Good];
        break;
      case Rating.Easy:
        recordLog = scheduling[Rating.Easy];
        break;
      default:
        throw new Error(`Invalid rating: ${rating}`);
    }

    return {
      ...card,
      fsrsData: recordLog.card,
      updatedAt: now,
    };
  }

  /**
   * Verifica se una card è dovuta per la review
   *
   * @param card - Card da verificare
   * @param now - Data/ora corrente (default: ora corrente)
   * @returns true se la card è dovuta, false altrimenti
   */
  isDue(card: Card, now: Date = new Date()): boolean {
    return card.fsrsData.due <= now;
  }

  /**
   * Ottiene il prossimo intervallo di review suggerito per ogni rating
   * Utile per mostrare all'utente quanto tempo passerà prima della prossima review
   *
   * @param card - Card per cui calcolare gli intervalli
   * @param now - Data/ora corrente (default: ora corrente)
   * @returns Oggetto con gli intervalli in giorni per ogni rating
   */
  getNextIntervals(card: Card, now: Date = new Date()): {
    again: number;
    hard: number;
    good: number;
    easy: number;
  } {
    const scheduling = this.fsrs.repeat(card.fsrsData, now);

    return {
      again: this.calculateDays(scheduling[Rating.Again].card.due, now),
      hard: this.calculateDays(scheduling[Rating.Hard].card.due, now),
      good: this.calculateDays(scheduling[Rating.Good].card.due, now),
      easy: this.calculateDays(scheduling[Rating.Easy].card.due, now),
    };
  }

  /**
   * Calcola i giorni tra due date
   */
  private calculateDays(futureDate: Date, currentDate: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const diff = futureDate.getTime() - currentDate.getTime();
    return Math.round(diff / msPerDay);
  }

  /**
   * Ottiene lo stato corrente della card
   */
  getCardState(card: Card): State {
    return card.fsrsData.state;
  }

  /**
   * Verifica se è una card nuova (mai studiata)
   */
  isNew(card: Card): boolean {
    return card.fsrsData.state === State.New;
  }

  /**
   * Verifica se è una card in fase di apprendimento
   */
  isLearning(card: Card): boolean {
    return card.fsrsData.state === State.Learning || card.fsrsData.state === State.Relearning;
  }

  /**
   * Verifica se è una card in review (già appresa)
   */
  isReview(card: Card): boolean {
    return card.fsrsData.state === State.Review;
  }
}

// Export singleton instance
export const fsrsService = new FSRSService();

// Export Rating enum per comodità
export { Rating };
