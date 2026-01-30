'use client';

import { useMemo } from 'react';
import Tag from './Tag';
import type { TagFilterProps, FilterMode } from '@/lib/types/components';

export default function TagFilter({
  selectedTags,
  onTagsChange,
  tagStats,
  filterMode = 'any',
  onFilterModeChange,
  showCounts = true,
  className = '',
}: TagFilterProps) {
  const handleTagClick = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    if (isSelected) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleClearAll = () => {
    onTagsChange([]);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onFilterModeChange) {
      onFilterModeChange(e.target.value as FilterMode);
    }
  };

  // Calculate matching card count
  const matchingCount = useMemo(() => {
    if (selectedTags.length === 0) return 0;

    // This is a simplified calculation
    // In reality, you'd need to query CardService
    // For now, we'll sum the counts (assuming 'any' mode)
    if (filterMode === 'any') {
      return tagStats
        .filter(stat => selectedTags.includes(stat.tag))
        .reduce((sum, stat) => sum + stat.count, 0);
    } else {
      // For 'all' mode, we'd need intersection logic
      // Return the minimum count as approximation
      const selectedStats = tagStats.filter(stat => selectedTags.includes(stat.tag));
      return selectedStats.length > 0
        ? Math.min(...selectedStats.map(s => s.count))
        : 0;
    }
  }, [selectedTags, tagStats, filterMode]);

  const isEmpty = tagStats.length === 0;
  const hasSelection = selectedTags.length > 0;

  return (
    <div className={`${className}`} role="group" aria-label="Filter by tags">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4">
        {/* Filter Mode Toggle */}
        {onFilterModeChange && (
          <div className="relative">
            <select
              value={filterMode}
              onChange={handleModeChange}
              className="
                appearance-none
                bg-secondary-100 hover:bg-secondary-200
                text-secondary-700
                rounded-lg
                px-3 py-2
                pr-8
                text-sm md:text-base
                font-medium
                cursor-pointer
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-secondary-500
              "
              aria-label="Filter mode"
            >
              <option value="any">Any Tag</option>
              <option value="all">All Tags</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-secondary-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Clear All Button */}
        {hasSelection && (
          <button
            type="button"
            onClick={handleClearAll}
            className="
              text-sm md:text-base
              text-secondary-600 hover:text-secondary-800
              font-medium
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 rounded
            "
            aria-label="Clear all selected tags"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Tag Grid */}
      {isEmpty ? (
        <div className="text-center py-8 text-gray-500 text-sm md:text-base">
          No tags yet. Add tags to your cards to filter them.
        </div>
      ) : (
        <div
          className="
            flex flex-wrap gap-2 md:gap-3
            mb-4
          "
        >
          {tagStats.map(({ tag, count }) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Tag
                key={tag}
                label={tag}
                variant={isSelected ? 'selected' : 'filter'}
                size="md"
                count={showCounts ? count : undefined}
                onClick={() => handleTagClick(tag)}
              />
            );
          })}
        </div>
      )}

      {/* Selection Summary */}
      {hasSelection && (
        <div
          className="
            text-sm text-secondary-600 text-center
            pt-3 border-t border-gray-200
          "
          aria-live="polite"
        >
          {selectedTags.length} {selectedTags.length === 1 ? 'tag' : 'tags'} selected
          {matchingCount > 0 && ` • ${matchingCount} cards match`}
        </div>
      )}
    </div>
  );
}
