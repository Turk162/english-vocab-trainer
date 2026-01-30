'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { SearchBar, FilterPanel } from '@/components/search';
import type { SortOption } from '@/components/search';
import { cardService } from '@/lib/storage/card-service';
import type { Card } from '@/lib/types/card';
import type { TagStat, FilterMode } from '@/lib/types/components';

export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [tagStats, setTagStats] = useState<TagStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>('any');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const allCards = await cardService.getAll();
      const stats = await cardService.getTagStats();
      setCards(allCards);
      setTagStats(stats);
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters, search, and sort
  const filteredAndSortedCards = useMemo(() => {
    let result = [...cards];

    // 1. Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(card =>
        card.front.toLowerCase().includes(query) ||
        card.back.toLowerCase().includes(query) ||
        card.context.toLowerCase().includes(query) ||
        card.contextTranslation.toLowerCase().includes(query)
      );
    }

    // 2. Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter(card => {
        if (filterMode === 'all') {
          // Card must have ALL selected tags
          return selectedTags.every(tag => card.tags.includes(tag));
        } else {
          // Card must have ANY of the selected tags
          return selectedTags.some(tag => card.tags.includes(tag));
        }
      });
    }

    // 3. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.front.localeCompare(b.front);

        case 'date-newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        case 'date-oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

        case 'difficulty-easy':
          // Lower difficulty = easier
          return a.fsrsData.difficulty - b.fsrsData.difficulty;

        case 'difficulty-hard':
          // Higher difficulty = harder
          return b.fsrsData.difficulty - a.fsrsData.difficulty;

        default:
          return 0;
      }
    });

    return result;
  }, [cards, searchQuery, selectedTags, filterMode, sortBy]);

  const handleAddCard = () => {
    router.push('/cards/new');
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card?')) {
      return;
    }

    try {
      await cardService.delete(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading cards...</p>
        </div>
      </Container>
    );
  }

  const hasActiveFilters = searchQuery.trim() || selectedTags.length > 0;

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Vocabulary Cards
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            {filteredAndSortedCards.length} of {cards.length} {cards.length === 1 ? 'card' : 'cards'}
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
        <Button variant="primary" onClick={handleAddCard}>
          + Add Card
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search in front, back, context..."
        />
      </div>

      {/* Filter Panel */}
      {tagStats.length > 0 && (
        <div className="mb-6">
          <FilterPanel
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            tagStats={tagStats}
            filterMode={filterMode}
            onFilterModeChange={setFilterMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      )}

      {/* Cards List */}
      {filteredAndSortedCards.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">
            {cards.length === 0
              ? 'No cards yet. Create your first vocabulary card!'
              : hasActiveFilters
              ? 'No cards match your search or filters.'
              : 'No cards to display.'}
          </p>
          {cards.length === 0 ? (
            <Button variant="primary" onClick={handleAddCard}>
              Create First Card
            </Button>
          ) : hasActiveFilters ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTags([]);
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {filteredAndSortedCards.map((card) => (
            <div
              key={card.id}
              className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {card.front}
                  </h3>
                  <p className="text-lg text-gray-700">{card.back}</p>
                </div>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="
                    ml-4 p-2 text-gray-400 hover:text-danger-600
                    transition-colors rounded
                    focus:outline-none focus:ring-2 focus:ring-danger-500
                  "
                  aria-label="Delete card"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>

              {/* Context */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 italic">&quot;{card.context}&quot;</p>
                {card.contextTranslation && (
                  <p className="text-sm text-gray-500 mt-1">
                    &quot;{card.contextTranslation}&quot;
                  </p>
                )}
              </div>

              {/* Tags */}
              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="
                        inline-block px-3 py-1 text-xs md:text-sm
                        bg-primary-100 text-primary-700
                        rounded-full font-medium
                      "
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Metadata */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    Created: {new Date(card.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>
                    Reviews: {card.fsrsData.reps}
                  </span>
                  <span>•</span>
                  <span>
                    Difficulty: {card.fsrsData.difficulty.toFixed(2)}
                  </span>
                  {card.fsrsData.state !== 0 && (
                    <>
                      <span>•</span>
                      <span>
                        Next: {new Date(card.fsrsData.due).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
