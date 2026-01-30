/**
 * Normalizza tag per confronti (trim + lowercase)
 */
export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

/**
 * Verifica se tag è duplicato (case-insensitive)
 */
export function isDuplicateTag(tag: string, existingTags: string[]): boolean {
  const normalized = normalizeTag(tag);
  return existingTags.some(t => normalizeTag(t) === normalized);
}

/**
 * Filtra suggestions per autocomplete
 */
export function filterTagSuggestions(
  query: string,
  availableTags: string[],
  selectedTags: string[]
): string[] {
  if (!query) return [];

  const normalizedQuery = normalizeTag(query);

  return availableTags
    .filter(tag => {
      if (isDuplicateTag(tag, selectedTags)) return false;
      return normalizeTag(tag).includes(normalizedQuery);
    })
    .slice(0, 7);
}
