'use client';

import { useState, useEffect } from 'react';
import { TagInput, TagFilter } from '@/components/tags';
import { cardService } from '@/lib/storage/card-service';
import type { TagStat } from '@/lib/types/components';
import Container from '@/components/ui/Container';

export default function TestTagsPage() {
  const [inputTags, setInputTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagStats, setTagStats] = useState<TagStat[]>([]);
  const [filterMode, setFilterMode] = useState<'any' | 'all'>('any');
  const [filteredCardCount, setFilteredCardCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    updateFilteredCount();
  }, [selectedTags, filterMode]);

  const loadData = async () => {
    const tags = await cardService.getAllTags();
    setAvailableTags(tags);
    const stats = await cardService.getTagStats();
    setTagStats(stats);
  };

  const updateFilteredCount = async () => {
    if (selectedTags.length === 0) {
      setFilteredCardCount(0);
      return;
    }

    const filtered = await cardService.getByTags(selectedTags, filterMode);
    setFilteredCardCount(filtered.length);
  };

  return (
    <Container className="py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Tag Components Test
      </h1>

      {/* TagInput Test */}
      <section className="mb-12 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          TagInput Component
        </h2>
        <TagInput
          value={inputTags}
          onChange={setInputTags}
          availableTags={availableTags}
          label="Tags"
          helperText="Enter tags (press Enter or comma to add)"
          maxTags={10}
        />
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <p className="text-sm font-mono text-gray-700">
            Selected: {JSON.stringify(inputTags, null, 2)}
          </p>
        </div>
      </section>

      {/* TagFilter Test */}
      <section className="mb-12 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          TagFilter Component
        </h2>
        <TagFilter
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          tagStats={tagStats}
          filterMode={filterMode}
          onFilterModeChange={setFilterMode}
          showCounts
        />
        <div className="mt-4 p-4 bg-gray-50 rounded space-y-2">
          <p className="text-sm font-mono text-gray-700">
            Selected: {JSON.stringify(selectedTags, null, 2)}
          </p>
          <p className="text-sm font-mono text-gray-700">
            Mode: {filterMode}
          </p>
          <p className="text-sm font-mono text-gray-700">
            Filtered Cards: {filteredCardCount}
          </p>
        </div>
      </section>

      {/* Instructions */}
      <section className="p-6 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">
          Test Instructions
        </h2>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Type in TagInput and press Enter or comma to add tags</li>
          <li>• Use Arrow keys to navigate autocomplete suggestions</li>
          <li>• Press Backspace when input is empty to remove last tag</li>
          <li>• Click × to remove individual tags</li>
          <li>• Click tags in TagFilter to select/deselect them</li>
          <li>• Toggle between Any/All filter modes</li>
          <li>• Use Clear button to deselect all tags</li>
          <li>• Test keyboard navigation with Tab and Enter</li>
        </ul>
      </section>
    </Container>
  );
}
