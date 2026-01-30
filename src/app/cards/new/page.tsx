'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { TagInput } from '@/components/tags';
import { cardService } from '@/lib/storage/card-service';
import type { CreateCardData } from '@/lib/types/card';

export default function NewCardPage() {
  const router = useRouter();
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [context, setContext] = useState('');
  const [contextTranslation, setContextTranslation] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Field errors
  const [frontError, setFrontError] = useState('');
  const [backError, setBackError] = useState('');
  const [contextError, setContextError] = useState('');

  useEffect(() => {
    loadAvailableTags();
  }, []);

  const loadAvailableTags = async () => {
    const allTags = await cardService.getAllTags();
    setAvailableTags(allTags);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setFrontError('');
    setBackError('');
    setContextError('');

    // Required fields
    if (!front.trim()) {
      setFrontError('English expression is required');
      isValid = false;
    }

    if (!back.trim()) {
      setBackError('Italian translation is required');
      isValid = false;
    }

    if (!context.trim()) {
      setContextError('English context is required');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cardData: CreateCardData = {
        front: front.trim(),
        back: back.trim(),
        context: context.trim(),
        contextTranslation: contextTranslation.trim() || context.trim(), // Fallback
        tags,
      };

      await cardService.create(cardData);

      // Redirect to cards list
      router.push('/cards');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/cards');
  };

  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Add New Card
        </h1>
        <p className="text-gray-600 mb-8">
          Create a new vocabulary card with English expressions, idioms, or words
        </p>

        {error && (
          <div
            className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg"
            role="alert"
          >
            <p className="text-sm text-danger-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* English Expression */}
          <Input
            label="English Expression"
            placeholder="e.g., serendipity, break the ice"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            error={frontError}
            disabled={isLoading}
            required
          />

          {/* Italian Translation */}
          <Input
            label="Italian Translation"
            placeholder="e.g., serendipità"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            error={backError}
            disabled={isLoading}
            required
          />

          {/* English Context */}
          <div>
            <label
              htmlFor="context"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              English Context <span className="text-danger-500">*</span>
            </label>
            <textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., It was pure serendipity that we met"
              disabled={isLoading}
              required
              rows={3}
              className={`
                w-full px-4 py-3
                text-sm md:text-base
                border rounded-lg
                transition-all duration-200
                placeholder:text-gray-400
                disabled:bg-gray-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-offset-0
                ${
                  contextError
                    ? 'border-danger-500 focus:ring-danger-500'
                    : 'border-gray-300 focus:ring-primary-500'
                }
              `}
            />
            {contextError && (
              <p className="mt-2 text-sm text-danger-600" role="alert">
                {contextError}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Provide a full sentence showing how the word is used
            </p>
          </div>

          {/* Italian Context Translation */}
          <div>
            <label
              htmlFor="contextTranslation"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Italian Context Translation (optional)
            </label>
            <textarea
              id="contextTranslation"
              value={contextTranslation}
              onChange={(e) => setContextTranslation(e.target.value)}
              placeholder="e.g., È stata pura serendipità che ci siamo incontrati"
              disabled={isLoading}
              rows={3}
              className="
                w-full px-4 py-3
                text-sm md:text-base
                border border-gray-300 rounded-lg
                transition-all duration-200
                placeholder:text-gray-400
                disabled:bg-gray-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
              "
            />
            <p className="mt-2 text-xs text-gray-500">
              If not provided, the English context will be used
            </p>
          </div>

          {/* Tags */}
          <TagInput
            label="Tags"
            value={tags}
            onChange={setTags}
            availableTags={availableTags}
            placeholder="Add tags..."
            helperText="Press Enter or comma to add. Helps organize and filter your cards."
            maxTags={10}
            disabled={isLoading}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Saving...' : 'Save Card'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
