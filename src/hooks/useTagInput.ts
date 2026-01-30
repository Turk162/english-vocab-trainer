'use client';

import { useState, useMemo } from 'react';
import { filterTagSuggestions } from '@/lib/utils/tag-utils';

interface UseTagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  availableTags?: string[];
}

export function useTagInput({ value, onChange, availableTags = [] }: UseTagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredSuggestions = useMemo(() =>
    filterTagSuggestions(inputValue, availableTags, value),
    [inputValue, availableTags, value]
  );

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return false;

    // Check if duplicate
    if (value.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      return false; // Duplicate
    }

    onChange([...value, trimmed]);
    setInputValue('');
    setSelectedIndex(-1);
    setIsDropdownOpen(false);
    return true;
  };

  const handleRemoveTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleSuggestionClick = (tag: string) => {
    handleAddTag(tag);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (filteredSuggestions.length > 0) {
          setIsDropdownOpen(true);
          setSelectedIndex(prev =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev
          );
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (filteredSuggestions.length > 0) {
          setIsDropdownOpen(true);
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
          handleAddTag(filteredSuggestions[selectedIndex]);
        } else if (inputValue.trim()) {
          handleAddTag(inputValue);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
        break;

      case 'Backspace':
        if (inputValue === '' && value.length > 0) {
          e.preventDefault();
          handleRemoveTag(value.length - 1);
        }
        break;

      case ',':
        e.preventDefault();
        if (inputValue.trim()) {
          handleAddTag(inputValue);
        }
        break;
    }
  };

  return {
    inputValue,
    setInputValue,
    filteredSuggestions,
    selectedIndex,
    isDropdownOpen,
    setIsDropdownOpen,
    handleKeyDown,
    handleAddTag,
    handleRemoveTag,
    handleSuggestionClick,
  };
}
