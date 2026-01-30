'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import FlashCard from '@/components/flashcard/FlashCard';
import RatingButtons from '@/components/flashcard/RatingButtons';
import { ProgressBar, ReviewSummary } from '@/components/review';
import { useReviewSession } from '@/hooks/useReviewSession';

export default function ReviewPage() {
  const router = useRouter();
  const {
    currentCard,
    isLoading,
    error,
    sessionStats,
    isSessionComplete,
    loadDueCards,
    handleRate,
    resetSession,
    retryLoad,
  } = useReviewSession();

  const [isFlipped, setIsFlipped] = useState(false);

  // Load cards on mount
  useEffect(() => {
    loadDueCards();
  }, [loadDueCards]);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentCard?.id]);

  // Handlers
  const handleFlip = () => {
    if (!isLoading) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleRatingClick = async (rating: number) => {
    await handleRate(rating);
  };

  const handleReviewMore = async () => {
    resetSession();
    await loadDueCards();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleAddCards = () => {
    router.push('/cards/new');
  };

  // LOADING STATE (initial)
  if (isLoading && !currentCard) {
    return (
      <Container className="py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-lg text-secondary-600">Loading cards...</p>
        </div>
      </Container>
    );
  }

  // ERROR STATE (initial)
  if (error && !currentCard) {
    return (
      <Container className="py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center space-y-4">
            <div className="text-5xl">⚠️</div>
            <h2 className="text-2xl font-bold text-red-900">Error Loading Cards</h2>
            <p className="text-red-700">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="primary" onClick={retryLoad} fullWidth>
                Try Again
              </Button>
              <Button variant="secondary" onClick={handleGoHome} fullWidth>
                Back Home
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // EMPTY STATE
  if (!currentCard && !isLoading && sessionStats.total === 0) {
    return (
      <Container className="py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-xl p-8 text-center space-y-4">
            <div className="text-6xl mb-2">🎉</div>
            <h2 className="text-3xl font-bold text-primary-900">All Caught Up!</h2>
            <p className="text-lg text-primary-700">
              No cards due for review right now.
            </p>
            <p className="text-sm text-primary-600">
              Come back later or add more cards to your collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="primary" onClick={handleGoHome} fullWidth>
                Back Home
              </Button>
              <Button variant="secondary" onClick={handleAddCards} fullWidth>
                Add Cards
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // SESSION COMPLETE
  if (isSessionComplete) {
    return (
      <Container className="py-12">
        <ReviewSummary
          stats={sessionStats}
          onReviewMore={handleReviewMore}
          onGoHome={handleGoHome}
        />
      </Container>
    );
  }

  // REVIEW IN PROGRESS
  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress Bar */}
        <ProgressBar
          current={sessionStats.reviewed}
          total={sessionStats.total}
        />

        {/* Error Toast (during review) */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="text-red-500 mr-3 text-xl">⚠️</div>
              <div>
                <p className="text-sm font-medium text-red-800">
                  Error saving review
                </p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <p className="text-xs text-red-600 mt-2">
                  Please try rating again
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FlashCard */}
        {currentCard && (
          <FlashCard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            disabled={isLoading}
          />
        )}

        {/* Helper Text */}
        <div className="text-center">
          {!isFlipped ? (
            <p className="text-sm text-secondary-600">
              Click the card to reveal the answer
            </p>
          ) : (
            <p className="text-sm text-secondary-700 font-medium">
              Rate how well you remembered this word
            </p>
          )}
        </div>

        {/* Rating Buttons */}
        <RatingButtons
          onRate={handleRatingClick}
          disabled={!isFlipped || isLoading}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 shadow-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
