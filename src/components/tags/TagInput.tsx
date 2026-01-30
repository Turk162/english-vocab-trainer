'use client';

import { useId, useRef, useEffect, useState } from 'react';
import Tag from './Tag';
import { useTagInput } from '@/hooks/useTagInput';
import type { TagInputProps } from '@/lib/types/components';

export default function TagInput({
  value,
  onChange,
  availableTags = [],
  placeholder = 'Add tag...',
  maxTags,
  label,
  helperText,
  error,
  disabled = false,
  className = '',
}: TagInputProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [duplicateError, setDuplicateError] = useState(false);

  const {
    inputValue,
    setInputValue,
    filteredSuggestions,
    selectedIndex,
    isDropdownOpen,
    setIsDropdownOpen,
    handleKeyDown,
    handleRemoveTag,
    handleSuggestionClick,
  } = useTagInput({ value, onChange, availableTags });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsDropdownOpen]);

  // Open dropdown when typing
  useEffect(() => {
    if (inputValue.length >= 1 && filteredSuggestions.length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [inputValue, filteredSuggestions.length, setIsDropdownOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (duplicateError) setDuplicateError(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check for duplicate before trying to add
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      const isDuplicate = value.some(
        t => t.toLowerCase() === inputValue.trim().toLowerCase()
      );
      if (isDuplicate) {
        e.preventDefault();
        setDuplicateError(true);
        setTimeout(() => setDuplicateError(false), 2000);
        return;
      }
    }

    // Check maxTags
    if ((e.key === 'Enter' || e.key === ',') && maxTags && value.length >= maxTags) {
      e.preventDefault();
      return;
    }

    handleKeyDown(e);
  };

  const handleTagRemove = (index: number) => {
    handleRemoveTag(index);
    inputRef.current?.focus();
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const showDropdown = isDropdownOpen && filteredSuggestions.length > 0 && !disabled;
  const currentError = duplicateError ? 'Tag already exists' : error;

  return (
    <div className={`${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      <div
        className={`
          flex flex-wrap gap-2 items-center
          min-h-[44px] p-2
          border rounded-lg
          bg-white
          transition-all duration-200
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'cursor-text'}
          ${currentError ? 'border-danger-500 focus-within:ring-danger-500' : 'border-gray-300 focus-within:ring-primary-500'}
          ${!disabled && 'focus-within:ring-2 focus-within:ring-offset-0'}
        `}
        onClick={handleContainerClick}
      >
        {value.map((tag, index) => (
          <Tag
            key={`${tag}-${index}`}
            label={tag}
            variant="removable"
            size="md"
            onRemove={() => handleTagRemove(index)}
            disabled={disabled}
          />
        ))}

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled || (maxTags !== undefined && value.length >= maxTags)}
          className="
            flex-1 min-w-[120px]
            outline-none border-none
            px-2 py-1
            text-sm md:text-base
            placeholder:text-gray-400
            disabled:bg-transparent disabled:cursor-not-allowed
          "
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={`${id}-suggestions`}
          aria-activedescendant={
            selectedIndex >= 0 ? `${id}-suggestion-${selectedIndex}` : undefined
          }
          aria-label={label || 'Tag input'}
        />
      </div>

      {showDropdown && (
        <div
          id={`${id}-suggestions`}
          role="listbox"
          className="
            absolute z-10 mt-1 w-full
            bg-white border border-gray-300 rounded-lg shadow-lg
            max-h-[240px] overflow-y-auto
          "
        >
          {filteredSuggestions.map((tag, index) => (
            <div
              key={tag}
              id={`${id}-suggestion-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              className={`
                px-4 py-3
                text-sm md:text-base
                cursor-pointer
                transition-colors
                ${index === selectedIndex ? 'bg-primary-50' : 'hover:bg-primary-50'}
              `}
              onClick={() => handleSuggestionClick(tag)}
              onMouseEnter={() => {
                // Update selectedIndex on hover for keyboard consistency
                if (selectedIndex !== index) {
                  // Don't update to avoid jumpy behavior
                }
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      )}

      {(helperText || currentError) && (
        <p
          className={`
            mt-2 text-sm
            ${currentError ? 'text-danger-600' : 'text-gray-500'}
          `}
          role={currentError ? 'alert' : undefined}
        >
          {currentError || helperText}
        </p>
      )}

      {maxTags && (
        <p className="mt-1 text-xs text-gray-500">
          {value.length} / {maxTags} tags
        </p>
      )}
    </div>
  );
}
