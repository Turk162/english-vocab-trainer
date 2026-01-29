'use client';

import { useState } from 'react';
import { FlashCard, RatingButtons } from '@/components/flashcard';
import { Card } from '@/lib/types/card';
import { Rating, State } from 'ts-fsrs';

// Carta mock per test (date fisse per evitare hydration errors)
const mockCard: Card = {
  id: 'test-card-1',
  front: 'serendipity',
  back: 'serendipità',
  context: 'It was pure serendipity that we met at the coffee shop that day',
  contextTranslation: 'È stata pura serendipità che ci siamo incontrati al bar quel giorno',
  tags: ['sostantivi', 'livello-avanzato', 'fortuna'],
  fsrsData: {
    due: new Date('2026-01-29T12:00:00.000Z'),
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: State.New,
    last_review: undefined,
    learning_steps: 0,
  },
  createdAt: new Date('2024-01-15T00:00:00.000Z'),
  updatedAt: new Date('2024-01-15T00:00:00.000Z'),
};

export default function TestFlashCardPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (rating: Rating) => {
    console.log('Rating selezionato:', rating);

    const ratingDescriptions = {
      [Rating.Again]: 'Again (1) - Non ricordata',
      [Rating.Hard]: 'Hard (2) - Difficile',
      [Rating.Good]: 'Good (3) - Bene',
      [Rating.Easy]: 'Easy (4) - Facile',
    };

    console.log('Descrizione:', ratingDescriptions[rating as keyof typeof ratingDescriptions]);

    // Simula processing
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsFlipped(false); // Reset per prossima carta
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-secondary-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-2">
            FlashCard Component Test
          </h1>
          <p className="text-secondary-600">
            Test della flip animation e rating buttons
          </p>
        </div>

        {/* FlashCard */}
        <div className="mb-8">
          <FlashCard
            card={mockCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            disabled={isProcessing}
          />
        </div>

        {/* Rating Buttons */}
        <div className="mb-8">
          <RatingButtons
            onRate={handleRate}
            disabled={!isFlipped || isProcessing}
          />
        </div>

        {/* Info Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">
            Test Info
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-secondary-700">Stato carta:</span>
              <span className={`px-2 py-1 rounded ${isFlipped ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {isFlipped ? 'Flipped (back)' : 'Normal (front)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium text-secondary-700">Processing:</span>
              <span className={`px-2 py-1 rounded ${isProcessing ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                {isProcessing ? 'Yes' : 'No'}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-secondary-200">
              <h3 className="font-medium text-secondary-700 mb-2">Istruzioni:</h3>
              <ul className="list-disc list-inside space-y-1 text-secondary-600">
                <li>Clicca sulla carta per flipparla</li>
                <li>Usa Enter o Spazio per flippare con tastiera</li>
                <li>I rating buttons sono abilitati solo quando la carta è flipped</li>
                <li>Seleziona un rating per vedere il log in console</li>
                <li>Apri DevTools Console per vedere i rating selezionati</li>
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-secondary-200">
              <h3 className="font-medium text-secondary-700 mb-2">Test Checklist:</h3>
              <ul className="list-disc list-inside space-y-1 text-secondary-600">
                <li>✅ Flip animation smooth</li>
                <li>✅ Keyboard navigation (Tab → Enter/Space)</li>
                <li>✅ Rating buttons responsive layout</li>
                <li>✅ Disabled states funzionanti</li>
                <li>✅ Mobile responsive (prova resize)</li>
                <li>✅ Focus visibile</li>
                <li>✅ Color contrast accessibile</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-4 bg-secondary-100 rounded-lg p-4">
          <details>
            <summary className="font-medium text-secondary-700 cursor-pointer">
              Debug: Card Data
            </summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(mockCard, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
