import { useState, useCallback } from 'react';
import { Rating } from 'ts-fsrs';
import { Card } from '@/lib/types/card';
import { SessionStats } from '@/lib/types/components';
import { cardService } from '@/lib/storage/card-service';

export function useReviewSession() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    total: 0,
    reviewed: 0,
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });

  // Computed values
  const currentCard = currentIndex < cards.length ? cards[currentIndex] : null;
  const isSessionComplete = currentIndex >= cards.length && cards.length > 0;
  const progress = cards.length > 0
    ? Math.round((currentIndex / cards.length) * 100)
    : 0;

  // Load due cards
  const loadDueCards = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dueCards = await cardService.getDueCards();

      // Shuffle cards randomly
      const shuffled = [...dueCards].sort(() => Math.random() - 0.5);

      setCards(shuffled);
      setCurrentIndex(0);
      setSessionStats({
        total: shuffled.length,
        reviewed: 0,
        again: 0,
        hard: 0,
        good: 0,
        easy: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cards');
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle rating
  const handleRate = useCallback(async (rating: Rating) => {
    if (!currentCard) return;

    setIsLoading(true);
    setError(null);

    try {
      // cardService.reviewCard handles FSRS processing, saving, and logging
      await cardService.reviewCard(currentCard.id, rating);

      // Update session stats
      setSessionStats(prev => {
        const updated = {
          ...prev,
          reviewed: prev.reviewed + 1,
        };

        // Increment specific rating counter
        switch (rating) {
          case Rating.Again:
            updated.again++;
            break;
          case Rating.Hard:
            updated.hard++;
            break;
          case Rating.Good:
            updated.good++;
            break;
          case Rating.Easy:
            updated.easy++;
            break;
        }

        return updated;
      });

      // Advance to next card
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save review');
      // Don't advance currentIndex on error - user can retry
    } finally {
      setIsLoading(false);
    }
  }, [currentCard]);

  // Reset session
  const resetSession = useCallback(() => {
    setCards([]);
    setCurrentIndex(0);
    setError(null);
    setSessionStats({
      total: 0,
      reviewed: 0,
      again: 0,
      hard: 0,
      good: 0,
      easy: 0,
    });
  }, []);

  // Retry load (convenience wrapper)
  const retryLoad = useCallback(() => {
    loadDueCards();
  }, [loadDueCards]);

  return {
    // State
    cards,
    currentIndex,
    isLoading,
    error,
    sessionStats,
    // Computed
    currentCard,
    isSessionComplete,
    progress,
    // Actions
    loadDueCards,
    handleRate,
    resetSession,
    retryLoad,
  };
}
