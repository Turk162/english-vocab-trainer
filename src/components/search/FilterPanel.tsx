'use client';

import { useState } from 'react';
import type { TagStat, FilterMode } from '@/lib/types/components';

export type SortOption = 'alphabetical' | 'date-newest' | 'date-oldest' | 'difficulty-easy' | 'difficulty-hard';

interface FilterPanelProps {
  // Tag filters
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  tagStats: TagStat[];
  filterMode: FilterMode;
  onFilterModeChange: (mode: FilterMode) => void;

  // Sort
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;

  // UI
  className?: string;
}

/**
 * FilterPanel con tag multi-select e ordinamento
 * Collapsible su mobile
 */
export default function FilterPanel({
  selectedTags,
  onTagsChange,
  tagStats,
  filterMode,
  onFilterModeChange,
  sortBy,
  onSortChange,
  className = '',
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleClearTags = () => {
    onTagsChange([]);
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'date-newest', label: 'Newest First' },
    { value: 'date-oldest', label: 'Oldest First' },
    { value: 'difficulty-easy', label: 'Easiest First' },
    { value: 'difficulty-hard', label: 'Hardest First' },
  ];

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header - Always visible */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Filters & Sort</h2>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
        >
          <svg
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Content - Collapsible on mobile */}
      <div className={`
        p-4 space-y-6
        ${isExpanded ? 'block' : 'hidden'}
        md:block
      `}>
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="
              w-full px-3 py-2
              border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              text-gray-900
            "
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Tags */}
        {tagStats.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Filter by Tags
              </label>
              {selectedTags.length > 0 && (
                <button
                  onClick={handleClearTags}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Tag Filter Mode */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => onFilterModeChange('any')}
                className={`
                  flex-1 px-3 py-1.5 text-sm rounded
                  transition-colors
                  ${filterMode === 'any'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                Any tag
              </button>
              <button
                onClick={() => onFilterModeChange('all')}
                className={`
                  flex-1 px-3 py-1.5 text-sm rounded
                  transition-colors
                  ${filterMode === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                All tags
              </button>
            </div>

            {/* Tag Checkboxes */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tagStats.map((tagStat) => (
                <label
                  key={tagStat.tag}
                  className="
                    flex items-center justify-between
                    p-2 rounded hover:bg-gray-50
                    cursor-pointer transition-colors
                  "
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tagStat.tag)}
                      onChange={() => handleTagToggle(tagStat.tag)}
                      className="
                        w-4 h-4 text-primary-600 border-gray-300 rounded
                        focus:ring-2 focus:ring-primary-500
                      "
                    />
                    <span className="text-sm text-gray-900 truncate">
                      {tagStat.tag}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {tagStat.count}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {(selectedTags.length > 0) && (
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">
              Active filters: {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="
                    inline-flex items-center gap-1
                    px-2 py-1 text-xs
                    bg-primary-100 text-primary-700
                    rounded-full
                  "
                >
                  {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="hover:text-primary-900"
                    aria-label={`Remove ${tag} filter`}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
